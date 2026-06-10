import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('animate-pulse rounded-lg bg-gray-200/70', className)} />
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 8, cols = 5 }) => (
  <div className="space-y-3">
    <div className="flex gap-4 px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 px-4 py-4 border-t border-gray-100">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className={`h-4 ${c === 0 ? 'flex-[2]' : 'flex-1'}`} />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-40 lg:h-56 bg-gray-200 rounded-t-xl" />
    <div className="flex items-center gap-4 px-6 -mt-12">
      <Skeleton className="h-24 w-24 rounded-full ring-4 ring-white" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="px-6 space-y-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  </div>
);
