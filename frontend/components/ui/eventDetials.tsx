<<<<<<< HEAD
"use client";
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  Locate,
  Users,
  Ticket,
  Building,
  Layers,
  UserCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarCheck2,
  CheckCircle,
} from 'lucide-react';
import { EventCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth, UserRole } from '@/context/AuthContext';

=======
'use client';
import { Button } from '@/components/ui/button';
import { CalendarDays, Locate, Ticket } from 'lucide-react';
import Image from 'next/image';
import { EventCategory } from '@/types/type';
import { UserRole } from '@/context/AuthContext';
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
const EventDetails = ({
  event,
  userRole,
}: {
  event: EventCategory;
  userRole: UserRole;
<<<<<<< HEAD
}) => {
  const baseURL = 'http://localhost:8080';
  const src = encodeURI(`${baseURL}/${event?.image?.replace(/\\/g, '/')}`);

  // Booking form state
  const [fullName, setFullName] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { token } = useAuth();

  const handleBook = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8080/users/me/events/${event._id}/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Note: backend register currently doesn't require body; UI fields are for UX
        body: JSON.stringify({ name: fullName, date: bookingDate, attendees }),
      });
      const data = await res.json();
      if (res.ok) {
        if (event.price && Number(event.price) !== 0 && data?.url) {
          window.location.href = data.url;
          return;
        }
        setSuccessOpen(true);
      }
    } catch (e) {
      // swallow for now; toast handled elsewhere on pages
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Preview card on top */}
      <section className='bg-gradient-to-r from-pink-500 to-purple-700 text-white py-10 px-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='overflow-hidden rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-xl'>
            <div className='flex flex-col lg:flex-row items-stretch'>
              <div className='w-full lg:w-1/2'>
                <Image
                  src={src}
                  alt={event.title}
                  width={640}
                  height={420}
                  className='h-full w-full object-cover'
                  priority
                />
              </div>
              <div className='w-full lg:w-1/2 p-6 lg:p-8'>
                <h1 className='text-3xl font-bold mb-2'>{event.title}</h1>
                <p className='mb-6 text-sm/relaxed opacity-90 line-clamp-3'>{event.description}</p>
                <ul className='space-y-3 text-sm'>
                  <li className='flex items-center'>
                    <Locate className='w-4 h-4 mr-2' />
                    <span>{event.location}</span>
                  </li>
                  <li className='flex items-center'>
                    <CalendarDays className='w-4 h-4 mr-2' />
                    <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                  </li>
                  <li className='flex items-center'>
                    <Ticket className='w-4 h-4 mr-2' />
                    <span>{event.price === 0 ? 'FREE' : `${event.price} UE`}</span>
                  </li>
                  <li className='flex items-center'>
                    <Users className='w-4 h-4 mr-2' />
                    <span>Capacity: {event.capacity}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form below */}
      <section className='px-6 py-10'>
        <div className='max-w-3xl mx-auto'>
          {userRole === 'user' && (
            <div className='bg-white rounded-2xl border border-purple-100 shadow-sm p-6 md:p-8'>
              <h2 className='text-xl font-semibold text-purple-800'>Complete your booking</h2>
              <p className='text-sm text-gray-600 mt-1'>We will use this to reserve your spot.</p>

              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
                <motion.div initial={false} animate={{ scale: fullName ? 1.01 : 1, boxShadow: fullName ? '0 0 0 3px rgba(147,51,234,0.15)' : '0 0 0 0 rgba(0,0,0,0)' }} className='rounded-xl border border-gray-200 p-4 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-200 transition-all'>
                  <Label htmlFor='fullName'>Full name</Label>
                  <Input id='fullName' placeholder='Your name' value={fullName} onChange={(e) => setFullName(e.target.value)} className='mt-2' />
                </motion.div>

                <motion.div initial={false} animate={{ scale: bookingDate ? 1.01 : 1, boxShadow: bookingDate ? '0 0 0 3px rgba(147,51,234,0.15)' : '0 0 0 0 rgba(0,0,0,0)' }} className='rounded-xl border border-gray-200 p-4 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-200 transition-all'>
                  <Label htmlFor='date'>Preferred date</Label>
                  <Input id='date' type='date' value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className='mt-2' />
                </motion.div>

                <motion.div initial={false} animate={{ scale: attendees > 1 ? 1.01 : 1, boxShadow: attendees > 1 ? '0 0 0 3px rgba(147,51,234,0.15)' : '0 0 0 0 rgba(0,0,0,0)' }} className='rounded-xl border border-gray-200 p-4 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-200 transition-all md:col-span-2'>
                  <Label htmlFor='attendees'>Attendees</Label>
                  <div className='mt-2 flex items-center gap-3'>
                    <Input id='attendees' type='number' min={1} value={attendees} onChange={(e) => setAttendees(Math.max(1, Number(e.target.value || 1)))} className='w-32' />
                    <AnimatePresence>
                      {attendees > 0 && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className='inline-flex items-center gap-1 text-sm text-green-700'>
                          <CheckCircle className='w-4 h-4' />
                          Looks good
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <div className='mt-6 flex items-center justify-between'>
                <div className='text-sm text-gray-600'>
                  <span>By booking you agree to the terms.</span>
                </div>
                <Button onClick={handleBook} disabled={submitting || !fullName || !bookingDate} className='bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow hover:brightness-110'>
                  {submitting ? 'Booking...' : 'Book your spot'}
                </Button>
              </div>
            </div>
          )}

          {/* Additional event details for context */}
          <div className='mt-10 space-y-6'>
            <h3 className='text-lg font-semibold text-purple-700'>More Details</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm'>
              <div className='flex items-center'>
                <Building className='w-4 h-4 mr-2 text-purple-600' />
                <span>Hall: {event.hall?.name || 'Not specified'}</span>
              </div>
              <div className='flex items-center'>
                <Layers className='w-4 h-4 mr-2 text-purple-600' />
                <span>Category: {event.category?.name || 'Uncategorized'}</span>
              </div>
              <div className='flex items-center'>
                <UserCircle className='w-4 h-4 mr-2 text-purple-600' />
                <span>Host: {event.host}</span>
              </div>
              <div className='flex items-center'>
                {event.status === 'approved' && (
                  <CheckCircle2 className='w-4 h-4 mr-2 text-green-600' />
                )}
                {event.status === 'pending' && (
                  <Loader2 className='w-4 h-4 mr-2 text-yellow-500 animate-spin' />
                )}
                {event.status === 'rejected' && (
                  <XCircle className='w-4 h-4 mr-2 text-red-600' />
                )}
                <span>Status: {event.status}</span>
              </div>
              <div className='flex items-center'>
                <CalendarCheck2 className='w-4 h-4 mr-2 text-purple-600' />
                <span>Starts: {new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <div className='flex items-center'>
                <CalendarCheck2 className='w-4 h-4 mr-2 text-purple-600' />
                <span>Ends: {new Date(event.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className='text-xs text-gray-500'>
              Created at: {new Date(event.createdAt).toLocaleString()} <br />
              Updated at: {new Date(event.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </section>

      {/* Success Confirmation Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className='sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Booking Confirmed</DialogTitle>
            <DialogDescription>Your seat has been reserved. See you at the event!</DialogDescription>
          </DialogHeader>
          <div className='py-4 flex flex-col items-center justify-center'>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }} className='rounded-full bg-green-100 text-green-700 w-20 h-20 flex items-center justify-center shadow-inner'>
              <CheckCircle className='w-12 h-12' />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='mt-4 text-center text-sm text-gray-600'>
              A confirmation was sent to your account.
            </motion.div>
          </div>
          <DialogFooter>
            <Button className='bg-purple-600 text-white' onClick={() => setSuccessOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
=======
  }) => {
  const src = `/${event?.image?.replace(/\\/g, '/')}`;
  return (
    <div className='min-h-screen bg-white'>
      {/* القسم العلوي */}
      <section className='bg-gradient-to-r from-pink-500 to-purple-700 text-white py-10 px-6'>
        <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center'>
          <div className='w-full lg:w-1/2'>
            <Image
              src={`${src}`}
              alt={event.title}
              width={600}
              height={400}
              className='rounded-md'
              priority
            />
            {!event.price && (
              <span className='inline-block mt-4 bg-purple-800 text-white text-xs px-3 py-1 rounded'>
                FREE
              </span>
            )}
          </div>
          <div className='w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-12'>
            <h1 className='text-3xl font-bold mb-4'>{event.title}</h1>
            <p className='mb-4 text-sm'>{event.description}</p>
            <ul className='space-y-2 mb-6 text-sm'>
              <li className='flex items-center'>
                <Locate className='w-4 h-4 mr-2' />
                Location: {event.location}
              </li>
              <li className='flex items-center'>
                <CalendarDays className='w-4 h-4 mr-2' />
                Date: {event.date}
              </li>
              <li className='flex items-center'>
                <Ticket className='w-4 h-4 mr-2' />
                Entry:{' '}
                {!event.price ? 'Absolutely FREE for all!' : 'Paid Entry'}
              </li>
            </ul>

            {userRole === 'user' && (
              <div className='flex gap-4'>
                <Button variant='default'>Register Event</Button>
                <Button className='bg-purple-700 hover:bg-purple-800'>
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* تفاصيل الحدث */}
      <section className='px-6 py-12 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-6'>More Details</h2>
      </section>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
    </div>
  );
};

export default EventDetails;
