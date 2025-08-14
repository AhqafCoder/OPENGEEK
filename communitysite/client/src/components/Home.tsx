'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostCard } from './ui/post-card';
import { useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { MessageSquare } from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { PostSkeletonList } from './ui/post-skeleton';
import { ErrorBoundary } from './ui/error-boundary';
import { usePostContext } from '@/contexts/PostContext';

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
  user_id: string; // Add user_id for delete functionality
}

export default function Home() {
  const { isSignedIn } = useUser();
  const { setOnPostCreated } = usePostContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from backend - memoized to prevent infinite re-renders
  const fetchPosts = useCallback(async (sortBy: 'created_at' | 'likes_count' = 'created_at', pageNum = 1) => {
    try {
      const response = await postsAPI.getPosts({
        page: pageNum,
        limit: 10,
        sort: sortBy,
        order: 'desc'
      });

      if (response.success && response.data && response.data.posts) {
        // Double filter: server should already filter, but let's be extra safe
        const fetchedPosts = response.data.posts
          .filter((post: unknown): post is Post =>
            post !== null &&
            typeof post === 'object' &&
            'id' in post &&
            'content' in post &&
            post.content !== undefined
          );

        // Only log if there's a discrepancy
        if (response.data.posts.length !== fetchedPosts.length) {
          console.warn(`Filtered out ${response.data.posts.length - fetchedPosts.length} invalid posts`);
        }

        if (pageNum === 1) {
          setPosts(fetchedPosts);
        } else {
          setPosts(prev => [...prev, ...fetchedPosts]);
        }

        setHasMore(response.data.pagination?.hasNext || false);
      } else {
        console.error('Invalid response structure:', response);
        toast.error('Failed to load posts - invalid response');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  }, []);

  // Handle new post created - stable reference to prevent re-registration
  const handlePostCreated = useCallback((newPost: Omit<Post, 'user_id'> & { user_id?: string }) => {
    // Check if newPost is valid - silently return if undefined (initial context call)
    if (!newPost || typeof newPost !== 'object') {
      // Only log error if it's not just undefined (which happens on initial load)
      if (newPost !== undefined) {
        console.error('Invalid post data received:', newPost);
        toast.error('Failed to add new post - invalid data');
      }
      return;
    }

    console.log('New post received in Home component:', newPost);

    // Ensure the newPost has all required properties
    const completePost: Post = {
      id: newPost.id || '',
      content: newPost.content || '',
      image_url: newPost.image_url,
      likes_count: newPost.likes_count || 0,
      comments_count: newPost.comments_count || 0,
      created_at: newPost.created_at || new Date().toISOString(),
      updated_at: newPost.updated_at || new Date().toISOString(),
      is_liked_by_user: newPost.is_liked_by_user || false,
      username: newPost.username || '',
      full_name: newPost.full_name || '',
      user_image_url: newPost.user_image_url || '',
      is_verified: newPost.is_verified || false,
      user_id: newPost.user_id || '', // Provide default if missing
    };

    // Only add if we have essential data
    if (completePost.id && completePost.content) {
      console.log('Adding new post to feed:', completePost);
      setPosts(prev => [completePost, ...prev]);
      toast.success('Post added to feed!');
    } else {
      console.error('Post missing essential data:', completePost);
      toast.error('Failed to add post - missing essential data');
    }
  }, []); // Empty dependency array for stable reference

  // Register post creation callback with context - only run once
  useEffect(() => {
    console.log('Registering post creation callback');
    setOnPostCreated(handlePostCreated);
  }, [setOnPostCreated, handlePostCreated]);

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const sortBy = activeTab === 'top' ? 'likes_count' : 'created_at';
      await fetchPosts(sortBy);
      setLoading(false);
    };

    loadPosts();
  }, [activeTab, fetchPosts]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
    setPosts([]);
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

  // Handle post deletion
  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  // Transform post data for PostCard component
  const transformPostForCard = (post: Post) => {
    if (!post || !post.id) {
      // Only log once to avoid spam
      if (process.env.NODE_ENV === 'development') {
        console.warn('Skipping invalid post data');
      }
      return null;
    }

    return {
      id: post.id,
      user: {
        name: post.full_name || post.username || 'Unknown User',
        username: post.username || 'unknown',
        avatarUrl: post.user_image_url || '',
        userId: post.user_id // Add userId for delete functionality
      },
      content: post.content || '',
      timestamp: post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : 'Unknown time',
      likes: post.likes_count || 0,
      comments: post.comments_count || 0,
      image: post.image_url,
      isLiked: post.is_liked_by_user || false,
      onLike: () => handlePostLike(post.id),
      onDelete: handlePostDelete
    };
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6 lg:mx-15">
        {/* Share your thoughts card for signed-in users */}
        {isSignedIn && (
          <Card className="bg-black border-zinc-800/50 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Share your thoughts</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm">Create a new post to engage with the community</p>
                  </div>
                </div>
                <Button
                  className="bg-white hover:bg-zinc-100 text-black font-medium px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto flex-shrink-0"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-create-post-modal'));
                  }}
                >
                  Create Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feed Tabs */}
        <Card className="bg-black border-zinc-800/50">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 h-auto p-1 gap-1">
                <TabsTrigger
                  value="newest"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md px-6 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200"
                >
                  Newest
                </TabsTrigger>
                <TabsTrigger
                  value="top"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md px-6 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200"
                >
                  Top Posts
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md px-6 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200"
                >
                  Following
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4 mb-10">
          {loading ? (
            <PostSkeletonList count={3} />
          ) : posts.length === 0 ? (
            <Card className="bg-black border-zinc-800/50">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No posts yet</h3>
                <p className="text-zinc-500 mb-4">Be the first to share something with the community!</p>
                {isSignedIn && (
                  <Button
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 hover:bg-zinc-800/50 hover:text-white hover:border-zinc-500"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-create-post-modal'));
                    }}
                  >
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {posts
                .filter(post => post && post.id) // Pre-filter before transformation
                .map((post) => {
                  const transformedPost = transformPostForCard(post);
                  if (!transformedPost) return null;
                  return <PostCard key={post.id} {...transformedPost} />;
                })
                .filter(Boolean)}

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
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
} 