'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { HallType } from '@/types';

interface AddHallDialogProps {
  open: boolean;
  onClose: () => void;
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
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
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
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
