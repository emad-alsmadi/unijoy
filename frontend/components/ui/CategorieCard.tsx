'use client';
import { HostCategory } from '@/types';
import { Layers, ScrollText, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { memo } from 'react';

interface CategorieCardProps {
  index: number;
  categorie: HostCategory;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CategorieCard = ({
  index,
  categorie,
  onEdit,
  onDelete,
}: CategorieCardProps) => {
  return (
    <div key={categorie._id}>
      <Card className='relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-[1px] border border-purple-200/70 shadow-sm'>
        <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-500' />
        <CardContent className='p-5 sm:p-6 space-y-4'>
          <div className='flex items-start justify-between'>
            <h3 className='text-lg sm:text-xl font-semibold tracking-tight text-purple-900'>
              {categorie.name}
            </h3>
            <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200 shadow-sm'>
              <Layers className='h-4 w-4' />
            </span>
          </div>

          <div className='text-gray-700 text-sm leading-relaxed flex items-start gap-2'>
            <ScrollText className='h-4 w-4 text-purple-500 mt-0.5' />
            <p className='line-clamp-3'>
              {categorie.description}
            </p>
          </div>

          {/* أزرار الأدمن فقط إذا كانت موجودة */}
          {(onEdit || onDelete) && (
            <div className='flex justify-end gap-2 pt-4 border-t border-purple-100 mt-2'>
              {onEdit && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={onEdit}
                  className='inline-flex items-center gap-1.5 rounded-full text-purple-700 border-purple-200'
                >
                  <Pencil size={16} />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={onDelete}
                  className='inline-flex items-center gap-1.5 rounded-full shadow-sm'
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(CategorieCard);
