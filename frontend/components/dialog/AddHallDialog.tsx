<<<<<<< HEAD
'use client';
=======
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { HallType } from '@/types';
=======
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Hall } from '@/app/(auth)/admin/hall/page';
import { useAuth } from '@/context/AuthContext';
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

interface AddHallDialogProps {
  open: boolean;
  onClose: () => void;
<<<<<<< HEAD
  onSubmit: (values: HallType) => Promise<void> | void;
  loading?: boolean;
}

export const AddHallDialog = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}: AddHallDialogProps) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !capacity) return;
    await onSubmit({ name, location, capacity: Number(capacity) });
    setName('');
    setLocation('');
    setCapacity('');
=======
  onSuccess: (newHall: Hall) => void;
}

export default function AddHallDialog({
  open,
  onClose,
  onSuccess,
}: AddHallDialogProps) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/halls', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, location, capacity }),
      });

      const data = await res.json();

      toast({
        title: 'Hall Added',
        description: `${data.hall.name} was added successfully.`,
        className: 'bg-green-500 text-white',
      });

      onClose();
      onSuccess(data.hall);
      setName('');
      setLocation('');
      setCapacity(1);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
<<<<<<< HEAD
      <DialogContent className='max-w-lg p-8 rounded-2xl border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100 shadow-lg'>
        <DialogHeader className='text-center space-y-2'>
          <DialogTitle className='text-2xl font-bold text-purple-800'>
            Add New Hall
          </DialogTitle>
          <DialogDescription className='text-gray-500 text-sm'>
            Add a new hall with name, location, and capacity.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='space-y-5 mt-4'
        >
          <div>
            <label className='block text-sm font-semibold text-purple-800 mb-2'>
              Hall Name
            </label>
            <Input
              placeholder='Enter hall name'
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
              placeholder='Enter hall location'
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
              placeholder='Enter capacity'
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className='rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all placeholder:text-gray-400'
            />
          </div>
        </motion.div>
        <DialogFooter className='pt-6 flex justify-end gap-3'>
          <Button
            variant='outline'
            onClick={onClose}
            className='rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50 hover:scale-105 transition-transform'
=======
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Hall</DialogTitle>
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
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
<<<<<<< HEAD
            disabled={loading || !name || !location || !capacity}
            className='rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-6 hover:opacity-90 shadow-md hover:scale-105 transition-transform'
          >
            {loading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' /> Saving...
              </span>
            ) : (
              'Save'
            )}
=======
            disabled={loading || !name || !location || capacity < 1}
          >
            Add
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
