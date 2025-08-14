'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { ImageIcon, X, Loader2, Globe, Users, Lock } from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

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
  user_id: string; // Add user_id for consistency
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: Post) => void;
}

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { user, isSignedIn } = useUser();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      console.log('Image selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something to share');
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to create a post');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        content: content.trim(),
        ...(selectedImage && { image: selectedImage })
      };

      // Show different loading message based on whether image is being uploaded
      if (selectedImage) {
        toast.loading('Uploading image and creating post...', { id: 'create-post' });
      } else {
        toast.loading('Creating post...', { id: 'create-post' });
      }

      const response = await postsAPI.createPost(postData);
      
      if (response.success) {
        toast.success('Post created successfully!', { id: 'create-post' });
        
        // Reset form
        setContent('');
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Notify parent component
        if (onPostCreated && response.data?.post) {
          // Ensure the post has all required properties
          const post = response.data.post;
          console.log('CreatePostModal: Post created successfully, calling onPostCreated with:', post);
          if (post.id && post.content !== undefined) {
            onPostCreated(post);
          } else {
            console.error('Post missing essential data:', post);
          }
        } else {
          console.log('CreatePostModal: onPostCreated callback not available or no post data', {
            hasCallback: !!onPostCreated,
            hasPostData: !!response.data?.post,
            responseData: response.data
          });
        }

        // Close modal
        onClose();
      }
    } catch (error: unknown) {
      console.error('Error creating post:', error);
      
      // Type-safe error handling
      const errorResponse = error as { 
        response?: { 
          data?: { 
            message?: string;
            error?: string;
          } 
        } 
      };
      console.error('Full error response:', errorResponse?.response?.data);
      
      let errorMessage = 'Failed to create post';
      
      // Handle specific error types
      if (errorResponse?.response?.data?.error === 'FILE_TOO_LARGE') {
        errorMessage = 'Image file is too large. Please select an image under 5MB.';
      } else if (errorResponse?.response?.data?.error === 'INVALID_FILE_TYPE') {
        errorMessage = 'Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.';
      } else if (errorResponse?.response?.data?.error === 'CLOUDINARY_ERROR') {
        errorMessage = 'Failed to upload image. Please try again.';
      } else if (errorResponse?.response?.data?.message) {
        errorMessage = errorResponse.response.data.message;
      }
      
      toast.error(errorMessage, { id: 'create-post' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'followers':
        return <Users className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
    }
  };

  const getVisibilityText = () => {
    switch (visibility) {
      case 'public':
        return 'Anyone can see this post';
      case 'followers':
        return 'Only your followers can see this post';
      case 'private':
        return 'Only you can see this post';
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-700 text-white p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-zinc-700">
          <DialogTitle className="text-xl font-semibold text-white">Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* User Info & Content */}
          <div className="px-6 py-4">
            <div className="flex gap-4 mb-4">
              <Avatar className="h-12 w-12 border-2 border-zinc-700">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="bg-zinc-800 text-zinc-300 text-lg font-medium">
                  {user?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-white">{user?.fullName || user?.firstName}</h3>
                  <span className="text-zinc-500">•</span>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                    onClick={() => {
                      const options: Array<'public' | 'followers' | 'private'> = ['public', 'followers', 'private'];
                      const currentIndex = options.indexOf(visibility);
                      const nextIndex = (currentIndex + 1) % options.length;
                      setVisibility(options[nextIndex]);
                    }}
                  >
                    {getVisibilityIcon()}
                    <span className="capitalize">{visibility}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{getVisibilityText()}</p>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent text-white placeholder:text-zinc-500 resize-none border-none outline-none text-lg min-h-[120px] max-h-[300px]"
                  maxLength={2000}
                  disabled={isSubmitting}
                  autoFocus
                />
                
                {/* Character count */}
                <div className="flex justify-end mt-2">
                  <span className={`text-xs ${content.length > 1800 ? 'text-red-400' : 'text-zinc-500'}`}>
                    {content.length}/2000
                  </span>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mb-4 rounded-xl overflow-hidden border border-zinc-700">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={500}
                  height={300}
                  className="w-full h-auto max-h-[400px] object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 text-white rounded-full"
                  onClick={removeImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isSubmitting}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg px-3 py-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>

                <div className="h-4 w-px bg-zinc-700 mx-2" />
                
                <span className="text-xs text-zinc-500">
                  Tip: Use @ to mention someone
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={!content.trim() || isSubmitting || content.length > 2000}
                  className="bg-white hover:bg-zinc-100 text-black font-medium px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}