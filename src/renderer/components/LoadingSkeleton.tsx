export function LoadingSkeleton() {
  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="mb-6 space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg animate-pulse">
            <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded mb-2 w-1/2" />
            <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded" />
          </div>
        ))}
      </div>

      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
    </div>
  )
}
