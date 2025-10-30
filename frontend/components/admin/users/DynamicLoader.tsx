"use client";
export default function DynamicLoader({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-8 rounded-md bg-gray-200/80 dark:bg-white/10" />
      ))}
    </div>
  );
}
