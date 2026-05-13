const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />
);

export const CourseGridSkeleton = () => (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="glass overflow-hidden rounded-lg">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="space-y-4 p-5">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
