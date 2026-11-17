import { Calendar, CalendarCheck, LucideIcon, School, Users } from 'lucide-react';

export interface StatItem {
  title: string;
  value: number;
  change: string;
  icon: LucideIcon;
  delay?: number;
}
export const stats: StatItem[] = [
  {
    title: 'Total Events',
    value: 0,
    change: '+12%',
    icon: Users,
  },
  {
    title: 'Reject Events',
    value: 0,
    change: '+23%',
    icon: Calendar,
  },
  {
    title: 'Pending Events',
    value: 0,
    change: '+2',
    icon: School,
  },
  {
    title: 'Approve Events',
    value: 0,
    change: '-5',
    icon: CalendarCheck,
  },
];
