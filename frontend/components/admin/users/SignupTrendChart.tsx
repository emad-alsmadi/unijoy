"use client";

export type Point = { label: string; value: number };

export default function SignupTrendChart({ data }: { data: Point[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Monthly Signups</h4>
      <div className="flex items-end gap-2 h-40">
        {data.map((d) => (
          <div key={d.label} className="flex-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 dark:from-indigo-500 dark:to-purple-400"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}`}
            />
            <div className="mt-1 text-[10px] text-center text-gray-500 dark:text-slate-400">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
