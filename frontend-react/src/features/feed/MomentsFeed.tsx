import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Heart, MessageCircle, Share2, MoreHorizontal, Upload, X, Image, Trash2, User } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../context/ToastContext';
import classNames from 'classnames';

interface FeedImage {
    id: string;
    user_id: string;
    image_url: string;
    caption: string;
    like_count: number;
    created_at: string;
    liked_by_me?: boolean;
}

const MomentsFeed = () => {
    const { user } = useAuthStore();
    const { addToast } = useToast();
    const [tab, setTab] = useState<'feed' | 'my'>('feed');
    const [images, setImages] = useState<FeedImage[]>([]);
    const [loading, setLoading] = useState(true);

    // Upload state
    const [dragOver, setDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            let query = insforge.database.from('feed_images').select('*').order('created_at', { ascending: false });
            if (tab === 'my' && user?.id) {
                query = query.eq('user_id', user.id);
            }
            const { data, error } = await query;
            if (error) { console.error(error); setImages([]); }
            else {
                const imgs = (data || []) as FeedImage[];
                if (user?.id) {
                    const { data: likes } = await insforge.database.from('feed_image_likes').select('image_id').eq('user_id', user.id);
                    const likedIds = new Set((likes || []).map((l: any) => l.image_id));
                    imgs.forEach(img => { img.liked_by_me = likedIds.has(img.id); });
                }
                setImages(imgs);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [tab, user?.id]);

    useEffect(() => { fetchImages(); }, [fetchImages]);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        if (!selectedFile || !user?.id) return;
        setUploading(true);
        try {
            const fileName = `feed/${user.id}/${Date.now()}_${selectedFile.name}`;
            const { error: uploadError } = await insforge.storage.from('images').upload(fileName, selectedFile);
            if (uploadError) throw uploadError;

            const imageUrl = insforge.storage.from('images').getPublicUrl(fileName);

            await insforge.database.from('feed_images').insert([{
                user_id: user.id,
                image_url: imageUrl,
                caption: caption,
                like_count: 0,
            }]);

            setSelectedFile(null);
            setPreviewUrl(null);
            setCaption('');
            fetchImages();
        } catch (e) { console.error('Upload error:', e); }
        setUploading(false);
    };

    const toggleLike = async (img: FeedImage) => {
        if (!user?.id) return;
        if (img.liked_by_me) {
            await insforge.database.from('feed_image_likes').delete().eq('image_id', img.id).eq('user_id', user.id);
            await insforge.database.from('feed_images').update({ like_count: Math.max(0, img.like_count - 1) }).eq('id', img.id);
        } else {
            await insforge.database.from('feed_image_likes').insert([{ image_id: img.id, user_id: user.id }]);
            await insforge.database.from('feed_images').update({ like_count: img.like_count + 1 }).eq('id', img.id);
        }
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, liked_by_me: !i.liked_by_me, like_count: i.liked_by_me ? i.like_count - 1 : i.like_count + 1 } : i));
    };

    const deleteImage = async (img: FeedImage) => {
        if (!confirm('Delete this image?')) return;
        await insforge.database.from('feed_image_likes').delete().eq('image_id', img.id);
        await insforge.database.from('feed_images').delete().eq('id', img.id);
        setImages(prev => prev.filter(i => i.id !== img.id));
    };

    const timeAgo = (date: string) => {
        const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">
            {/* Header */}
            <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-4 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight">Moments</h1>
                    <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Camera size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {(['feed', 'my'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={classNames('px-5 py-2 rounded-full text-sm font-semibold transition-all',
                                tab === t ? 'bg-primary-light text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                            )}>
                            {t === 'feed' ? 'Feed' : 'My Photos'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 md:px-0 py-4">
                {/* Upload Area */}
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={classNames(
                        'border-2 border-dashed rounded-3xl p-6 mb-6 text-center transition-all cursor-pointer',
                        dragOver ? 'border-primary-light bg-primary-light/10 scale-[1.02]' : 'border-gray-300 dark:border-gray-700 hover:border-primary-light/50',
                        previewUrl ? 'bg-white dark:bg-[#1A1C1E]' : ''
                    )}
                    onClick={() => !previewUrl && fileInputRef.current?.click()}
                >
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />

                    {previewUrl ? (
                        <div className="space-y-4">
                            <div className="relative inline-block">
                                <img src={previewUrl} className="max-h-64 rounded-2xl mx-auto shadow-lg" alt="Preview" />
                                <button onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600">
                                    <X size={16} />
                                </button>
                            </div>
                            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption..."
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50" onClick={e => e.stopPropagation()} />
                            <button onClick={(e) => { e.stopPropagation(); handleUpload(); }} disabled={uploading}
                                className="bg-primary-light text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 mx-auto">
                                <Upload size={18} /> {uploading ? 'Uploading...' : 'Share'}
                            </button>
                        </div>
                    ) : (
                        <div className="py-8">
                            <Image size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 font-medium">Drag & drop an image or click to browse</p>
                            <p className="text-gray-400 text-sm mt-1">Share your moments with the world</p>
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && images.length === 0 && (
                    <div className="text-center py-16">
                        <Image size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                            {tab === 'my' ? 'No photos yet' : 'Feed is empty'}
                        </h3>
                        <p className="text-gray-400 mt-2">
                            {tab === 'my' ? 'Upload your first image above!' : 'Be the first to share something!'}
                        </p>
                    </div>
                )}

                {/* Image Cards */}
                <div className="flex flex-col gap-6">
                    {images.map((img, idx) => (
                        <div key={img.id} className="bg-white dark:bg-[#1A1C1E] md:rounded-[24px] shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
                            {/* Header */}
                            <div className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white font-bold">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{img.user_id === user?.id ? 'You' : 'User'}</h3>
                                        <p className="text-xs text-gray-500">{timeAgo(img.created_at)}</p>
                                    </div>
                                </div>
                                {tab === 'my' && (
                                    <button onClick={() => deleteImage(img)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Caption */}
                            {img.caption && (
                                <div className="px-5 pb-3">
                                    <p className="text-gray-800 dark:text-gray-200 text-[15px]">{img.caption}</p>
                                </div>
                            )}

                            {/* Image */}
                            <div className="w-full max-h-[500px] overflow-hidden">
                                <img src={img.image_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                            </div>

                            {/* Actions */}
                            <div className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button onClick={() => toggleLike(img)}
                                        className={classNames('flex items-center gap-2 px-3 py-1.5 rounded-full transition-all group',
                                            img.liked_by_me ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        )}>
                                        <Heart size={22} className={classNames('transition-transform group-active:scale-75', img.liked_by_me && 'fill-red-500')} />
                                        <span className="font-medium">{img.like_count}</span>
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: 'Check out this moment on WITS',
                                                text: img.caption,
                                                url: img.image_url
                                            }).catch(console.error);
                                        } else {
                                            navigator.clipboard.writeText(img.image_url);
                                            addToast('success', 'Image link copied to clipboard!');
                                        }
                                    }}
                                    className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MomentsFeed;
