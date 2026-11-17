'use client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfileClient() {
  const { detailsProfile, userRole } = useAuth();
  const dataLink = [
    { link: '/profile/edit', title: 'Edit Profile' },
    { link: '/auth/reset-password', title: 'Reset Password' },
  ];
  if (!detailsProfile) {
    return (
      <div className='text-center py-20 text-xl text-purple-600 animate-pulse'>
        Loading profile...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 to-white p-6 flex items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-2xl'
      >
        <Card className='rounded-2xl shadow-xl border border-purple-200 hover:shadow-2xl transition-shadow'>
          <CardContent className='flex flex-col items-center text-center p-10 space-y-6'>
            <div className='w-24 h-24 flex items-center justify-center rounded-full border-4 border-purple-500 shadow-lg bg-white'>
              <User className='w-14 h-14 text-purple-600' />
            </div>
            <div>
              <h2 className='text-3xl font-bold text-gray-800'>
                {detailsProfile.name}
              </h2>
              <p className='text-gray-500 flex items-center justify-center gap-2'>
                <Mail className='w-4 h-4' /> {detailsProfile.email}
              </p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-left w-full'>
              <div className='p-4 rounded-lg bg-purple-50 shadow-sm flex items-center gap-3'>
                <Calendar className='text-purple-600 w-5 h-5' />
                <div>
                  <p className='text-sm text-gray-500'>Created At</p>
                  <p className='text-gray-700 font-medium'>
                    {new Date(detailsProfile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className='p-4 rounded-lg bg-purple-50 shadow-sm flex items-center gap-3'>
                <Shield className='text-purple-600 w-5 h-5' />
                <div>
                  <p className='text-sm text-gray-500'>Role</p>
                  <p className='text-gray-700 font-medium'>
                    {detailsProfile.role}
                  </p>
                </div>
              </div>
              {detailsProfile.hostStatus && (
                <div className='p-4 rounded-lg bg-purple-50 shadow-sm flex items-center gap-3'>
                  <Shield className='text-purple-600 w-5 h-5' />
                  {userRole === 'host' && (
                    <div>
                      <p className='text-sm text-gray-500'>Host Status</p>
                      <p
                        className={`font-medium ${
                          detailsProfile.hostStatus === 'approved'
                            ? 'text-green-600'
                            : detailsProfile.hostStatus === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {detailsProfile.hostStatus}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className='p-4 rounded-lg bg-purple-50 shadow-sm flex items-center gap-3'>
                <ListChecks className='text-purple-600 w-5 h-5' />
                <div>
                  <p className='text-sm text-gray-500'>Registered Events</p>
                  <p className='text-gray-700 font-medium'>
                    {detailsProfile.registeredEvents?.length || 0}
                  </p>
                </div>
              </div>
              <div className='p-4 rounded-lg bg-purple-50 shadow-sm flex items-center gap-3'>
                <ListChecks className='text-purple-600 w-5 h-5' />
                <div>
                  <p className='text-sm text-gray-500'>Created Events</p>
                  <p className='text-gray-700 font-medium'>
                    {detailsProfile.createdEvents?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            {detailsProfile.profileInfo && (
              <div className='w-full p-4 rounded-lg bg-purple-50 shadow-sm'>
                <p className='text-sm text-gray-500 mb-2'>Profile Info</p>
                <p className='text-gray-700 italic'>
                  {detailsProfile.profileInfo}
                </p>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='flex justify-between gap-8'
            >
              {dataLink.map((e, index) => (
                <Link
                  key={index}
                  href={`${e.link}`}
                  className='mt-6 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-lg transform hover:scale-105 transition-transform'
                >
                  {e.title}
                </Link>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
