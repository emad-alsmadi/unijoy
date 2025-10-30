import ProfileClient from './ProfileClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function ProfilePage() {
  let detailsProfile: any = null;
  let userRole: string | null = null;
  try {
    const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    if (token) {
      const res = await get<{ profile: any; role?: string }>(`/profile`, { token });
      detailsProfile = (res as any)?.profile || null;
      userRole = (detailsProfile?.role as string) || userRole;
    }
  } catch {}

  return <ProfileClient detailsProfile={detailsProfile} userRole={userRole || ''} />;
}
