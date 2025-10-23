export function VideoSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* Thumbnail skeleton */}
        <div className="w-40 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="flex gap-2 mt-3">
            <div className="h-9 bg-gray-200 rounded-lg w-32" />
            <div className="h-9 bg-gray-200 rounded-lg w-32" />
            <div className="h-9 bg-gray-200 rounded-lg w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border-2 border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function TranscriptSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 p-4">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
