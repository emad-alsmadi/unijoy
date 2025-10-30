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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    description: string;
  }) => Promise<void> | void;
  loading?: boolean;
}

export const AddCategoryDialog = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}: AddCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;
    await onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-lg p-8 rounded-2xl border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100 shadow-lg'>
        <DialogHeader className='text-center space-y-2'>
          <DialogTitle className='text-2xl font-bold text-purple-800'>
            Add New Category
          </DialogTitle>
          <DialogDescription className='text-gray-500 text-sm'>
            Add a new host category with name and description.
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
              Category Name
            </label>
            <Input
              placeholder='Enter category name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all placeholder:text-gray-400'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-purple-800 mb-2'>
              Description
            </label>
            <Textarea
              placeholder='Enter category description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all placeholder:text-gray-400 resize-none'
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
            disabled={loading || !name || !description}
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
