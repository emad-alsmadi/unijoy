import AdminCategoriesClient from './AdminCategoriesClient';
import { get } from '@/lib/api/base';
import { headers } from 'next/headers';

export default async function AdminCategoriesPage() {
  const initialPage = 1;
  const perPage = 6;
  let initial = { categories: [], totalPages: 0, totalItems: 0 } as any;
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    if (token) {
      initial = await get<{ categories: any[]; totalPages: number; totalItems: number }>(
        `/host-categories?page=${initialPage}&perPage=${perPage}`,
        { token }
      );
    }
  } catch {}

  return (
    <AdminCategoriesClient
      initialCategories={initial?.categories || []}
      initialTotalPages={initial?.totalPages || 0}
      initialTotalItems={initial?.totalItems || 0}
      initialPage={initialPage}
      perPage={perPage}
    />
  );
}