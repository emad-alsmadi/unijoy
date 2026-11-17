import HallsClient from './HallsClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function HallsPage() {
  const initialPage = 1;
  const perPage = 3;

  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('token='))
    ?.split('=')[1];

  const data = await get<{
    halls: any[];
    totalItems: number;
    totalPages: number;
  }>(`/halls?page=${initialPage}&perPage=${perPage}`, { token });

  return (
    <HallsClient
      initialHalls={data?.halls || []}
      initialTotalItems={data?.totalItems || 0}
      initialTotalPages={data?.totalPages || 0}
      initialPage={initialPage}
      perPage={perPage}
    />
  );
}
