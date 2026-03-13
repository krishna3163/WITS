import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, Plus, Search, Trash2, ChevronLeft, Menu, Lock, Globe, Paperclip, X, Download } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import classNames from 'classnames';

interface NotePage {
    id: string;
    user_id: string;
    title: string;
    content: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

interface NoteAttachment {
    id: string;
    page_id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    created_at: string;
}

const NotesApp = () => {
    const { user } = useAuthStore();
    const [pages, setPages] = useState<NotePage[]>([]);
    const [selectedPage, setSelectedPage] = useState<NotePage | null>(null);
    const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPages = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data, error } = await insforge.database.from('note_pages').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
            if (error) { console.error(error); setPages([]); return; }
            setPages((data || []) as NotePage[]);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [user?.id]);

    const fetchAttachments = useCallback(async (pageId: string) => {
        try {
            const { data } = await insforge.database.from('note_attachments').select('*').eq('page_id', pageId).order('created_at', { ascending: false });
            setAttachments((data || []) as NoteAttachment[]);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchPages(); }, [fetchPages]);

    const createPage = async () => {
        if (!user?.id) return;
        try {
            const { data, error } = await insforge.database.from('note_pages').insert([{
                user_id: user.id,
                title: 'Untitled',
                content: '',
                is_public: false,
            }]).select();
            if (error) throw error;
            if (data && data[0]) {
                const page = data[0] as NotePage;
                setPages(prev => [page, ...prev]);
                selectPage(page);
            }
        } catch (e) { console.error(e); }
    };

    const selectPage = (page: NotePage) => {
        setSelectedPage(page);
        fetchAttachments(page.id);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const autoSave = useCallback(async (page: NotePage) => {
        setSaving(true);
        try {
            await insforge.database.from('note_pages').update({
                title: page.title,
                content: page.content,
                is_public: page.is_public,
                updated_at: new Date().toISOString(),
            }).eq('id', page.id);
            setPages(prev => prev.map(p => p.id === page.id ? { ...page, updated_at: new Date().toISOString() } : p));
        } catch (e) { console.error(e); }
        setSaving(false);
    }, []);

    const updateField = (field: 'title' | 'content' | 'is_public', value: any) => {
        if (!selectedPage) return;
        const updated = { ...selectedPage, [field]: value };
        setSelectedPage(updated);
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => autoSave(updated), 1000);
    };

    const deletePage = async (page: NotePage) => {
        if (!confirm('Delete this page?')) return;
        await insforge.database.from('note_attachments').delete().eq('page_id', page.id);
        await insforge.database.from('note_pages').delete().eq('id', page.id);
        setPages(prev => prev.filter(p => p.id !== page.id));
        if (selectedPage?.id === page.id) setSelectedPage(null);
    };

    const uploadAttachment = async (files: FileList | null) => {
        if (!files || files.length === 0 || !selectedPage || !user?.id) return;
        const file = files[0];
        try {
            const fileName = `notes/${user.id}/${selectedPage.id}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await insforge.storage.from('images').upload(fileName, file);
            if (uploadError) throw uploadError;
            const fileUrl = insforge.storage.from('images').getPublicUrl(fileName);
            await insforge.database.from('note_attachments').insert([{
                page_id: selectedPage.id,
                file_name: file.name,
                file_url: fileUrl,
                file_size: file.size,
            }]);
            fetchAttachments(selectedPage.id);
        } catch (e) { console.error(e); }
    };

    const deleteAttachment = async (att: NoteAttachment) => {
        await insforge.database.from('note_attachments').delete().eq('id', att.id);
        setAttachments(prev => prev.filter(a => a.id !== att.id));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const timeAgo = (date: string) => {
        const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] flex overflow-hidden">
            {/* Sidebar */}
            <aside className={classNames(
                'bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-30',
                sidebarOpen ? 'w-72 absolute md:relative inset-y-0 left-0' : 'w-0 overflow-hidden'
            )}>
                <div className="px-5 pt-12 pb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Notes</h1>
                        <div className="flex gap-1">
                            <button onClick={createPage}
                                className="w-9 h-9 rounded-full bg-primary-light text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                                <Plus size={18} />
                            </button>
                            <button onClick={() => setSidebarOpen(false)} className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center md:hidden">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-light/50" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-24">
                    {loading && <div className="flex justify-center py-8"><div className="w-8 h-8 border-3 border-primary-light border-t-transparent rounded-full animate-spin" /></div>}
                    {filtered.map(page => (
                        <div key={page.id} onClick={() => selectPage(page)}
                            className={classNames('px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all group flex items-center justify-between',
                                selectedPage?.id === page.id ? 'bg-primary-light/10 text-primary-light' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <FileText size={14} className="shrink-0" />
                                    <span className="text-sm font-medium truncate">{page.title || 'Untitled'}</span>
                                    {page.is_public && <Globe size={12} className="text-green-500 shrink-0" />}
                                </div>
                                <span className="text-xs text-gray-400 ml-6">{timeAgo(page.updated_at)}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deletePage(page); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Editor */}
            <main className="flex-1 flex flex-col min-w-0 pb-24">
                {/* Top bar */}
                <div className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 px-6 pt-12 pb-3 flex items-center gap-3 shrink-0">
                    {!sidebarOpen && (
                        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Menu size={20} />
                        </button>
                    )}
                    {selectedPage ? (
                        <div className="flex items-center gap-3 flex-1">
                            <span className={classNames('text-xs font-semibold px-3 py-1 rounded-full',
                                saving ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            )}>
                                {saving ? 'Saving...' : 'Saved'}
                            </span>
                            <button onClick={() => updateField('is_public', !selectedPage.is_public)}
                                className={classNames('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                                    selectedPage.is_public ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                )}>
                                {selectedPage.is_public ? <><Globe size={12} /> Public</> : <><Lock size={12} /> Private</>}
                            </button>
                            <button onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 transition-colors">
                                <Paperclip size={12} /> Attach
                            </button>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={e => uploadAttachment(e.target.files)} />
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">Select or create a page</span>
                    )}
                </div>

                {selectedPage ? (
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-8">
                            <input
                                type="text"
                                value={selectedPage.title}
                                onChange={e => updateField('title', e.target.value)}
                                placeholder="Untitled"
                                className="w-full bg-transparent text-4xl font-bold text-gray-900 dark:text-white border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 mb-6"
                            />
                            <textarea
                                value={selectedPage.content}
                                onChange={e => updateField('content', e.target.value)}
                                placeholder="Start writing... (supports plain text)"
                                className="w-full bg-transparent text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed border-none outline-none resize-none min-h-[50vh] placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            />

                            {/* Attachments */}
                            {attachments.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2"><Paperclip size={14} /> Attachments</h3>
                                    <div className="space-y-2">
                                        {attachments.map(att => (
                                            <div key={att.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
                                                <FileText size={18} className="text-primary-light shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <a href={att.file_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block hover:text-primary-light">
                                                        {att.file_name}
                                                    </a>
                                                    <span className="text-xs text-gray-400">{formatSize(att.file_size)}</span>
                                                </div>
                                                <a href={att.file_url} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-primary-light"><Download size={16} /></a>
                                                <button onClick={() => deleteAttachment(att)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <FileText size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500">No page selected</h3>
                            <p className="text-gray-400 dark:text-gray-600 mt-2 text-sm">Select a page from the sidebar or create a new one</p>
                            <button onClick={createPage}
                                className="mt-4 bg-primary-light text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                                <Plus size={18} /> New Page
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotesApp;
