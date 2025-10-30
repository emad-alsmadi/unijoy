import {
  School2Icon,
  Flame,
  Clock3,
  DollarSign,
  Gift,
  History,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  LucideIcon,
  List,
} from 'lucide-react';

interface FiltersType {
  label: string;
  icon: LucideIcon;
  value?: string;
}
export const filters: FiltersType[] = [
  { label: 'All', icon: School2Icon },
  { label: 'Upcoming', icon: Flame },
  { label: 'Past', icon: Clock3 },
];

// تسميات الفلاتر
export const filterLabels: FiltersType[] = [
  { label: 'All', icon: List, value: 'all' },
  { label: 'Upcoming', icon: Flame, value: 'upcoming' },
  { label: 'Past', icon: History, value: 'past' },
  { label: 'Pending', icon: PendingIcon, value: 'pending' },
  { label: 'Approved', icon: CheckCircle, value: 'approved' },
  { label: 'Rejected', icon: XCircle, value: 'rejected' },
];
