import HostRegisteredUsersClient from './HostRegisteredUsersClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function HostRegisteredUsersPage() {
  let initialEvents: any[] = [];
  try {
    const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    if (token) {
      const data = await get<{ events: any[] }>(`/host/events`, { token });
      initialEvents = data?.events || [];
    }
  } catch {}

  return <HostRegisteredUsersClient initialEvents={initialEvents} />;
}


