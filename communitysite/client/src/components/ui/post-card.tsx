'use client';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Card } from './card';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';

interface PostCardProps {
  id: string;
  user: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  isLiked?: boolean;
  onLike?: () => void;
}

export function PostCard({ 
  id, 
  user, 
  content, 
  timestamp, 
  likes, 
  comments, 
  image, 
  isLiked = false,
  onLike 
}: PostCardProps) {
  return (
    <Card className="bg-black/50 border-zinc-800/50 backdrop-blur-sm">
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-sm text-zinc-400">@{user.username}</div>
          </div>
        </div>

        {/* Content */}
        <p className="text-zinc-100 mb-4">{content}</p>

        {/* Image */}
        {image && (
          <div className="mb-4 rounded-lg overflow-hidden relative aspect-[16/9]">
            <Image 
              src={image} 
              alt="Post content" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Timestamp */}
        <div className="text-sm text-zinc-500 mb-4">{timestamp}</div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLike}
            className={`${
              isLiked 
                ? 'text-red-500 hover:text-red-400 hover:bg-red-500/10' 
                : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
            } transition-colors`}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10">
            <MessageCircle className="h-4 w-4 mr-1" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 