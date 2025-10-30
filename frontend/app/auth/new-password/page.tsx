'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { useAuth } from '@/context/AuthContext';

export default function NewPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();
=======

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
=======
  const token = searchParams.get('token');

>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return toast({
        title: 'Invalid Link',
        description: 'No token provided.',
        variant: 'destructive',
      });
    }

    setLoading(true);
    try {
<<<<<<< HEAD
      const res = await fetch(`http://localhost:8080/auth/new-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });
=======
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/new-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, token }),
        }
      );
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

      const data = await res.json();

      toast({
        title: 'Success',
        description: data.message,
        className: 'bg-green-500 text-white',
      });

      router.push('/auth/login');
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
<<<<<<< HEAD
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 px-4 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl'
      >
        <h1 className='text-2xl font-bold text-center text-white mb-2'>🔒 Set a new password</h1>
        <p className='text-center text-white/80 mb-6'>Choose a strong password to secure your account</p>
        <form onSubmit={handleSubmit} className='space-y-4'>
=======
    <section className='min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-blue-500 p-6'>
      {' '}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white shadow-xl rounded-lg w-full max-w-md p-8'
      >
        {' '}
        <h1 className='text-2xl font-bold text-center text-purple-700 mb-4'>
          {' '}
          🔒 Reset Your Password{' '}
        </h1>{' '}
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          {' '}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
          <Input
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
<<<<<<< HEAD
            className='rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
          />
          <motion.button
            type='submit'
            disabled={loading || password.length < 6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60'
          >
            {loading ? 'Submitting...' : 'Set New Password'}
          </motion.button>
        </form>
      </motion.div>
    </div>
=======
            className='focus:ring-purple-500'
          />{' '}
          <Button
            type='submit'
            disabled={loading || password.length < 6}
            className='w-full bg-purple-600 hover:bg-purple-700 text-white'
          >
            {' '}
            {loading ? 'Submitting...' : 'Set New Password'}{' '}
          </Button>{' '}
        </form>{' '}
      </motion.div>{' '}
    </section>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  );
}
