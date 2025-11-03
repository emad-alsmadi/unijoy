
import AdminHallsClient from './AdminHallsClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function AdminHallsPage() {
  const initialPage = 1;
  const perPage = 6;
  let initial = { halls: [], totalPages: 0, totalItems: 0 } as any;
  const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
  const initialToken = cookieHeader
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith('token='))
    ?.split('=')[1] || '';
  try {
    if (initialToken) {
      initial = await get<{ halls: any[]; totalPages: number; totalItems: number }>(
        `/halls?page=${initialPage}&perPage=${perPage}`,
        { token: initialToken }
      );
    }
  } catch {}

  return (
    <AdminHallsClient
      initialHalls={initial?.halls || []}
      initialTotalPages={initial?.totalPages || 0}
      initialTotalItems={initial?.totalItems || 0}
      initialPage={initialPage}
      perPage={perPage}
      initialToken={initialToken}
    />
  );
}
