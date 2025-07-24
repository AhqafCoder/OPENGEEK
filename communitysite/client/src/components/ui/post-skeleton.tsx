'use client';

import { Card } from './card';

export function PostSkeleton() {
  return (
    <Card className="bg-black/50 border-zinc-800/50 backdrop-blur-sm animate-pulse">
      <div className="p-4">
        {/* User Info Skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-zinc-800 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
            <div className="h-3 w-16 bg-zinc-800 rounded"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-zinc-800 rounded"></div>
          <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
          <div className="h-4 w-1/2 bg-zinc-800 rounded"></div>
        </div>

        {/* Image Skeleton */}
        <div className="h-48 bg-zinc-800 rounded-lg mb-4"></div>

        {/* Timestamp Skeleton */}
        <div className="h-3 w-20 bg-zinc-800 rounded mb-4"></div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
          <div className="h-8 w-8 bg-zinc-800 rounded"></div>
        </div>
      </div>
    </Card>
  );
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}