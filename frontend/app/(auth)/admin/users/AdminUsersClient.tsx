'use client';
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from 'use-debounce';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Plus,
  Trash2,
  User,
  UserX,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Filter,
  Activity,
  Clock,
  X,
  Check,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { get, del, apiRequest } from '@/lib/api/base';
import StatCard from '@/components/admin/users/StatCard';

const RoleChart = dynamic(() => import('@/components/admin/users/RoleChart'), {
  ssr: false,
  loading: () => (
    <div className='h-56 rounded-2xl bg-gray-200/50 animate-pulse' />
  ),
});
const SignupTrendChart = dynamic(
  () => import('@/components/admin/users/SignupTrendChart'),
  {
    ssr: false,
    loading: () => (
      <div className='h-56 rounded-2xl bg-gray-200/50 animate-pulse' />
    ),
  }
);
const Pagination = dynamic(() => import('@/components/ui/pagination'), {
  ssr: false,
  loading: () => <div className='h-10' />,
});
const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  { ssr: false, loading: () => <div className='min-h-[30vh]' /> }
);
const Stats = dynamic(
  () => import('@/components/ui/Stats').then((m) => m.Stats),
  { ssr: false }
);
const DeleteConfirmationDialog = dynamic(
  () => import('@/components/dialog/DeleteConfirmationDialog'),
  { ssr: false }
);
const StatusConfirmationDialog = dynamic(
  () =>
    import('@/components/ui/StatusConfirmationDialog').then(
      (m) => m.StatusConfirmationDialog
    ),
  { ssr: false }
);

const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string(),
  hostStatus: z.string(),
});
export type User = z.infer<typeof userSchema>;

