'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface Post {
  id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  is_liked_by_user: boolean;
  username: string;
  full_name: string;
  user_image_url: string;
  is_verified: boolean;
  user_id: string; // Add user_id for consistency with Home.tsx
}

interface PostContextType {
  onPostCreated?: (post: Post) => void;
  setOnPostCreated: (callback: (post: Post) => void) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [onPostCreated, setOnPostCreated] = useState<((post: Post) => void) | undefined>();

  const wrappedSetOnPostCreated = (callback: (post: Post) => void) => {
    console.log('PostContext: Setting new onPostCreated callback');
    setOnPostCreated(() => callback);
  };

  const contextValue = useMemo(() => ({
    onPostCreated,
    setOnPostCreated: wrappedSetOnPostCreated
  }), [onPostCreated]);

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
}