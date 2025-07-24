'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './ui/post-card';
import { CreatePost } from './ui/create-post';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { postsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { PostSkeletonList } from './ui/post-skeleton';
import { ErrorBoundary } from './ui/error-boundary';

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
}

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from backend
  const fetchPosts = async (sortBy: 'created_at' | 'likes_count' = 'created_at', pageNum = 1) => {
    try {
      const response = await postsAPI.getPosts({
        page: pageNum,
        limit: 10,
        sort: sortBy,
        order: 'desc'
      });

      if (response.success) {
        const fetchedPosts = response.data.posts;
        
        if (pageNum === 1) {
          setPosts(fetchedPosts);
        } else {
          setPosts(prev => [...prev, ...fetchedPosts]);
        }
        
        setHasMore(response.data.pagination.hasNext);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const sortBy = activeTab === 'top' ? 'likes_count' : 'created_at';
      await fetchPosts(sortBy);
      setLoading(false);
    };

    loadPosts();
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
    setPosts([]);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    const sortBy = activeTab === 'top' ? 'likes_count' : 'created_at';
    await fetchPosts(sortBy, 1);
    setRefreshing(false);
  };

  // Handle new post created
  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    toast.success('Post shared successfully!');
  };

  // Handle post like
  const handlePostLike = async (postId: string) => {
    try {
      const response = await postsAPI.likePost(postId);
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                is_liked_by_user: response.data.isLiked,
                likes_count: response.data.likesCount 
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  // Transform post data for PostCard component
  const transformPostForCard = (post: Post) => ({
    id: post.id,
    user: {
      name: post.full_name || post.username,
      username: post.username,
      avatarUrl: post.user_image_url
    },
    content: post.content,
    timestamp: formatDistanceToNow(new Date(post.created_at), { addSuffix: true }),
    likes: post.likes_count,
    comments: post.comments_count,
    image: post.image_url,
    isLiked: post.is_liked_by_user,
    onLike: () => handlePostLike(post.id)
  });

  return (
    <ErrorBoundary>
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Image
          src="/logo.png"
          alt="OPENGEEK"
          width={48}
          height={48}
          className="rounded-full border-2 border-emerald-500/20"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            OPENGEEK Community
          </h1>
          <p className="text-zinc-400 text-sm">Lets make magic together ✨</p>
        </div>
        
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-zinc-400 hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Welcome Section - Show only for signed-in users */}
      {isSignedIn && (
        <div className="bg-black/50 border border-zinc-800/50 rounded-xl p-8 text-white mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-3 text-white">Welcome back! 👋</h2>
          <p className="text-zinc-400 mb-6">Share your thoughts, projects, and connect with fellow developers.</p>
        </div>
      )}

      {/* Welcome Section - Show for non-signed-in users */}
      {!isSignedIn && (
        <div className="bg-black/50 border border-zinc-800/50 rounded-xl p-8 text-white mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-3 text-white">Welcome to OPENGEEK Community! 👋</h2>
          <p className="text-zinc-400 mb-6">Join our community of developers, share your projects, and connect with others.</p>
          <Button
            variant="outline"
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
            onClick={() => router.push('/sign-in')}
          >
            Get Started
          </Button>
        </div>
      )}

      {/* Create Post Component */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start border-b border-zinc-800 rounded-none h-auto p-0 bg-transparent mb-2">
          <TabsTrigger
            value="newest"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-400 rounded-none px-6 py-3 text-sm font-medium"
          >
            Newest
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-400 rounded-none px-6 py-3 text-sm font-medium"
          >
            Top Posts
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-400 rounded-none px-6 py-3 text-sm font-medium"
          >
            Following
          </TabsTrigger>
        </TabsList>

        {/* Posts Content */}
        <div className="mt-6">
          {loading ? (
            <PostSkeletonList count={3} />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-zinc-500 mb-4">
                <p className="text-lg">No posts yet</p>
                <p className="text-sm">Be the first to share something with the community!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} {...transformPostForCard(post)} />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      const sortBy = activeTab === 'top' ? 'likes_count' : 'created_at';
                      fetchPosts(sortBy, nextPage);
                    }}
                    className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                  >
                    Load More Posts
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Tabs>
    </div>
    </ErrorBoundary>
  );
} 