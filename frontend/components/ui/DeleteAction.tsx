'use client';
import { Button } from './button';
import { Trash2 } from 'lucide-react';

type DeleteActionProps = {
  onClick: () => void;
  label?: string;
  size?: 'icon' | 'sm' | 'md';
  className?: string;
};

export function DeleteAction({ onClick, label = 'Delete', size = 'icon', className }: DeleteActionProps) {
  if (size === 'icon') {
    return (
      <Button
        variant='outline'
        size='icon'
        onClick={onClick}
        className={`text-red-600 hover:bg-red-50 ${className || ''}`}
        aria-label='Delete'
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    );
  }

  return (
    <Button
      variant='destructive'
      size={size === 'sm' ? 'sm' : undefined}
      onClick={onClick}
      className={className}
    >
      <Trash2 className='h-4 w-4 mr-2' /> {label}
    </Button>
  );
}

export default DeleteAction;


