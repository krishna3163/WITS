import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onPost }) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handlePost = () => {
    if (content.trim()) {
      onPost(content);
      setContent(''); // Clear content after posting
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-[100] animate-in slide-in-from-bottom-full">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
          <X size={24} />
        </button>
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Create Post</h2>
        <button 
          onClick={handlePost}
          disabled={!content.trim()}
          className="px-4 py-1.5 bg-primary-light text-white rounded-full font-bold text-sm disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-40 bg-transparent text-gray-800 dark:text-gray-200 text-lg placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default CreatePost;
