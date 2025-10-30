'use client';
import {
  Dialog,
<<<<<<< HEAD
  DialogDescription,
=======
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';import { useToast } from '@/hooks/use-toast';
import { HallType } from '@/types';
import { Loader2 } from 'lucide-react';
interface EditHallDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedHall: HallType) => void;
  hall: HallType | null;
  token: string;
  toast?: any;
=======
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Hall } from '@/app/(auth)/admin/hall/page';

interface EditHallDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedHall: Hall) => void;
  hall: Hall | null;
  token: string;
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
}

export default function EditHallDialog({
  open,
  token,
  onClose,
  onSuccess,
  hall,
<<<<<<< HEAD
  toast,
}: EditHallDialogProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [loading, setLoading] = useState(false);  
=======
}: EditHallDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [loading, setLoading] = useState(false);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

  // تعبئة النموذج عند فتح الـ dialog
  useEffect(() => {
    if (hall) {
<<<<<<< HEAD
      setName(hall.name || '');
      setLocation(hall.location || '');
      setCapacity(hall.capacity || 0);
=======
      setName(hall.name);
      setLocation(hall.location);
      setCapacity(hall.capacity);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
    }
  }, [hall]);

  const handleSubmit = async () => {
    if (!hall) return;
<<<<<<< HEAD
=======
    let Name = hall.name;
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/halls/${hall._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, location, capacity }),
      });

      const data = await res.json();

      toast({
        title: 'Hall Updated',
        description: `${name} was updated successfully.`,
        className: 'bg-green-500 text-white',
      });

      onSuccess(data.hall);
      onClose();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <>
      <Dialog
        open={open}
        onOpenChange={onClose}
      >
        <DialogContent className='max-w-lg p-8 rounded-2xl border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100 shadow-lg'>
          <DialogHeader className='text-center space-y-2'>
            <DialogTitle>Edit Hall</DialogTitle>
          </DialogHeader>

          <DialogDescription className='text-gray-500 text-sm'>
            Edit a hall with name, location, and capacity.
          </DialogDescription>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='space-y-5 mt-4'
          >
            {' '}
            <div>
              <div>
                <label className='block text-sm font-semibold text-purple-800 mb-2'>
                  Hall Name
                </label>
                <Input
                  placeholder='Hall Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all placeholder:text-gray-400'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-purple-800 mb-2'>
                  Location
                </label>
                <Input
                  placeholder='Location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className='rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all placeholder:text-gray-400'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-purple-800 mb-2'>
                  Capacity
                </label>
                <Input
                  type='number'
                  placeholder='Capacity'
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className='rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all placeholder:text-gray-400'
                />
              </div>
            </div>
          </motion.div>
          <DialogFooter className='pt-6 flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={onClose}
              disabled={loading}
              className='rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50 hover:scale-105 transition-transform'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !name || !location || capacity < 1}
              className='rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-6 hover:opacity-90 shadow-md hover:scale-105 transition-transform'
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' /> Updating...
                </span>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
=======
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Hall</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <Input
            placeholder='Hall Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder='Location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            type='number'
            min={1}
            placeholder='Capacity'
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
          />
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name || !location || capacity < 1}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  );
}
