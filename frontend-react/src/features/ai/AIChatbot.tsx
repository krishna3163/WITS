import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bot, Plus, Send, Trash2, Image, X, ChevronLeft, Menu, Loader } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import classNames from 'classnames';

interface Conversation {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    image_url: string | null;
    created_at: string;
}

const AIChatbot = () => {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConv, setActiveConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const fetchConversations = useCallback(async () => {
        if (!user?.id) return;
        try {
            const { data } = await insforge.database.from('ai_conversations').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
            setConversations((data || []) as Conversation[]);
        } catch (e) { console.error(e); }
    }, [user?.id]);

    const fetchMessages = useCallback(async (convId: string) => {
        setLoading(true);
        try {
            const { data } = await insforge.database.from('ai_messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
            setMessages((data || []) as Message[]);
            scrollToBottom();
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchConversations(); }, [fetchConversations]);

    const createConversation = async () => {
        if (!user?.id) return;
        try {
            const { data, error } = await insforge.database.from('ai_conversations').insert([{
                user_id: user.id,
                title: 'New Chat',
            }]).select();
            if (error) throw error;
            if (data?.[0]) {
                const conv = data[0] as Conversation;
                setConversations(prev => [conv, ...prev]);
                selectConversation(conv);
            }
        } catch (e) { console.error(e); }
    };

    const selectConversation = (conv: Conversation) => {
        setActiveConv(conv);
        fetchMessages(conv.id);
        setSidebarOpen(false);
    };

    const deleteConversation = async (conv: Conversation) => {
        await insforge.database.from('ai_messages').delete().eq('conversation_id', conv.id);
        await insforge.database.from('ai_conversations').delete().eq('id', conv.id);
        setConversations(prev => prev.filter(c => c.id !== conv.id));
        if (activeConv?.id === conv.id) { setActiveConv(null); setMessages([]); }
    };

    const handleImageSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => { setImageFile(null); setImagePreview(null); };

    const sendMessage = async () => {
        if ((!input.trim() && !imageFile) || !user?.id || sending) return;

        let conv = activeConv;
        // Auto-create conversation if none
        if (!conv) {
            try {
                const { data } = await insforge.database.from('ai_conversations').insert([{
                    user_id: user.id,
                    title: input.trim().substring(0, 50) || 'New Chat',
                }]).select();
                if (data?.[0]) {
                    conv = data[0] as Conversation;
                    setActiveConv(conv);
                    setConversations(prev => [conv!, ...prev]);
                }
            } catch (e) { console.error(e); return; }
        }
        if (!conv) return;

        setSending(true);
        let imageUrl: string | null = null;

        // Upload image if selected
        if (imageFile) {
            try {
                const fileName = `ai/${user.id}/${Date.now()}_${imageFile.name}`;
                await insforge.storage.from('images').upload(fileName, imageFile);
                imageUrl = insforge.storage.from('images').getPublicUrl(fileName);
            } catch (e) { console.error(e); }
            clearImage();
        }

        const userContent = input.trim();
        setInput('');

        // Save user message
        const userMsg: Partial<Message> = {
            conversation_id: conv.id,
            role: 'user',
            content: userContent,
            image_url: imageUrl,
        };
        const { data: savedMsg } = await insforge.database.from('ai_messages').insert([userMsg]).select();
        if (savedMsg?.[0]) setMessages(prev => [...prev, savedMsg[0] as Message]);
        scrollToBottom();

        // Update title if first message
        if (messages.length === 0 && userContent) {
            const title = userContent.substring(0, 50);
            await insforge.database.from('ai_conversations').update({ title, updated_at: new Date().toISOString() }).eq('id', conv.id);
            setConversations(prev => prev.map(c => c.id === conv!.id ? { ...c, title } : c));
            setActiveConv(prev => prev ? { ...prev, title } : prev);
        }

        // Call AI
        try {
            const historyMessages = [...messages.slice(-20), ...(savedMsg ? [savedMsg[0]] : [])].map(m => ({
                role: (m as Message).role,
                content: (m as Message).content,
            }));

            const completion = await insforge.ai.chat.completions.create({
                model: 'deepseek/deepseek-v3.2',
                messages: [
                    { role: 'system', content: 'You are WITS AI, a helpful assistant in a super-app. Be concise and friendly.' },
                    ...historyMessages,
                ],
            });

            const aiContent = completion.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

            const aiMsg: Partial<Message> = {
                conversation_id: conv.id,
                role: 'assistant',
                content: aiContent,
                image_url: null,
            };
            const { data: savedAi } = await insforge.database.from('ai_messages').insert([aiMsg]).select();
            if (savedAi?.[0]) setMessages(prev => [...prev, savedAi[0] as Message]);

            await insforge.database.from('ai_conversations').update({ updated_at: new Date().toISOString() }).eq('id', conv.id);
        } catch (e) {
            console.error('AI error:', e);
            const errMsg: Partial<Message> = {
                conversation_id: conv.id,
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                image_url: null,
            };
            const { data: savedErr } = await insforge.database.from('ai_messages').insert([errMsg]).select();
            if (savedErr?.[0]) setMessages(prev => [...prev, savedErr[0] as Message]);
        }

        setSending(false);
        scrollToBottom();
    };

    const timeAgo = (date: string) => {
        const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m`;
        if (s < 86400) return `${Math.floor(s / 3600)}h`;
        return `${Math.floor(s / 86400)}d`;
    };

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] flex overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <aside className={classNames(
                'bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-50',
                sidebarOpen ? 'w-72 fixed md:relative inset-y-0 left-0' : 'w-0 md:w-72 overflow-hidden md:overflow-visible'
            )}>
                <div className="px-5 pt-12 pb-4 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
                        <button onClick={createConversation}
                            className="w-9 h-9 rounded-full bg-primary-light text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 pb-24">
                    {conversations.map(conv => (
                        <div key={conv.id} onClick={() => selectConversation(conv)}
                            className={classNames('px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all group flex items-center justify-between',
                                activeConv?.id === conv.id ? 'bg-primary-light/10 text-primary-light' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{conv.title}</p>
                                <span className="text-xs text-gray-400">{timeAgo(conv.updated_at)}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Header */}
                <div className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 px-6 pt-12 pb-3 flex items-center gap-3 shrink-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
                        <Menu size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">WITS AI</h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
                    {!activeConv && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white mb-4">
                                <Bot size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">WITS AI Assistant</h3>
                            <p className="text-gray-400 text-sm max-w-sm">Ask me anything! I can help you with tasks, answer questions, or just chat.</p>
                            <button onClick={createConversation}
                                className="mt-4 bg-primary-light text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                                <Plus size={18} /> New Chat
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-3 border-primary-light border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {messages.map(msg => (
                        <div key={msg.id} className={classNames('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                            <div className={classNames('max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm',
                                msg.role === 'user'
                                    ? 'bg-primary-light text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-gray-200 rounded-tl-sm'
                            )}>
                                {msg.image_url && (
                                    <img src={msg.image_url} className="max-h-48 rounded-xl mb-2" alt="" />
                                )}
                                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <span className={classNames('text-xs mt-1 block',
                                    msg.role === 'user' ? 'text-white/60' : 'text-gray-400'
                                )}>{timeAgo(msg.created_at)}</span>
                            </div>
                        </div>
                    ))}

                    {sending && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Loader size={16} className="animate-spin" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 pb-24 md:pb-4 shrink-0">
                    {imagePreview && (
                        <div className="mb-3 relative inline-block">
                            <img src={imagePreview} className="max-h-24 rounded-xl" alt="Preview" />
                            <button onClick={clearImage}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                <X size={12} />
                            </button>
                        </div>
                    )}
                    <div className="flex gap-2 items-end">
                        <button onClick={() => fileInputRef.current?.click()}
                            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary-light transition-colors shrink-0">
                            <Image size={20} />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageSelect(e.target.files)} />
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50 text-[15px]"
                        />
                        <button onClick={sendMessage} disabled={sending || (!input.trim() && !imageFile)}
                            className="p-3 rounded-xl bg-primary-light text-white hover:shadow-lg transition-all disabled:opacity-50 shrink-0">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIChatbot;
