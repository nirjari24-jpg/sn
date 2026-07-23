import React from 'react';
import clsx from 'clsx';
import GlassCard from './GlassCard';

export function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-white/10 rounded-md",
        className
      )}
    />
  );
}

export function SkeletonText({ lines = 1, className }) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={clsx("h-4", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <GlassCard className={clsx("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
         <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </GlassCard>
  );
}
