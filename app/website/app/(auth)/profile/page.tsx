import ProfileClient from './ProfileClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';
import { useAuth } from '@/context/AuthContext';

export default async function ProfilePage() {
  try {
    const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    if (token) {
      const res = await get<{ profile: any; role?: string }>(`/profile`, { token });
    
    }
  } catch {}

  return <ProfileClient />;
}
