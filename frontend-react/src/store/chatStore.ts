import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageStatus = 'sent' | 'delivered' | 'seen' | 'error';
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'STICKER' | 'GIF' | 'POLL' | 'EVENT';

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: MessageType;
    status: MessageStatus;
    created_at: string;
    metadata?: any;
    reply_to?: string;
    reactions?: Record<string, string[]>;
    expires_at?: string;
    view_once?: boolean;
}

export type CommunityRole = 'owner' | 'admin' | 'moderator' | 'member';

interface ChatState {
    typingUsers: Record<string, string[]>;
    recordingUsers: Record<string, string[]>;
    onlineUsers: Set<string>;
    starredMessages: Set<string>;
    mutedChats: Set<string>;
    archivedChats: Set<string>;

    // Community & Status
    activeCommunityId: string | null;
    activeChannelId: string | null;
    statuses: any[];
    communities: any[];

    totalUnreadCount: number;
    setTotalUnreadCount: (n: number) => void;

    // Actions
    setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
    setRecording: (conversationId: string, userId: string, isRecording: boolean) => void;
    toggleStarred: (messageId: string) => void;
    toggleMute: (conversationId: string) => void;
    toggleArchive: (conversationId: string) => void;
    setOnline: (userId: string, isOnline: boolean) => void;

    setCommunity: (id: string | null) => void;
    setChannel: (id: string | null) => void;
    setStatuses: (statuses: any[]) => void;
    setCommunities: (communities: any[]) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            typingUsers: {},
            recordingUsers: {},
            onlineUsers: new Set(),
            starredMessages: new Set(),
            mutedChats: new Set(),
            archivedChats: new Set(),
            activeCommunityId: null,
            activeChannelId: null,
            statuses: [],
            communities: [],

            totalUnreadCount: 0,
            setTotalUnreadCount: (n) => set({ totalUnreadCount: Math.max(0, n) }),

            setTyping: (conversationId, userId, isTyping) => set((state) => {
                const current = state.typingUsers[conversationId] || [];
                const updated = isTyping
                    ? [...new Set([...current, userId])]
                    : current.filter(id => id !== userId);
                return { typingUsers: { ...state.typingUsers, [conversationId]: updated } };
            }),

            setRecording: (conversationId, userId, isRecording) => set((state) => {
                const current = state.recordingUsers[conversationId] || [];
                const updated = isRecording
                    ? [...new Set([...current, userId])]
                    : current.filter(id => id !== userId);
                return { recordingUsers: { ...state.recordingUsers, [conversationId]: updated } };
            }),

            toggleStarred: (messageId) => set((state) => {
                const next = new Set(state.starredMessages);
                if (next.has(messageId)) next.delete(messageId);
                else next.add(messageId);
                return { starredMessages: next };
            }),

            toggleMute: (conversationId) => set((state) => {
                const next = new Set(state.mutedChats);
                if (next.has(conversationId)) next.delete(conversationId);
                else next.add(conversationId);
                return { mutedChats: next };
            }),

            toggleArchive: (conversationId) => set((state) => {
                const next = new Set(state.archivedChats);
                if (next.has(conversationId)) next.delete(conversationId);
                else next.add(conversationId);
                return { archivedChats: next };
            }),

            setOnline: (userId, isOnline) => set((state) => {
                const next = new Set(state.onlineUsers);
                if (isOnline) next.add(userId);
                else next.delete(userId);
                return { onlineUsers: next };
            }),

            setCommunity: (id) => set({ activeCommunityId: id }),
            setChannel: (id) => set({ activeChannelId: id }),
            setStatuses: (statuses) => set({ statuses }),
            setCommunities: (communities) => set({ communities }),
        }),
        {
            name: 'wits-chat-v2-storage',
            partialize: (state) => ({
                starredMessages: Array.from(state.starredMessages),
                mutedChats: Array.from(state.mutedChats),
                archivedChats: Array.from(state.archivedChats),
                activeCommunityId: state.activeCommunityId,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.starredMessages = new Set(state.starredMessages);
                    state.mutedChats = new Set(state.mutedChats);
                    state.archivedChats = new Set(state.archivedChats);
                    state.onlineUsers = new Set();
                }
            }
        }
    )
);
