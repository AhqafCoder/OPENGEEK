'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Card, CardContent } from './card';
import { ImageIcon, X, Loader2 } from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user, isSignedIn } = useUser();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
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

      const response = await postsAPI.createPost(postData);
      
      if (response.success) {
        toast.success('Post created successfully!');
        
        // Reset form
        setContent('');
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Notify parent component
        if (onPostCreated) {
          onPostCreated(response.data.post);
        }
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Card className="bg-black border-zinc-800/50 mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Sign in to share your thoughts with the community</p>
            <Button 
              variant="outline" 
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
              onClick={() => window.location.href = '/sign-in'}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-zinc-800/50 mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          {/* User Avatar and Input */}
          <div className="flex gap-4 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
              <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-white placeholder:text-zinc-500 resize-none border-none outline-none text-lg min-h-[80px] max-h-[200px]"
                maxLength={2000}
                disabled={isSubmitting}
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
            <div className="relative mb-4">
              <div className="relative rounded-lg overflow-hidden border border-zinc-800">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={500}
                  height={300}
                  className="w-full h-auto max-h-[300px] object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={removeImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
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
                className="text-zinc-400 hover:text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting || content.length > 2000}
              className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
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
        </form>
      </CardContent>
    </Card>
  );
}