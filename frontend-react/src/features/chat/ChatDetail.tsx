import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Send, Image as ImageIcon, Smile,
    Mic, Phone, Video, MoreHorizontal,
    ChevronLeft, Paperclip, BarChart2, Calendar,
    AtSign, MapPin, Sticker, Check, CheckCheck,
    Reply, Edit2, Trash2, Pin, Star,
    Lock, Volume2, Trash, X, Timer, Eye, EyeOff,
    AlertCircle, Camera
} from 'lucide-react';
import classNames from 'classnames';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import type { MessageStatus } from '../../store/chatStore';
import { insforge } from '../../lib/insforge';

interface ChatDetailProps {
    chat: any;
    onBack: () => void;
    onOpenSettings?: () => void;
}

export default function ChatDetail({ chat, onBack, onOpenSettings }: ChatDetailProps) {
    const { user } = useAuthStore();
    const {
        typingUsers, recordingUsers, setTyping, setRecording,
        starredMessages, toggleStarred
    } = useChatStore();

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [showTools, setShowTools] = useState(false);
    const [replyingTo, setReplyingTo] = useState<any>(null);
    const [editingMessage, setEditingMessage] = useState<any>(null);
    const [isRecordingUI, setIsRecordingUI] = useState(false);
    const [recordTime, setRecordTime] = useState(0);

    // Snapchat Style Features
    const [expiryTime, setExpiryTime] = useState<number | null>(null); // seconds
    const [viewOnce, setViewOnce] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<any>(null);
    const recordingIntervalRef = useRef<any>(null);

    // Simulation: Screenshot Detection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'S') {
                triggerSystemAlert("You took a screenshot of the chat!");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const triggerSystemAlert = (msg: string) => {
        setAlertMessage(msg);
        setTimeout(() => setAlertMessage(null), 3000);
    };

    // Recording Timer
    useEffect(() => {
        if (isRecordingUI) {
            recordingIntervalRef.current = setInterval(() => setRecordTime(t => t + 1), 1000);
        } else {
            clearInterval(recordingIntervalRef.current);
            setRecordTime(0);
        }
        return () => clearInterval(recordingIntervalRef.current);
    }, [isRecordingUI]);

    // Typing Event
    useEffect(() => {
        if (!chat?.id || !user?.id) return;
        if (input.trim().length > 0) {
            insforge.realtime.publish(`conversation:${chat.id}`, 'TYPING_START', { userId: user.id });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                insforge.realtime.publish(`conversation:${chat.id}`, 'TYPING_STOP', { userId: user.id });
            }, 3000);
        } else {
            insforge.realtime.publish(`conversation:${chat.id}`, 'TYPING_STOP', { userId: user.id });
        }
    }, [input, chat?.id, user?.id]);

    // DB Fetch & Subscription
    useEffect(() => {
        if (!chat?.id) return;
        const fetchMessages = async () => {
            const { data } = await insforge.database.from('messages').select('*').eq('conversation_id', chat.id).order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        fetchMessages();

        const channel = `conversation:${chat.id}`;
        insforge.realtime.subscribe(channel);
        const handleEvent = (payload: any) => {
            if (payload.type === 'NEW_MESSAGE' && payload.data.conversation_id === chat.id) {
                setMessages(prev => [...prev, payload.data]);
                // Handle disappearing timer locally
                if (payload.data.expires_in) {
                    setTimeout(() => {
                        setMessages(prev => prev.filter(m => m.id !== payload.data.id));
                    }, payload.data.expires_in * 1000);
                }
            } else if (payload.type === 'TYPING_START') { setTyping(chat.id, payload.userId, true); }
            else if (payload.type === 'TYPING_STOP') { setTyping(chat.id, payload.userId, false); }
            else if (payload.type === 'RECORDING_START') { setRecording(chat.id, payload.userId, true); }
            else if (payload.type === 'RECORDING_STOP') { setRecording(chat.id, payload.userId, false); }
        };
        insforge.realtime.on('broadcast', handleEvent);
        return () => { insforge.realtime.off('broadcast', handleEvent); insforge.realtime.unsubscribe(channel); };
    }, [chat?.id, setTyping, setRecording]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const msgData = {
            conversation_id: chat.id,
            sender_id: user.id,
            content: input.trim(),
            message_type: 'TEXT',
            reply_to_id: replyingTo?.id || null,
            status: 'sent',
            expires_in: expiryTime,
            view_once: viewOnce
        };

        const { data, error } = await insforge.database.from('messages').insert([msgData]).select().single();
        if (!error && data) {
            setInput('');
            setReplyingTo(null);
            setExpiryTime(null);
            setViewOnce(false);
            insforge.realtime.publish(`conversation:${chat.id}`, 'NEW_MESSAGE', data);

            // Auto delete locally for sender if expiry set
            if (expiryTime) {
                setTimeout(() => {
                    setMessages(prev => prev.filter(m => m.id !== data.id));
                }, expiryTime * 1000);
            }
        }
    };

    const StatusIcon = ({ status }: { status: MessageStatus }) => {
        switch (status) {
            case 'sent': return <Check size={14} className="text-gray-400" />;
            case 'delivered': return <CheckCheck size={14} className="text-gray-400" />;
            case 'seen': return <CheckCheck size={14} className="text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] relative overflow-hidden">
            {/* System Notification Overlay */}
            {alertMessage && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-red-400">
                        <AlertCircle size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{alertMessage}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shrink-0 z-40">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-primary-light"><ChevronLeft size={24} /></button>
                    <div onClick={onOpenSettings} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white font-bold shadow-lg">
                            {chat.name?.[0]?.toUpperCase() || 'W'}
                        </div>
                        <div>
                            <h2 className="text-sm font-black dark:text-white">{chat.name || 'Conversation'}</h2>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl"><Video size={20} /></button>
                    <button className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl"><Phone size={20} /></button>
                    <button onClick={onOpenSettings} className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl"><MoreHorizontal size={20} /></button>
                </div>
            </header>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user?.id;
                    const isDisappearing = !!msg.expires_in;
                    const isViewOnce = !!msg.view_once;

                    return (
                        <div key={msg.id || i} className={classNames("flex group/item animate-in fade-in duration-300", isMe ? "justify-end" : "justify-start")}>
                            <div className={classNames("relative max-w-[80%]", isMe ? "items-end" : "items-start")}>
                                <div className={classNames(
                                    "px-4 py-2.5 rounded-[22px] shadow-sm relative overflow-hidden",
                                    isMe ? "bg-primary-light text-white rounded-br-sm" : "bg-white dark:bg-white/5 dark:text-gray-100 text-gray-800 rounded-bl-sm border border-gray-100 dark:border-white/5",
                                    isViewOnce && "border-2 border-dashed border-primary-light"
                                )}>
                                    {isViewOnce ? (
                                        <div className="flex items-center gap-3 py-1 cursor-pointer" onClick={() => triggerSystemAlert("View Once media can only be seen once!")}>
                                            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center"><Camera size={16} /></div>
                                            <span className="text-xs font-black uppercase tracking-widest">View Once Photo</span>
                                        </div>
                                    ) : (
                                        <p className="text-[15px] font-medium leading-relaxed">{msg.content}</p>
                                    )}

                                    {/* Action Indicators */}
                                    <div className="flex items-center justify-end gap-1.5 mt-1 opacity-60">
                                        {isDisappearing && <Timer size={10} className="text-amber-300 animate-spin-slow" />}
                                        <span className="text-[9px] font-black uppercase">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {isMe && <StatusIcon status={msg.status || 'sent'} />}
                                    </div>

                                    {/* Expiry Progress Bar (Visual only) */}
                                    {isDisappearing && (
                                        <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink-width" style={{ animationDuration: `${msg.expires_in}s` }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Bar / Tools */}
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pt-3 pb-8 px-4">
                {/* Snapchat Style Controls */}
                {(expiryTime || viewOnce) && (
                    <div className="mb-3 flex gap-2 animate-in slide-in-from-bottom-2">
                        {expiryTime && (
                            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-amber-500/20">
                                <Timer size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Self-Destruct: {expiryTime}s</span>
                                <button onClick={() => setExpiryTime(null)}><X size={12} /></button>
                            </div>
                        )}
                        {viewOnce && (
                            <div className="bg-primary-light/10 text-primary-light px-3 py-1.5 rounded-xl flex items-center gap-2 border border-primary-light/20">
                                <EyeOff size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">View Once Active</span>
                                <button onClick={() => setViewOnce(false)}><X size={12} /></button>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <button
                        onClick={() => setShowTools(!showTools)}
                        className={classNames("p-2.5 rounded-2xl transition-all", showTools ? "bg-primary-light text-white rotate-45" : "bg-gray-100 dark:bg-white/5 text-gray-400")}
                    ><Plus size={24} /></button>

                    <div className="flex-1 bg-gray-100 dark:bg-white/5 rounded-[24px] px-4 py-1.5 flex items-center gap-2 border border-transparent focus-within:border-primary-light/30">
                        <textarea
                            rows={1}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent py-2 outline-none text-[15px] dark:text-white resize-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={() => setViewOnce(!viewOnce)} className={classNames("transition-colors", viewOnce ? "text-primary-light" : "text-gray-400")}><Eye size={18} /></button>
                        <button onClick={() => setExpiryTime(expiryTime === 10 ? null : 10)} className={classNames("transition-colors", expiryTime ? "text-amber-500" : "text-gray-400")}><Timer size={18} /></button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={classNames("w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95", input.trim() ? "bg-primary-light text-white" : "bg-gray-100 dark:bg-white/5 text-gray-300")}
                    ><Send size={22} /></button>
                </div>

                {/* Rich Tools Panel */}
                <div className={classNames("grid grid-cols-4 gap-4 transition-all duration-500 overflow-hidden", showTools ? "max-h-96 mt-6 opacity-100" : "max-h-0 opacity-0")}>
                    {[
                        { icon: ImageIcon, label: 'Media', color: 'bg-emerald-500' },
                        { icon: Sticker, label: 'Bitmoji', color: 'bg-indigo-500' },
                        { icon: BarChart2, label: 'Poll', color: 'bg-pink-500' },
                        { icon: MapPin, label: 'Location', color: 'bg-orange-500' },
                    ].map((t, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className={classNames("w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-md transition-all group-hover:scale-110", t.color)}>
                                <t.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
