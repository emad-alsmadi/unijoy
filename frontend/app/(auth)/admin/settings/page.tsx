// app/(admin)/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  User,
  Edit,
  Trash,
  Lock,
  LockOpen,
  ChevronDown,
  ChevronUp,
  Settings,
  UserPlus,
  Download,
  Check,
  X,
  Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SystemSettingsSection from '@/components/admin/settings/SystemSettingsSection';
import PaymentSettingsSection from '@/components/admin/settings/PaymentSettingsSection';
import NotificationsSection from '@/components/admin/settings/NotificationsSection';
import AnalyticsLogsSection from '@/components/admin/settings/AnalyticsLogsSection';
import AdvancedSettingsSection from '@/components/admin/settings/AdvancedSettingsSection';

// تعريف مخطط Zod لنموذج المستخدم
const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'يجب أن يكون الاسم مكون من حرفين على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  role: z.enum(['student', 'host', 'admin']),
  status: z.enum(['active', 'disabled']),
  joinDate: z.string(),
});

type User = z.infer<typeof userSchema>;

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
  });

  // تهيئة react-hook-form
  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      role: 'student',
      status: 'active',
      joinDate: '',
    },
  });

  // جلب بيانات المستخدمين (محاكاة)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // محاكاة جلب البيانات من API
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'علي أحمد',
            email: 'ali.ahmed@university.edu',
            role: 'student',
            status: 'active',
            joinDate: '2023-01-15',
          },
          {
            id: '2',
            name: 'سارة محمد',
            email: 'sara.mohammed@university.edu',
            role: 'student',
            status: 'active',
            joinDate: '2023-02-20',
          },
          {
            id: '3',
            name: 'محمد خالد',
            email: 'mohammed.khaled@university.edu',
            role: 'host',
            status: 'active',
            joinDate: '2022-11-05',
          },
          {
            id: '4',
            name: 'فاطمة حسن',
            email: 'fatima.hassan@university.edu',
            role: 'host',
            status: 'disabled',
            joinDate: '2022-09-12',
          },
          {
            id: '5',
            name: 'أحمد علي',
            email: 'ahmed.ali@university.edu',
            role: 'admin',
            status: 'active',
            joinDate: '2021-08-30',
          },
          {
            id: '6',
            name: 'نورا سعيد',
            email: 'nora.saeed@university.edu',
            role: 'host',
            status: 'active',
            joinDate: '2023-03-18',
          },
          {
            id: '7',
            name: 'يوسف كمال',
            email: 'youssef.kamal@university.edu',
            role: 'student',
            status: 'disabled',
            joinDate: '2023-04-22',
          },
          {
            id: '8',
            name: 'ليلى عبدالله',
            email: 'layla.abdullah@university.edu',
            role: 'host',
            status: 'active',
            joinDate: '2022-12-10',
          },
        ];

        // إضافة تأخير لمحاكاة جلب البيانات
        await new Promise((resolve) => setTimeout(resolve, 800));

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        toast({
          title: 'Failed to fetch data',
          description: 'An error occurred while fetching users data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // تطبيق الفلاتر والبحث
  useEffect(() => {
    let result = [...users];

    // تطبيق بحث البريد الإلكتروني
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // تطبيق فلتر الدور
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    // تطبيق فلتر الحالة
    if (statusFilter !== 'all') {
      result = result.filter((user) => user.status === statusFilter);
    }

    // تطبيق الترتيب
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);

  // معالجة تغيير الترتيب
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // فتح نموذج التعديل
  const handleEdit = (user: User) => {
    form.reset(user);
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // إغلاق نموذج التعديل
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    form.reset();
  };

  // معالجة تحديث المستخدم
  const handleUpdateUser = async (data: User) => {
    try {
      // محاكاة تحديث المستخدم في الخادم
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === data.id ? data : user))
      );

      toast({
        title: 'Updated successfully',
        description: 'User information has been updated',
        className: 'bg-green-600 text-white border-0',
      });

      handleCloseEditModal();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'An error occurred while updating the user',
        variant: 'destructive',
      });
    }
  };

  // فتح نموذج الحذف
  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // معالجة حذف المستخدم
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // محاكاة حذف المستخدم في الخادم
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );

      toast({
        title: 'Deleted successfully',
        description: 'The user has been deleted',
        className: 'bg-green-600 text-white border-0',
      });

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'An error occurred while deleting the user',
        variant: 'destructive',
      });
    }
  };

  // تبديل حالة المستخدم
  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'disabled' : 'active';

      // محاكاة تحديث حالة المستخدم في الخادم
      await new Promise((resolve) => setTimeout(resolve, 300));

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      toast({
        title: `Account ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
        description: 'User status changed successfully',
        className: 'bg-green-600 text-white border-0',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'An error occurred while changing user status',
        variant: 'destructive',
      });
    }
  };

  // عرض أيقونة الترتيب
  const renderSortIcon = (field: keyof User) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // عرض شارة الدور
  const renderRoleBadge = (role: User['role']) => {
    const roleConfig = {
      student: { label: 'طالب', color: 'bg-blue-100 text-blue-800' },
      host: { label: 'مضيف', color: 'bg-purple-100 text-purple-800' },
      admin: { label: 'مشرف', color: 'bg-amber-100 text-amber-800' },
    };

    return (
      <Badge className={cn('px-3 py-1 rounded-full', roleConfig[role].color)}>
        {roleConfig[role].label}
      </Badge>
    );
  };

  // عرض شارة الحالة
  const renderStatusBadge = (status: User['status']) => {
    return status === 'active' ? (
      <Badge className='bg-green-100 text-green-800 px-3 py-1 rounded-full'>
        نشط
      </Badge>
    ) : (
      <Badge className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full'>
        معطل
      </Badge>
    );
  };

  // توليد الأحرف الأولى من الاسم
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  // تبديل إعدادات النظام
  const handleSystemSettingChange = (setting: keyof typeof systemSettings) => {
    setSystemSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    toast({
      title: 'تم تحديث الإعدادات',
      description: `تم ${systemSettings[setting] ? 'تعطيل' : 'تفعيل'} ${
        setting === 'emailNotifications'
          ? 'الإشعارات'
          : setting === 'darkMode'
          ? 'الوضع الليلي'
          : 'الحفظ التلقائي'
      }`,
      className: 'bg-blue-600 text-white border-0',
    });
  };

  // التبديل بين تحرير المجموعة
  const toggleBulkEditing = () => {
    setIsBulkEditing(!isBulkEditing);
    setSelectedUsers([]);
  };

  // تحديد/إلغاء تحديد مستخدم
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // تحديد/إلغاء تحديد الكل
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  // تطبيق الحالة على المستخدمين المحددين
  const applyStatusToSelected = (status: 'active' | 'disabled') => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status } : user
      )
    );

    toast({
      title: 'Users updated',
      description: `Changed status for ${selectedUsers.length} users`,
      className: 'bg-green-600 text-white border-0',
    });

    setSelectedUsers([]);
    setIsBulkEditing(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-7xl mx-auto'
      >
        <motion.div
          className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white mb-6'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold flex items-center gap-3'>
                <Settings className='text-white' size={28} />
                Admin Control Panel
              </h1>
              <p className='mt-2 opacity-90'>Manage advanced settings for the UniJoy platform</p>
            </div>
            <Avatar className='border-2 border-white'>
              <AvatarFallback className='bg-indigo-700'>SA</AvatarFallback>
            </Avatar>
          </div>

          <div className='grid grid-cols-3 gap-4 mt-8'>
            <div className='bg-white/10 p-4 rounded-lg'>
              <p className='text-sm opacity-80'>Users</p>
              <p className='text-2xl font-bold mt-1'>{users.length}</p>
            </div>
            <div className='bg-white/10 p-4 rounded-lg'>
              <p className='text-sm opacity-80'>Active</p>
              <p className='text-2xl font-bold mt-1'>
                {users.filter((u) => u.status === 'active').length}
              </p>
            </div>
            <div className='bg-white/10 p-4 rounded-lg'>
              <p className='text-sm opacity-80'>Admins</p>
              <p className='text-2xl font-bold mt-1'>
                {users.filter((u) => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Tabs defaultValue='system' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='system'>System</TabsTrigger>
              <TabsTrigger value='payment'>Payments</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics & Logs</TabsTrigger>
              <TabsTrigger value='advanced'>Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value='system'>
              <SystemSettingsSection />
            </TabsContent>
            <TabsContent value='payment'>
              <PaymentSettingsSection />
            </TabsContent>
            <TabsContent value='notifications'>
              <NotificationsSection />
            </TabsContent>
            <TabsContent value='analytics'>
              <AnalyticsLogsSection />
            </TabsContent>
            <TabsContent value='advanced'>
              <AdvancedSettingsSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;
