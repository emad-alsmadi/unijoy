'use client';
import { useToast } from '@/hooks/use-toast';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
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

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginAdmin = () => {
  const { toast } = useToast();
  const [loading, setloading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',

        body: JSON.stringify({
          email: form.getValues('email'),
          password: form.getValues('password'),
        }),
      });
      if (response.ok) {
        toast({
          title: 'Login Successful',
          description: 'You have been logged in successfully',
          duration: 3000,
          className: 'bg-green-600 text-white border-0',
        });

        window.localStorage.setItem('isLoggIn', 'true');
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Faild!',
          description: 'حدث خطأ أثناء التسجيل',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className='text-3xl font-bold text-center text-white mb-2'>
            Welcome, Admin
          </h1>
          <p className='text-center text-white/80 mb-8'>
            Sign in to manage the platform
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
                          placeholder='admin@email.com'
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
            <motion.div whileHover={{ scale: 1.01 }}>
              <Link
                href='/auth/reset-password'
                className='text-white/90 hover:underline text-sm'
              >
                Forgot password?
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default LoginAdmin;
