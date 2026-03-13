import { initialPosts } from '../features/moments/data';

// Mock client to simulate InsForge SDK
// This allows for frontend development before the backend is fully implemented.

// Function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockPosts = [...initialPosts].map(p => ({ ...p, likedByMe: false }));

export const createClient = (config: { baseUrl: string; anonKey: string }) => {
  console.log('Mock InsForge client created with config:', config);

  const from = (tableName: string) => {
    return {
      async select(query: string = '*') {
        await sleep(300);
        console.log(`Mock DB SELECT: from ${tableName}, query: ${query}`);
        
        if (tableName === 'posts') {
            const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return { data: sortedPosts, error: null };
        }
        return { data: [], error: null };
      },

      async insert(records: any[]) {
        await sleep(500);
        console.log(`Mock DB INSERT into ${tableName}:`, records);

        if (tableName === 'posts') {
            const newPosts = records.map(record => ({
                ...record,
                id: Math.random().toString(36).substring(2, 9),
                createdAt: new Date().toISOString(),
                author: { name: 'Current User', avatar: 'https://i.pravatar.cc/150?u=currentUser' },
                likes: 0,
                comments: 0,
                likedByMe: false,
                timestamp: 'Just now',
            }));
            mockPosts = [...newPosts, ...mockPosts];
            return { data: newPosts, error: null };
        }

        return { data: records, error: null };
      },

      async update(updates: any, postId: string) {
        await sleep(400);
        console.log(`Mock DB UPDATE in ${tableName}, post ${postId}:`, updates);

        if (tableName === 'posts') {
            const postIndex = mockPosts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                const post = mockPosts[postIndex];
                const wasLiked = post.likedByMe;

                mockPosts[postIndex] = {
                    ...post,
                    likedByMe: !wasLiked,
                    likes: !wasLiked ? post.likes + 1 : post.likes - 1,
                };

                return { data: [mockPosts[postIndex]], error: null };
            } else {
                return { data: null, error: { message: 'Post not found' } };
            }
        }

        return { data: null, error: { message: `Table ${tableName} not found`} };
      }
    };
  };

  return { from };
};

// Create a single instance for the app to use
export const insforge = createClient({
    baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://mock.insforge.app',
    anonKey: process.env.REACT_APP_INSFORGE_ANON_KEY || 'mock-anon-key'
});
