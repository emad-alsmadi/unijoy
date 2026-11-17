"use client";
import { motion } from "framer-motion";
import { ElementType } from "react";

export default function StatCard({
  title,
  value,
  delta,
  icon,
  color = "text-indigo-600",
}: {
  title: string;
  value: string | number;
  delta?: string;
  icon: ElementType;
  color?: string;
}) {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">{value}</p>
          {delta && (
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{delta} from last period</p>
          )}
        </div>
        <div className={`h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center ${color}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>
    </motion.div>
  );
}
