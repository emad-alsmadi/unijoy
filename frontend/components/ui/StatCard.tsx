<<<<<<< HEAD
import { StatItem } from '@/constants/stats';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  change,
  icon,
  delay = 0,
}: StatItem) => {
  const Icon = icon; // ← تحويل الأيقونة إلى مكون قابل للعرض

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-2xl border border-purple-100/70 bg-gradient-to-br from-white via-white to-purple-50 p-6 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-extrabold mt-1 tracking-tight text-purple-900">{value}</p>
          <span
            className={`text-sm font-medium ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 ring-1 ring-purple-200/60">
          <Icon className="w-6 h-6 text-purple-700" />
        </div>
      </div>
    </motion.div>
  );
};
=======
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon | React.ReactNode;
    delay?: number;
}

export const StatCard = ({ title, value, change, icon: Icon, delay = 0 }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold mt-2">{value}</p>
                <span className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
                {typeof Icon === 'function' ? <Icon className="w-6 h-6 text-indigo-600" /> : Icon}
            </div>
        </div>
    </motion.div >
);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
