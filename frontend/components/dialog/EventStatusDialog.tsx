'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { EventCategory } from '@/types';
import { useState } from 'react';

interface EventStatusDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventCategory | null;
  action: 'approve' | 'reject' | null;
  onSuccess: (updatedEvent: EventCategory) => void;
}

const EventStatusDialog = ({
  open,
  onClose,
  event,
  action,
  onSuccess,
}: EventStatusDialogProps) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!event || !token) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/admin/events/${event._id}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update event');

      toast({
        title: `Event ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: data.message,
        className: 'bg-green-500 text-white',
      });

      onSuccess({ ...event, status: action === 'approve' ? 'approved' : 'rejected' });
      onClose();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-purple-700">
            {action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {action === 'approve'
              ? `Are you sure you want to approve "${event?.title}"?`
              : `Are you sure you want to reject "${event?.title}"?`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAction}
            disabled={loading}
            variant={action === 'approve' ? 'default' : 'destructive'}
            className="flex-1 sm:flex-none"
          >
            {loading
              ? action === 'approve'
                ? 'Approving...'
                : 'Rejecting...'
              : action === 'approve'
              ? 'Approve'
              : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventStatusDialog;