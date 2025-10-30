import { EventCategory } from '@/types';
import { get } from '@/lib/api/base';

export const fetchEvent = async (
  setLoading: (loading: boolean) => void,
  token: string,
  eventId: string,
  role?: string,
  toast?: any
): Promise<EventCategory | null> => {
  try {
    const path = role ? `/${role}/events/${eventId}` : `/events/${eventId}`;
    const data = await get<any>(path, { token });
    return data.event;
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
    return null;
  } finally {
    setLoading(false);
  }
};
