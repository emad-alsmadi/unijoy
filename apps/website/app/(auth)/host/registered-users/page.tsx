import HostRegisteredUsersClient from './HostRegisteredUsersClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function HostRegisteredUsersPage() {
  let initialEvents: any[] = [];
  const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
  const initialToken = cookieHeader
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith('token='))
    ?.split('=')[1] || '';
  try {
    if (initialToken) {
      const data = await get<{ events: any[] }>(`/host/events`, { token: initialToken });
      initialEvents = data?.events || [];
    }
  } catch {}

  return <HostRegisteredUsersClient initialEvents={initialEvents} initialToken={initialToken} />;
}


