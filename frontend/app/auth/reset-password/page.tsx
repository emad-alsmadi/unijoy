'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('email', typeof email);
  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message || ' Thank you for Login',
          className: 'bg-green-600 text-white border-0',
        });
      } else {
        throw Error();
      }
    } catch (error: any) {
      toast({
        title: 'Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 px-4 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl'
      >
        <h1 className='text-2xl font-bold mb-2 text-center text-white'>Reset your password</h1>
        <p className='text-center text-white/80 mb-6'>We'll send a reset link to your email</p>
        <Input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-4 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
        />
        <motion.button
          onClick={handleReset}
          disabled={loading || !email}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60'
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </motion.button>
      </motion.div>
    </div>
  );
}
