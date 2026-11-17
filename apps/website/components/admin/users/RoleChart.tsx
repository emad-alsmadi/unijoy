"use client";
import { useMemo } from "react";

export type RoleSlice = { label: string; value: number; color: string };

export default function RoleChart({ data }: { data: RoleSlice[] }) {
  const total = useMemo(() => data.reduce((a, b) => a + b.value, 0), [data]);
  let acc = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Role Distribution</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="12" />
          {data.map((d, i) => {
            const val = d.value / (total || 1);
            const dash = val * circumference;
            const gap = circumference - dash;
            const rot = (acc / (total || 1)) * 360;
            acc += d.value;
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(${rot} 50 50)`}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
              <span className="text-gray-700 dark:text-slate-200">{d.label}</span>
              <span className="ml-auto text-gray-500 dark:text-slate-400">{((d.value / (total || 1)) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
