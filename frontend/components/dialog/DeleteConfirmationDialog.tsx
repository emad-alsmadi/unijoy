
'use client';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/app/(auth)/admin/users/page';
interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  user?: User;
}

export default function DeleteConfirmationDialog({
  open,
  onClose,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this user? This action cannot be undone.',
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  onConfirm,
  user,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-lg p-8 rounded-2xl border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100 shadow-lg'>
        <DialogHeader className='text-center space-y-2'>
          <DialogTitle className='text-2xl font-bold text-purple-800'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-gray-500 text-sm'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='space-y-5 mt-4'
        >
          {user && (
            <div className='flex items-center gap-4'>
              <div className='bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16' />
              <div>
                <h4 className='font-semibold'>{user.name}</h4>
                <p className='text-gray-500'>{user.email}</p>
              </div>
            </div>
          )}
        </motion.div>

        <DialogFooter className='pt-6 flex justify-end gap-3'>
          <Button
            variant='outline'
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}