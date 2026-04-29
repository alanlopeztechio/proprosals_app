'use client';

export function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4 px-4 py-3 border-b border-border bg-muted/20">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 flex-1 bg-muted rounded animate-pulse" />
        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
      </div>

      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex gap-4 px-4 py-4 border-b border-border hover:bg-muted/50"
        >
          <div className="flex items-center gap-3 w-32">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="h-4 flex-1 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="h-3 bg-muted/60 rounded animate-pulse w-1/2" />
          </div>
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
