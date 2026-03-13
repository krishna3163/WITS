import React, { useState, useEffect } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { insforge } from '../../lib/insforge';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import ChatSettings from './ChatSettings';
import FriendProfile from './FriendProfile';

type ViewState = 'list' | 'chat' | 'settings' | 'friend_profile';

export default function ChatScreen() {
    const { isExpanded, isMedium } = useResponsive();
    const { user } = useAuthStore();
    const { totalUnreadCount, setTotalUnreadCount } = useChatStore();
    const userId = user?.id;

    const [conversations, setConversations] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [viewState, setViewState] = useState<ViewState>('list');

    const showSplit = isExpanded || isMedium;

    useEffect(() => {
        if (!activeChat) {
            setViewState('list');
        } else if (viewState === 'list') {
            setViewState('chat');
        }
    }, [activeChat]);

    useEffect(() => {
        if (!userId) return;
        const fetchConversations = async () => {
            const { data } = await insforge.database
                .from('conversations')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setConversations(data);
                const total = (data as any[]).reduce((sum, c) => sum + (typeof c.unread_count === 'number' ? c.unread_count : 0), 0);
                setTotalUnreadCount(total);
            } else {
                setTotalUnreadCount(0);
            }
        };
        fetchConversations();
    }, [userId, setTotalUnreadCount]);

    const handleBack = () => {
        if (viewState === 'settings' || viewState === 'friend_profile') {
            setViewState('chat');
        } else {
            setActiveChat(null);
            setViewState('list');
        }
    };

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#0A0A0A] overflow-hidden relative">
            {/* List Section */}
            <div className={`h-full border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ${showSplit ? 'w-full max-w-[400px]' : (viewState !== 'list' ? 'hidden' : 'w-full')
                }`}>
                <ChatList
                    conversations={conversations}
                    onSelect={(chat) => {
                        setActiveChat(chat);
                        setViewState('chat');
                        const unread = typeof (chat as any).unread_count === 'number' ? (chat as any).unread_count : 0;
                        setTotalUnreadCount(Math.max(0, totalUnreadCount - unread));
                    }}
                    activeChatId={activeChat?.id}
                />
            </div>

            {/* Content Section */}
            <div className={`h-full flex-1 transition-all duration-300 ${!showSplit && viewState === 'list' ? 'hidden' : 'block'
                }`}>
                {activeChat ? (
                    <>
                        {viewState === 'chat' && (
                            <ChatDetail
                                chat={activeChat}
                                onBack={handleBack}
                                onOpenSettings={() => setViewState(activeChat.is_group ? 'settings' : 'friend_profile')}
                            />
                        )}
                        {viewState === 'settings' && (
                            <ChatSettings
                                chat={activeChat}
                                onBack={handleBack}
                            />
                        )}
                        {viewState === 'friend_profile' && (
                            <FriendProfile
                                user={{ name: activeChat.name }}
                                onBack={handleBack}
                                onStartChat={() => setViewState('chat')}
                            />
                        )}
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 dark:bg-[#0A0A0A]">
                        <div className="w-24 h-24 rounded-[40px] bg-white dark:bg-white/5 shadow-xl flex items-center justify-center text-primary-light mb-6 transition-transform hover:rotate-12">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                        </div>
                        <h2 className="text-xl font-black dark:text-white mb-2 uppercase tracking-widest text-[14px]">Choose a Thread</h2>
                        <p className="text-xs text-gray-500 font-bold max-w-xs text-center opacity-60 uppercase tracking-widest leading-loose px-10">
                            Select a friend or join a channel to start broadcasting your ideas. Secure and encrypted.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
