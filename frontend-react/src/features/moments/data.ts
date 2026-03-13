export const initialPosts = [
    {
      id: '1',
      author: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      content: 'Just enjoyed a beautiful sunset at the beach! #sunset #beachlife',
      media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890' }],
      likes: 124,
      comments: 12,
      timestamp: '2 hours ago',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
      content: 'Exploring the city today, found this amazing little coffee shop! ☕️',
      media: [],
      likes: 88,
      comments: 5,
      timestamp: '4 hours ago',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ];
  