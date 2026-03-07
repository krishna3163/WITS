import React, { useState, useEffect, useRef } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, Edit, PenSquare, MessageSquare, Send } from 'lucide-react';
import classNames from 'classnames';
import { useAuthStore } from '../../store/authStore';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API_BASE_URL = 'http://localhost:8080';
const WS_BASE_URL = 'http://localhost:8081/ws-chat'; // Directly hit inner edge to avoid Gateway SockJS overhead temporarily

export default function ChatScreen() {
    const { isExpanded, isMedium } = useResponsive();
    const { session } = useAuthStore();
    const userId = session?.user?.id;

    const [conversations, setConversations] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState('');

    const stompClientRef = useRef<Client | null>(null);

    const showSplit = isExpanded || isMedium;
    const hideList = !showSplit && activeChat !== null;

    useEffect(() => {
        if (!userId) return;

        // 1. Fetch Conversations
        fetch(`${API_BASE_URL}/api/conversations/${userId}`, {
            headers: {
                'Authorization': `Bearer ${session?.access_token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setConversations(data);
            })
            .catch(err => console.error("Error fetching conversations:", err));

        // 2. Setup STOMP WebSocket
        const socket = new SockJS(WS_BASE_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP Connected to Backend');
            },
            onStompError: (frame) => {
                console.error('Broker Error:', frame.headers['message']);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [userId, session]);

    // 3. Load Active Chat Messages
    useEffect(() => {
        if (!activeChat || !userId || !stompClientRef.current) return;

        // Load History
        fetch(`${API_BASE_URL}/api/messages/${activeChat.id}`, {
            headers: {
                'Authorization': `Bearer ${session?.access_token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(err => console.error("Error fetching messages:", err));

        // Subscribe to Topic
        const subscription = stompClientRef.current.subscribe(
            `/topic/conversation/${activeChat.id}`,
            (message) => {
                const newMsg = JSON.parse(message.body);
                setMessages(prev => [...prev, newMsg]);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [activeChat, userId, session]);

    // 4. Send Message via STOMP
    const handleSendMessage = () => {
        if (!messageInput.trim() || !activeChat || !userId || !stompClientRef.current) return;

        const msgObj = {
            conversationId: activeChat.id,
            senderId: userId,
            content: messageInput
        };

        // Fire directly to Websocket Channel!
        stompClientRef.current.publish({
            destination: '/app/chat.send',
            body: JSON.stringify(msgObj)
        });

        setMessageInput('');
    };

    return (
        <div className="flex h-full w-full bg-surface-light dark:bg-surface-dark overflow-hidden transition-colors duration-300">
            {/* Master List */}
            {!hideList && (
                <div className={classNames(
                    "h-full flex flex-col border-r border-gray-200 dark:border-gray-800 transition-all duration-300 relative",
                    {
                        "w-[360px] flex-shrink-0": showSplit,
                        "w-full": !showSplit
                    }
                )}>
                    <div className="px-5 pt-8 pb-4 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-[32px] font-semibold tracking-tight text-gray-900 dark:text-gray-100">Chats</h1>
                            <div className="flex gap-4">
                                <button className="text-gray-600 hover:text-primary-light transition-colors"><Edit size={24} strokeWidth={1.5} /></button>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-[28px] py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
                        {conversations.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={classNames(
                                    "flex items-center gap-4 px-4 py-3 mx-2 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5",
                                    { "bg-primary-container-light/30 dark:bg-primary-container-dark/40": activeChat?.id === chat.id }
                                )}
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-light to-secondary-light flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {chat.name ? chat.name[0]?.toUpperCase() : '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {chat.name || 'Private Conversation'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate text-emerald-500">Tap to start messaging</p>
                                </div>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                No active chats yet.
                            </div>
                        )}
                    </div>

                    {/* FAB */}
                    <button className="absolute bottom-24 right-6 w-14 h-14 rounded-2xl bg-primary-light dark:bg-primary-dark text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200">
                        <PenSquare size={24} />
                    </button>
                </div>
            )}

            {/* Detail View */}
            {(showSplit || (!showSplit && activeChat !== null)) && (
                <div className="flex-1 h-full flex flex-col bg-gray-50 dark:bg-[#121212] relative">
                    {activeChat !== null ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black top-0 sticky z-10 w-full">
                                {!showSplit && (
                                    <button onClick={() => setActiveChat(null)} className="mr-4 text-primary-light font-medium">Back</button>
                                )}
                                <div className="w-10 h-10 rounded-full bg-primary-light mr-4 flex items-center justify-center text-white font-bold shadow-sm">
                                    {activeChat.name ? activeChat.name[0]?.toUpperCase() : '?'}
                                </div>
                                <h2 className="text-xl font-semibold dark:text-white">{activeChat.name || 'Private Conversation'}</h2>
                            </div>

                            {/* Messages Stream */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-20">
                                {messages.map((msg, i) => {
                                    const isMe = msg.senderId === userId;
                                    return (
                                        <div key={i} className={classNames("flex", isMe ? "justify-end" : "justify-start animate-in slide-in-from-left-2 fade-in duration-300")}>
                                            <div className={classNames(
                                                "max-w-[70%] rounded-2xl px-5 py-3 shadow-md",
                                                isMe ? "bg-gradient-to-br from-primary-light to-primary-dark text-white rounded-br-sm animate-in slide-in-from-right-2 fade-in duration-300" : "bg-white dark:bg-gray-800 dark:text-gray-100 text-gray-900 rounded-bl-sm"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 absolute bottom-0 w-full shadow-lg">
                                <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 border border-transparent focus-within:border-primary-light/50 transition-colors">
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent outline-none dark:text-white"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className={classNames(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                                            messageInput.trim().length > 0 ? "bg-primary-light text-white shadow-md hover:scale-105" : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                                        )}
                                        disabled={!messageInput.trim()}
                                    >
                                        <Send size={18} className={messageInput.trim().length > 0 ? "translate-x-0.5" : ""} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
                            <MessageSquare size={64} strokeWidth={1} className="mb-4 opacity-50" />
                            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">Your Messages</h2>
                            <p className="mt-2 text-sm max-w-xs text-center">Select a chat from the timeline or start a new encrypted conversation.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
