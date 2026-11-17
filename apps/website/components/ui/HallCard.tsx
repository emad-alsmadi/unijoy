'use client';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './button';
import { HallType } from '@/types';
import { memo } from 'react';

interface HallCardProps {
  hall: HallType;
  isAdmin?: boolean;
  onEdit?: (hall: HallType) => void;
  onDelete?: (hall: HallType) => void;
}

const HallCard = ({
  hall,
  isAdmin = false,
  onEdit,
  onDelete,
}: HallCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className='group'
    >
      <Card className='rounded-2xl overflow-hidden border border-purple-200 shadow-md hover:shadow-purple-300 transition-shadow duration-300 bg-white/80 backdrop-blur'>
        {/* Media */}
        <div className='relative aspect-[16/9] overflow-hidden'>
          <motion.img
            src={'/bg-home.png'}
            alt={hall.name}
            className='w-full h-full object-cover'
            initial={false}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none' />
          <div className='absolute bottom-3 left-3 right-3 flex items-center justify-between'>
            <div className='text-white drop-shadow flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span className='text-xs'>{hall.capacity} seats</span>
            </div>
            <div className='text-white drop-shadow flex items-center gap-2'>
              <MapPin className='w-4 h-4' />
              <span className='text-xs'>{hall.location}</span>
            </div>
          </div>
          <span
            className={`absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full ${
              hall.status === 'available'
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            {hall.status}
          </span>
        </div>

        {/* Content */}
        <CardContent className='p-5 space-y-3'>
          <div className='flex items-start justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
              <Building2 className='text-purple-500' size={18} />
              {hall.name}
            </h3>
          </div>

          {isAdmin && (
            <>
              <div className='text-xs text-purple-600 mt-4'>
                Created at: {hall?.createdAt ? new Date(hall.createdAt).toLocaleString() : '-'} <br />
                Updated at: {hall?.updatedAt ? new Date(hall.updatedAt).toLocaleString() : '-'}
              </div>
              <div className='flex justify-end gap-3 pt-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onEdit?.(hall)}
                  className='border-purple-300 hover:bg-purple-100 text-purple-700'
                >
                  Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => onDelete?.(hall)}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(HallCard);
