'use client';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
<<<<<<< HEAD
=======
import Image from 'next/image';
import bgImage from '@/public/bg-login.png';
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
<<<<<<< HEAD
import { Loading } from '@/components/ui/Loading';
import { apiLogin } from '@/lib/api/api';

export const formSchema = z.object({
=======

const formSchema = z.object({
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
<<<<<<< HEAD
  const { token, login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
=======
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth(); // استخدام دالة login من سياق المصادقة
  const [isHovered, setIsHovered] = useState(false);

>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
<<<<<<< HEAD
    try {
      await apiLogin(values, {
        token,
        login: (role: string, t: string, userId: string) =>
          login(role as 'user' | 'host' | 'admin', t, userId),
        toast,
        push: router.push,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  if (form.formState.isSubmitting) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 px-4 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl'
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className='text-3xl font-bold text-center text-white mb-2'>
            Welcome back
          </h1>
          <p className='text-center text-white/80 mb-8'>
            Sign in to continue exploring events
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white/90'>Email</FormLabel>
                    <FormControl>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className='relative'
                      >
                        <Mail className='absolute right-3 top-1/2 -translate-y-1/2 text-white/60' />
                        <Input
                          placeholder='your@email.com'
                          className='w-full rounded-xl p-3 pr-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
                          {...field}
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage className='text-rose-200' />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white/90'>Password</FormLabel>
                    <FormControl>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className='relative'
                      >
                        <Lock className='absolute right-3 top-1/2 -translate-y-1/2 text-white/60' />
                        <Input
                          type='password'
                          placeholder='••••••••'
                          className='w-full rounded-xl p-3 pr-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
                          {...field}
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage className='text-rose-200' />
                  </FormItem>
                )}
              />

              <motion.button
                type='submit'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all ${
                  form.formState.isSubmitting ? 'opacity-80' : 'hover:shadow-lg'
                }`}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className='flex items-center justify-center'>
                    <Loader2 className='animate-spin mr-2' />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          </Form>

          <div className='mt-6 text-center space-y-3'>
            <motion.p
              whileHover={{ scale: 1.01 }}
              className='text-sm text-white/80'
            >
              Forgot your password?{' '}
              <Link
                href='/auth/reset-password'
                className='text-white font-medium underline underline-offset-4'
              >
                Reset it here
              </Link>
            </motion.p>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Link
                href='signup/user'
                className='text-white/90 text-sm'
              >
                Don't have an account?{' '}
                <span className='font-semibold text-white'>Register now</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
=======
    console.log(values);
    try {
      const response = await fetch(`http://localhost:8080/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Login Successful',
          description: data.message || " Thank you for Login",
          className: 'bg-green-600 text-white border-0',
        });
        // Call the login function to update the context
        login(data.role, data.token, data.userId);
        //Direction according to the role
        setTimeout(() => {
          if (data.role === 'user') {
            router.push('/user/dashboard');
          } else if (data.role === 'host') {
            router.push('/host/dashboard');
          } else {
            router.push('/');
          }
        }, 500);
      } else {
        throw Error();
      }
    } catch (error : any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (form.formState.isSubmitting) {
    return (
      <div className='flex items-center justify-center h-[70vh]'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500'></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='flex justify-center items-center min-h-screen px-4'
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-6xl h-[600px]'
      >
        {/* Left Side - Form */}
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
          className='w-full md:w-1/2 p-10 flex flex-col justify-center'
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className='text-3xl font-bold text-center text-purple-600 mb-8'>
              Welcome Back
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className='relative'
                        >
                          <Mail className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400' />
                          <Input
                            placeholder='your@email.com'
                            className='w-full rounded-lg p-3 pr-10 border-2 border-purple-100 focus:border-purple-500 transition-all'
                            {...field}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className='relative'
                        >
                          <Lock className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400' />
                          <Input
                            type='password'
                            placeholder='••••••••'
                            className='w-full rounded-lg p-3 pr-10 border-2 border-purple-100 focus:border-purple-500 transition-all'
                            {...field}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.button
                  type='submit'
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg transition-all ${
                    form.formState.isSubmitting
                      ? 'opacity-80'
                      : 'hover:shadow-lg'
                  }`}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className='flex items-center justify-center'>
                      <Loader2 className='animate-spin mr-2' />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>
            </Form>

            <div className='mt-6 text-center space-y-3'>
              <motion.div whileHover={{ scale: 1.05 }}>
                <p className='text-sm text-gray-400 mt-4 text-center'>
                  Forgot your password?{' '}
                  <Link
                    href='/auth/reset-password'
                    className='text-purple-400 hover:underline hover:text-purple-500 transition'
                  >
                    Reset it here
                  </Link>
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href='signup/user'
                  className='text-gray-600 hover:text-purple-600 transition-colors text-sm'
                >
                  Don't have an account?{' '}
                  <span className='font-semibold'>Register now</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
          className='hidden md:block w-1/2 relative overflow-hidden'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
              opacity: isHovered ? 0.9 : 1,
            }}
            transition={{ duration: 0.5 }}
            className='absolute inset-0'
          >
            <Image
              src={bgImage}
              alt='Modern Purple Background'
              fill
              className='brightness-90 object-cover'
            />
          </motion.div>
          <motion.div
            animate={{
              opacity: isHovered ? 0.7 : 0.8,
            }}
            className='absolute inset-0 bg-gradient-to-br from-purple-900/70 to-indigo-800/70'
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='absolute inset-0 flex items-center justify-center p-10 text-white'
          >
            <div className='text-center'>
              <motion.h2
                animate={{
                  y: isHovered ? -10 : 0,
                }}
                className='text-4xl font-bold mb-4'
              >
                Welcome
              </motion.h2>
              <motion.p
                animate={{
                  y: isHovered ? 10 : 0,
                }}
                className='text-xl'
              >
                Sign in to discover exciting events
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  );
};

export default Login;
