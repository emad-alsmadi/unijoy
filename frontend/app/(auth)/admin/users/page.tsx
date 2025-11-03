
import AdminUsersClient from './AdminUsersClient';
import { get } from '@/lib/api/base';
import { headers } from 'next/headers';

export default async function AdminUsersPage() {
  let initialUsers: any[] = [];
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  const initialToken = cookieHeader
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith('token='))
    ?.split('=')[1] || '';
  try {
    if (initialToken) {
      const data = await get<{ users: any[]}>(`/admin/users`, { token: initialToken });
      initialUsers = data?.users || [];
    }
  } catch {}

  return <AdminUsersClient initialUsers={initialUsers} initialToken={initialToken} />;
}