export default function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(
    initialUsers || []
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(
    null
  );
  const [nextStatus, setNextStatus] = useState<'approved' | 'rejected'>(
    'approved'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(initialUsers?.length || 0);
  const [usersPerPage] = useState(8);
  const queryClient = useQueryClient();

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: '', hostStatus: '' },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'admin-users',
      currentPage,
      usersPerPage,
      roleFilter,
      statusFilter,
    ],
    queryFn: async () =>
      get<{ users: User[] }>(`/admin/users`, {
        token,
        onError: (err) =>
          toast({
            title: 'Error',
            description: err.message,
            variant: 'destructive',
          }),
      }),
    enabled: !!token,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    initialData: { users: initialUsers || [] },
  });

  useEffect(() => {
    const list = data?.users || [];
    setUsers(list);
    setFilteredUsers(list);
    setTotalItems(list.length);
    setTotalPages(Math.ceil(list.length / usersPerPage));
  }, [data, usersPerPage]);

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalHosts = users.filter((u) => u.role === 'host').length;
  const totalRegular = users.filter((u) => u.role === 'user').length;
  const rejectedHosts = users.filter(
    (u) => u.role === 'host' && u.hostStatus === 'rejected'
  ).length;
  const activeUsers = totalUsers - rejectedHosts;
  const inactiveUsers = rejectedHosts;

  const roleChartData = [
    { label: 'Admin', value: totalAdmins, color: '#8b5cf6' },
    { label: 'Host', value: totalHosts, color: '#f59e0b' },
    { label: 'User', value: totalRegular, color: '#10b981' },
  ];
  const signupTrend = Array.from({ length: 6 }).map((_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i] || `M${i + 1}`,
    value: Math.max(
      1,
      Math.round((totalUsers || 10) * (0.5 + Math.sin((i + 1) * 0.8) * 0.3))
    ),
  }));

  useEffect(() => {
    let result = users;
    if (debouncedQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    if (roleFilter !== 'all')
      result = result.filter((user) => user.role === roleFilter);
    if (statusFilter !== 'all')
      result = result.filter((user) => user.hostStatus === statusFilter);
    result?.sort((a, b) => {
      const av = String((a as any)[sortField] ?? '');
      const bv = String((b as any)[sortField] ?? '');
      const cmp = av.localeCompare(bv);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [
    users,
    debouncedQuery,
    roleFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: keyof User) => {
    if (sortField === field)
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const statusMutation = useMutation({
    mutationFn: async ({
      userId,
      hostStatus,
    }: {
      userId: string;
      hostStatus: 'approved' | 'rejected' | 'pending';
    }) =>
      apiRequest<{ message: string; user: User }>(`/admin/hosts/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ hostStatus }),
        token,
      }),
    onSuccess: (resp) => {
      toast({
        title: 'Status Updated',
        description: resp.message,
        className: 'bg-blue-600 text-white border-0',
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === resp.user._id ? (resp.user as any) : u))
      );
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    },
  });
  const handleToggleStatus = (
    user: User,
    newStatus: 'approved' | 'rejected' | 'pending'
  ) => {
    statusMutation.mutate({
      userId: user._id as string,
      hostStatus: newStatus,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => del<{ message: string }>(`/admin/users/${userId}`, { token }),
    onSuccess: (resp, userId) => {
      toast({
        title: 'User Deleted',
        description: resp.message,
        className: 'bg-green-600 text-white border-0',
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    },
  });
  const confirmDelete = async () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser._id as string);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  const adminCount = users.filter((e) => e.role === 'admin').length;
  const hostCount = users.filter((e) => e.role === 'host').length;
  const userCount = users.filter((e) => e.role === 'user').length;
  const pendingHostCount = users.filter(
    (e) => e.hostStatus === 'pending'
  ).length;
  const aproveHostCount = users.filter(
    (e) => e.hostStatus === 'aproved'
  ).length;
  const rejectedHostCount = users.filter(
    (e) => e.hostStatus === 'rejected'
  ).length;
  const kpis = useMemo(() => {
    const total = users.length;
    return [
      { title: 'Total', value: total, change: '+0%', icon: Activity },
      { title: 'Admin', value: adminCount, change: '+0%', icon: Activity },
      { title: 'Host', value: hostCount, change: '-0%', icon: Activity },
      { title: 'User', value: userCount, change: '+0%', icon: Activity },
      {
        title: 'User',
        value: pendingHostCount,
        change: '+0%',
        icon: Activity,
      },
      {
        title: 'User',
        value: aproveHostCount,
        change: '+0%',
        icon: Activity,
      },
      {
        title: 'User',
        value: rejectedHostCount,
        change: '+0%',
        icon: X,
      },
    ];
  }, [
    adminCount,
    hostCount,
    userCount,
    pendingHostCount,
    aproveHostCount,
    rejectedHostCount,
  ]);
  if (isLoading) {
    return <Loading />;
  }
  if (isError)
    return <NotFound message={(error as Error)?.message || 'Error'} />;

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-7xl mx-auto'
      >
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6'
        >
          {kpis.map((k, index) => (
            <StatCard
              key={index}
              title={k.title}
              value={k.value}
              delta={k.change}
              icon={k.icon as any}
            />
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'
        >
          <div className='lg:col-span-1'>
            <RoleChart data={roleChartData} />
          </div>
          <div className='lg:col-span-2'>
            <SignupTrendChart data={signupTrend} />
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'
        >
          <SearchInput
            name='Users'
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={() => setCurrentPage(1)}
          />
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className='w-full'>
              <div className='flex items-center'>
                <User className='mr-2 h-4 w-4' />
                <span>{roleFilter === 'all' ? 'All Roles' : roleFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              <SelectItem value='host'>Host</SelectItem>
              <SelectItem value='user'>User</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className='w-full'>
              <div className='flex items-center'>
                <Filter className='mr-2 h-4 w-4' />
                <span>
                  {statusFilter === 'all' ? 'All Statuses' : statusFilter}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='approved'>approve</SelectItem>
              <SelectItem value='rejected'>rejecte</SelectItem>
              <SelectItem value='pending'>pending</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='w-full'
              >
                <span className='flex items-center'>
                  Sort by: {sortField}{' '}
                  {sortDirection === 'asc' ? (
                    <ChevronUp className='ml-1 h-4 w-4' />
                  ) : (
                    <ChevronDown className='ml-1 h-4 w-4' />
                  )}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('email')}>
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('role')}>
                Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className='rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur p-4 shadow-sm'>
            <Table>
              <TableHeader className='bg-white/60 dark:bg-slate-900/40 backdrop-blur text-gray-600 dark:text-slate-300'>
                <TableRow>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Name
                  </TableHead>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Email
                  </TableHead>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Role
                  </TableHead>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Join Date
                  </TableHead>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Host Status
                  </TableHead>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Handle Status
                  </TableHead>
                  <TableHead className='cursor-pointer py-3 text-xs font-semibold uppercase tracking-wide'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data && users.length === 0 ? (
                  Array.from({ length: usersPerPage }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <div className='h-10 w-full rounded bg-gray-200/60 animate-pulse' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : currentUsers?.length === 0 ? (
                  <NotFound message='No users found' />
                ) : (
                  currentUsers?.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className='group border-b border-gray-200/70 dark:border-white/10 transition-all duration-200 hover:bg-white/60 dark:hover:bg-white/[0.03] hover:-translate-y-[1px] hover:shadow-sm hover:ring-1 hover:ring-purple-200/70 dark:hover:ring-purple-500/20 rounded-md'
                    >
                      <TableCell className='font-medium py-3'>
                        <div className='flex items-center gap-3'>
                          <Avatar>
                            <AvatarFallback className='bg-indigo-100 text-indigo-800'>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='font-medium text-gray-900 dark:text-slate-100'>
                            {user.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='py-3 text-gray-700 dark:text-slate-200'>
                        {user.email}
                      </TableCell>
                      <TableCell className='py-3'>
                        <Badge className='px-2.5 py-0.5 rounded-full text-xs capitalize'>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className='py-3 text-gray-600 dark:text-slate-300'>
                        -
                      </TableCell>
                      <TableCell className='py-3'>
                        <div>
                          {user.role === 'host' ? (
                            <Badge
                              variant={
                                user.hostStatus === 'pending'
                                  ? 'default'
                                  : user.hostStatus === 'approved'
                                  ? 'success'
                                  : user.hostStatus === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className='capitalize px-2.5 py-0.5 rounded-full text-xs'
                            >
                              {user.hostStatus}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='py-3'>
                        {user.role === 'host' && (
                          <div>
                            {user.hostStatus === 'pending' ? (
                              <>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-green-600 hover:bg-green-50 shadow-sm hover:shadow'
                                  onClick={() => {
                                    setSelectedStatusUser(user);
                                    setNextStatus('approved');
                                    setIsStatusDialogOpen(true);
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='ms-2 text-red-600 hover:bg-red-50 shadow-sm hover:shadow'
                                  onClick={() => {
                                    setSelectedStatusUser(user);
                                    setNextStatus('rejected');
                                    setIsStatusDialogOpen(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : user.hostStatus === 'approved' ? (
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 hover:bg-red-50 shadow-sm hover:shadow'
                                onClick={() => {
                                  setSelectedStatusUser(user);
                                  setNextStatus('rejected');
                                  setIsStatusDialogOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            ) : (
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-green-600 hover:bg-green-50 shadow-sm hover:shadow'
                                onClick={() => {
                                  setSelectedStatusUser(user);
                                  setNextStatus('approved');
                                  setIsStatusDialogOpen(true);
                                }}
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='py-3'>
                        <div className='flex gap-2'>
                          <TooltipProvider>
                            {/* Toggle status icon */}
                            {user.role === 'host' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className='flex gap-2'>
                                    <Button
                                      variant='outline'
                                      size='icon'
                                      onClick={() => {
                                        setSelectedStatusUser(user);
                                        setIsStatusDialogOpen(true);
                                      }}
                                      className={
                                        (user.hostStatus === 'approved'
                                          ? 'text-orange-600 hover:bg-orange-50 '
                                          : 'text-green-600 hover:bg-green-50 ') +
                                        'shadow-sm hover:shadow'
                                      }
                                    >
                                      {user.hostStatus === 'approved' ? (
                                        <UserX className='h-4 w-4' />
                                      ) : (
                                        <UserCheck className='h-4 w-4' />
                                      )}
                                    </Button>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit State User</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {/* Delete */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className='text-red-600 hover:bg-red-50 shadow-sm hover:shadow'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete User</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Pagination */}
        {totalItems >= usersPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            paginate={(p: number) => setCurrentPage(p)}
          />
        )}

        {/* Stats */}
        <Stats users={users} />
      </motion.div>

      {/* Status Dialog */}
      <StatusConfirmationDialog
        open={isStatusDialogOpen}
        user={selectedStatusUser}
        status={nextStatus}
        onCancel={() => setIsStatusDialogOpen(false)}
        onConfirm={(user) => {
          if (user) handleToggleStatus(user, nextStatus);
          setIsStatusDialogOpen(false);
        }}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedUser) confirmDelete();
        }}
        user={selectedUser || undefined}
      />
    </div>
  );
}
