export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-[#1a1c23] rounded-2xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden h-[380px]">
          <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}