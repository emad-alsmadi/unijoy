import { EventCategory } from '@/types';
import { del } from '@/lib/api/base';

export const deleteEvent = async (
  token: string,
  event: EventCategory,
  setEvents: React.Dispatch<React.SetStateAction<EventCategory[]>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventCategory | null>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  toast?: any
) => {
  if (!event?._id) return;

  try {
    const data = await del<{ message?: string }>(`/host/events/${event._id}`, { token });

    // ✅ إزالة الحدث من الواجهة مباشرة بعد نجاح الحذف
    setEvents((prev) => prev.filter((e) => e._id !== event._id));

    toast({
      title: 'Event Deleted',
      description: data?.message || 'Event deleted successfully.',
      className: 'bg-green-600 text-white border-0',
    });
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error?.message || 'An unexpected error occurred.',
      className: 'bg-red-500 text-white border-0',
    });
  } finally {
    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  }
};
