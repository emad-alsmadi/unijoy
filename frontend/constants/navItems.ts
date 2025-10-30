import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Settings,
  Building2,
  University,
  User,
  Home,
} from 'lucide-react';

export const adminSidbarItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/admin/events', icon: CalendarCheck, label: 'Events' },
  {
    href: '/admin/categories',
    icon: Building2,
    label: 'Host Categories',
  },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/hall', icon: University, label: 'Hall' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];
export const hostSidbarItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/host/events', icon: CalendarCheck, label: 'Events' },
  {
    href: '/host/registered-users',
    icon: User,
    label: 'Registered Users',
  },
];
