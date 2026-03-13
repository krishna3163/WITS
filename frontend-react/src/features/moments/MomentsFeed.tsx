import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MoreHorizontal, Loader2, Heart, MessageCircle } from 'lucide-react';
import CreatePost from './CreatePost';
import { insforge } from '../../lib/insforge'; // Import the mock client

// Define Post type for better type safety
interface PostAuthor {
  name: string;
  avatar: string;
}

interface PostMedia {
  type: 'image' | 'video';
  url: string;
}

interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  media: PostMedia[];
  likes: number;
  comments: number;
  timestamp: string;
  createdAt: string;
  likedByMe?: boolean; // Add property to track if liked by current user
}

const MomentsFeed = () => {
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await insforge.from('posts').select();
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      const postsWithLikeStatus = (data || []).map((post: any) => ({ ...post, likedByMe: post.likedByMe || false }));
      setPosts(postsWithLikeStatus);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content: string) => {
    const { error } = await insforge.from('posts').insert([{ content }]);
    if (error) {
      console.error('Error creating post:', error);
    } else {
      fetchPosts(); 
    }
    setCreatePostOpen(false);
  };

  const handleLikePost = async (postId: string) => {
    // Optimistic UI update
    setPosts(currentPosts => 
      currentPosts.map(p => {
        if (p.id === postId) {
          const wasLiked = p.likedByMe;
          return {
            ...p,
            likedByMe: !wasLiked,
            likes: wasLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );

    // Simulate backend call
    const post = posts.find(p => p.id === postId);
    if (post) {
        // In a real implementation, we would only send the change in likes.
        // The mock server will handle the logic.
        const { error } = await insforge.from('posts').update(
            { likes: post.likedByMe ? post.likes - 1 : post.likes + 1 },
            postId
        );

        if (error) {
            console.error('Error updating likes:', error);
            // Revert optimistic update on error
            fetchPosts();
        }
    }
  };

  return (
    <div className="h-full w-full bg-[#f4f6f8] dark:bg-[#0A0A0A] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-[32px] font-black tracking-tight text-gray-900 dark:text-white">Moments</h1>
          <button 
            onClick={() => setCreatePostOpen(true)}
            className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 text-primary-light animate-spin" />
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-[#1A1C1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200">{post.author.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{post.timestamp}</p>
                      </div>
                  </div>
                  <button className="text-gray-400 dark:text-gray-600">
                      <MoreHorizontal size={20} />
                  </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>

              {post.media && post.media.length > 0 && (
                <div className="rounded-lg overflow-hidden mb-3">
                  <img src={post.media[0].url} alt="Post media" className="w-full h-auto object-cover" />
                </div>
              )}

              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center gap-1.5 group text-sm font-medium"
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors group-hover:text-red-500 ${post.likedByMe ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                  <span className={`${post.likedByMe ? 'text-red-500' : 'text-gray-500'}`}>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 group text-sm font-medium">
                  <MessageCircle size={20} className="text-gray-400 transition-colors group-hover:text-primary-light" />
                  <span className="text-gray-500">{post.comments}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setCreatePostOpen(false)} onPost={handleCreatePost} />
    </div>
  );
};

export default MomentsFeed;
