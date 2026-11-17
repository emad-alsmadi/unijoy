// lib/api/events.ts

import { EventCategory } from '@/types';
import { get, put, apiMultipart } from '@/lib/api/base';

export type UpdateEventPayload = {
  title: string;
  description?: string;
  time: string;
  date: string; // ISO
  startDate: string; // ISO
  endDate: string; // ISO
  price?: number;
  location: string;
  category: string;
  hall?: string;
  capacity: number;
  // image is intentionally omitted here to keep JSON requests. Handle image upload separately if required.
};
interface FetchEventsParams {
  token?: string;
  currentPage?: number;
  eventsPerPage?: number;
  activeFilter?:
    | 'all'
    | 'upcoming'
    | 'past'
    | 'price'
    | 'free'
    | 'pending'
    | 'approved'
    | 'rejected';
  role?: 'admin' | 'host' | 'user' | 'public';
  toast?: any;
  setLoading?: (val: boolean) => void;
}

/**
 * Fetch events based on user role
 */
export const fetchEvents = async ({
  token,
  currentPage = 1,
  eventsPerPage = 3,
  activeFilter = 'all',
  role = 'public',
  toast,
  setLoading,
}: FetchEventsParams) => {
  if (setLoading) setLoading(true);

  const filterType =
    activeFilter === 'all'
      ? ''
      : activeFilter === 'upcoming'
      ? 'upcoming'
      : activeFilter === 'past'
      ? 'past'
      : '';

  // تحديد الـ endpoint حسب الدور
  let endpoint = '';
  switch (role) {
    case 'admin':
      endpoint = `/admin/events`;
      break;
    case 'host':
      endpoint = `/host/events`;
      break;
    case 'user':
      endpoint = `/users/me/registered-events`;
      break;
    case 'public':
      endpoint = `/events`;
      break;
    default:
      endpoint = `/events`;
      break;
  }

  try {
    const data = await get<any>(
      `${endpoint}?page=${currentPage}&perPage=${eventsPerPage}&type=${filterType}`,
      { token }
    );

    // معالجة إضافية لو المستخدم (لتحديث حالة التسجيل من localStorage)
    const updatedEvents = data.events?.map((event: EventCategory) => ({
      ...event,
      isRegistered:
        typeof window !== 'undefined' &&
        localStorage.getItem(`registered_${event._id}`) === 'true',
    }));

    return {
      events: updatedEvents || data.events || [],
      totalItems: data.totalItems || 0,
      totalPages:
        data.totalPages || Math.ceil((data.totalItems || 0) / eventsPerPage),
    };
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
    return { events: [], totalItems: 0, totalPages: 0 };
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const updateEvent = async (
  eventId: string,
  payload: UpdateEventPayload,
  token?: string
) => {
  return put(`/events/${eventId}`, payload, { token });
};

export const updateEventMultipart = async (
  eventId: string,
  formData: FormData,
  token?: string
) => {
  return apiMultipart(`/events/${eventId}`, formData, { token, method: 'PUT' });
};
