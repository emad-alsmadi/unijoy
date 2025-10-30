// components/EditCategoryDialog.tsx


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { HostCategory } from '@/types';
import { fetchCategories } from '@/lib/api/hostCategories';

type EditCategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedHall: HostCategory) => void;
  category: HostCategory | null;
  token: string;
  toast?: any;
};

export default function EditCategoryDialog({
  open,
  token,
  category,
  onClose,
  onSuccess,
  toast,
}: EditCategoryDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!category) return;
    setLoading(true);

    if (name.trim().length < 3 || description.trim().length < 5) return;

    try {
      const res = await fetch(
        `http://localhost:8080/host-categories/${category._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description }),
        }
      );

      const data = await res.json();

      toast({
        title: 'Host category Updated',
        description: `${name} was updated successfully.`,
        className: 'bg-green-500 text-white',
      });
      onSuccess(data.hostCategory);
      console.log('data hostCategory', data.hostCategory);
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
    <>
      {' '}
      <Dialog
        open={open}
        onOpenChange={onClose}
      >
        <DialogContent className='max-w-lg p-8 rounded-2xl border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100 shadow-lg'>
          <DialogHeader className='text-center space-y-2'>
            <DialogTitle>Edit Host Category</DialogTitle>
          </DialogHeader>
          <DialogDescription className='text-gray-500 text-sm'>
            Edit a Host Category with name, and description.
          </DialogDescription>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='space-y-5 mt-4'
          >
            <div>
              <div>
                <label className='block text-sm font-semibold text-purple-800 mb-2'>
                  Host Category Name
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
                  Description
                </label>
                <Textarea
                  placeholder='Host Category Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
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
              disabled={name.length < 3 || description.length < 5}
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
  );
}
