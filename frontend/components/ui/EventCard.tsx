'use client';
<<<<<<< HEAD
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { EventCategory } from '@/types';
import {
  Calendar1,
  MapPin,
  Tag,
  User2,
  Edit3,
  Trash2,
  Download,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { ReactNode, memo } from 'react';
import { ActionMenu } from './ActionMenu';
import { API_BASE_URL } from '@/lib/api/base';
import { useAuth } from '@/context/AuthContext';

type EventCardProps = {
  event: EventCategory;
  href?: string;
  footer?: ReactNode;
  className?: string;
  'aria-label'?: string;
  // role-based actions
  role?: 'admin' | 'host' | 'user';
  actionsMode?: 'buttons' | 'menu';
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: () => void;
  onDownloadInvoice?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
};

const EventCard = ({
  event,
  href,
  footer,
  className,
  'aria-label': ariaLabel,
  role,
  actionsMode = 'buttons',
  onEdit,
  onDelete,
  onStatusChange,
  onDownloadInvoice,
  onApprove,
  onReject,
}: EventCardProps) => {
  const src = encodeURI(`${API_BASE_URL}/${event?.image?.replace(/\\/g, '/')}`);
  const detailsHref = href || `/events/${event._id}`;
  const {userRole} = useAuth();

  return (
    <article
      role='article'
      aria-labelledby={`event-${event._id}-title`}
      aria-label={ariaLabel || event.title}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-[1px] border border-purple-100/60 shadow-sm',
        className
      )}
    >
      {/* Role-based Controls */}
      {(role === 'admin' || role === 'host' || onDownloadInvoice) && (
        <div className='absolute z-20 top-2 right-2'>
          {actionsMode === 'menu' ? (
            <ActionMenu
              role={role || 'user'}
              onApprove={onApprove}
              onReject={onReject}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
              onDownloadInvoice={onDownloadInvoice}
            />
          ) : (
            <div className='flex items-center gap-1 sm:gap-2'>
              {(role === 'admin' || role === 'host') && (
                <>
                  <button
                    type='button'
                    onClick={onApprove}
                    aria-label='Approve'
                    className='inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-green-700 ring-1 ring-inset ring-green-200 shadow px-2.5 py-1'
                  >
                    <ShieldCheck className='h-4 w-4' />
                  </button>
                  <button
                    type='button'
                    onClick={onReject}
                    aria-label='Reject'
                    className='inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-red-600 ring-1 ring-inset ring-red-200 shadow px-2.5 py-1'
                  >
                    <Workflow className='h-4 w-4 rotate-180' />
                  </button>
                  <button
                    type='button'
                    onClick={onStatusChange}
                    aria-label='Change status'
                    className='inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-purple-700 ring-1 ring-inset ring-purple-200 shadow px-2.5 py-1'
                  >
                    <Workflow className='h-4 w-4' />
                  </button>
                  <button
                    type='button'
                    onClick={onEdit}
                    aria-label='Edit'
                    className='inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-purple-700 ring-1 ring-inset ring-purple-200 shadow px-2.5 py-1'
                  >
                      <Edit3 className='h-4 w-4' />
                      <Link href={`${userRole}/events/${event._id}/edit`}>
                      </Link>
                  </button>
                  <button
                    type='button'
                    onClick={onDelete}
                    aria-label='Delete'
                    className='inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-red-600 ring-1 ring-inset ring-red-200 shadow px-2.5 py-1'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </>
              )}
              <button
                type='button'
                onClick={onDownloadInvoice}
                aria-label='Download invoice'
                className='inline-flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow px-2.5 py-1'
              >
                <Download className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      )}
      {/* Image */}
      <div className='relative h-44 sm:h-52 w-full overflow-hidden'>
        <Image
          src={src}
          alt={event.title || 'Event image'}
          fill
          sizes='(max-width: 640px) 100vw, 33vw'
          className='object-cover'
          priority={false}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

        {/* Top badges */}
        <div className='absolute top-2 left-2 flex items-center gap-2'>
          {typeof event.price === 'number' ? (
            <span className='rounded-md bg-purple-600/90 px-2 py-0.5 text-xs font-semibold text-white shadow'>
              {event.price === 0 ? 'FREE' : `${event.price} UE`}
            </span>
          ) : null}
          {event.category?.name ? (
            <span className='inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-200'>
              <Tag className='h-3 w-3' /> {event.category.name}
            </span>
          ) : null}
          {event.status ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset shadow',
                event.status === 'approved' &&
                  'bg-green-600/90 text-white ring-green-300/60',
                event.status === 'pending' &&
                  'bg-amber-500/90 text-white ring-amber-300/60',
                event.status === 'rejected' &&
                  'bg-red-600/90 text-white ring-red-300/60'
              )}
            >
              {String(event.status).toUpperCase()}
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className='p-4 sm:p-5 bg-gradient-to-b from-white/90 via-white to-purple-50/40'>
        <Link
          href={detailsHref}
          aria-label={`View details for ${event.title}`}
        >
          <h3
            id={`event-${event._id}-title`}
            className='text-base sm:text-lg font-semibold tracking-tight text-purple-900 line-clamp-2 hover:underline underline-offset-4'
          >
            {event.title}
          </h3>
        </Link>
        <p className='mt-2 line-clamp-2 text-xs sm:text-sm text-gray-600'>
          {event.description}
        </p>

        <div className='mt-4 grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700'>
          <div className='inline-flex items-center gap-2'>
            <Calendar1 className='h-4 w-4 text-purple-600' />
            <span>
              {event.date
                ? event.date
                : `${event.startDate} - ${event.endDate}`}
            </span>
          </div>
          <div className='inline-flex items-center gap-2'>
            <MapPin className='h-4 w-4 text-purple-600' />
            <span className='truncate'>{event.location}</span>
          </div>
          {event.host ? (
            <div className='inline-flex items-center gap-2'>
              <User2 className='h-4 w-4 text-purple-600' />
              <span className='truncate'>{String(event.host)}</span>
            </div>
          ) : null}
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <Link
            href={detailsHref}
            className='inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400'
          >
            View Details
          </Link>
          {footer}
        </div>
      </div>
    </article>
  );
};

export default memo(EventCard);
=======
import { motion } from 'framer-motion';
import { EventCategory } from '@/types/type';
import Image from 'next/image';
import { ReactNode } from 'react';

const EventCard = ({
  event,
  children,
  className,
}: {
  event: EventCategory;
  children: ReactNode;
  className: string;
}) => {
  const baseURL = 'http://localhost:8080';
  const src = encodeURI(`${baseURL}/${event?.image?.replace(/\\/g, '/')}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow ${className}`}
    >
      <div className='w-full'>
        <Image
          src={src}
          alt={event?.title}
          className='w-full h-48 object-cover'
          width={400}
          height={300}
        />
      </div>
      {children}
    </motion.div>
  );
};
export default EventCard;
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
