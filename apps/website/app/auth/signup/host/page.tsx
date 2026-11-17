'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Building2,
  Mail,
  ArrowRight,
  CircleDashed,
  Lock,
  Blocks,
  MailIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import { HostCategory } from '@/types';
import { fetchCategories } from '@/lib/api/hostCategories';
import { post } from '@/lib/api/base';

const hostSchema = z.object({
  name: z.string().min(3, 'Name must contain at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  hostCategory: z.string(),
  profileInfo: z.string().min(6, 'Name must contain at least 6 characters'),
});

const HostRegisterForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { setUserId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<HostCategory[]>([]);

  const form = useForm<z.infer<typeof hostSchema>>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: '',
      email: '',
      profileInfo: '',
    },
  });


  useEffect(() => {
    fetchCategories(setLoading).then((data) =>
      setCategories(data.categories || [])
    );
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (values: z.infer<typeof hostSchema>) => {
    setIsSubmitting(true);
    console.log('values', values);
    try {

      const data = await post<any>(`/auth/signup`, { ...values, role: 'host' });

      if (data) {
        toast({
          title: '🎉 Registration Successful!',
          description: data.message,
          className: 'bg-emerald-600 text-white border-0',
        });
        setUserId(data.userId);
        console.log('userId from sigup host');
        setTimeout(() => {
          router.push('/pending');
        }, 500);
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='flex flex-col items-center'
        >

          <CircleDashed className='h-16 w-16 text-white' />
          <p className='mt-4 text-lg font-medium text-white'>
            Loading registration form...
          </p>
        </motion.div>
      </div>
    );
  }
  return (

    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 p-4 md:p-8 flex items-center'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}

        className='max-w-2xl w-full mx-auto rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden'
      >
        <AnimatePresence mode='wait'>
          <div className='relative'>
            {/* Form container */}

            <div className='relative z-10 p-8 md:p-10'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}

                className='text-center mb-10'
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='inline-block mb-6'
                >

                  <Building2 className='mx-auto h-16 w-16 text-white p-3 bg-white/10 rounded-full' />
                </motion.div>
                <motion.h1
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 }}

                  className='text-3xl md:text-4xl font-bold text-white mb-2'
                >
                  Host Registration
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}

                  className='text-white/80 text-lg'
                >
                  For universities, companies, and certified institutions
                </motion.p>
              </motion.div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-8'
                >
                  <motion.div
                    key={`${form.watch('hostCategory')}-${Date.now()}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className='grid md:grid-cols-2 gap-6'
                  >
                    <FormField
                      control={form.control}
                      name='hostCategory'
                      render={({ field }) => (
                        <FormItem>

                          <FormLabel className='text-white/90 font-medium'>
                            Host Categories
                          </FormLabel>

                          <Select
                            onValueChange={(value) =>
                              form.setValue('hostCategory', value)
                            }
                          >

                            <SelectTrigger className='rounded-xl bg-white/10 border-white/20 text-white focus:ring-0 focus-visible:ring-4 focus-visible:ring-white/30'>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((categorie: HostCategory) => (
                                <SelectItem
                                  key={categorie._id}
                                  value={String(categorie._id)}
                                >
                                  {categorie.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>

                            <FormLabel className='text-white/90 font-medium'>
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  placeholder={
                                    form.watch('hostCategory') === 'company'
                                      ? 'Modern Tech Inc.'
                                      : 'Engineering Faculty'
                                  }
                                  {...field}

                                  className='pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
                                />
                                <Building2 className='absolute left-3 top-3.5 h-5 w-5 text-gray-200' />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='grid md:grid-cols-2 gap-6'
                  >

                    {(['email', 'password'] as const).map(
                      (fieldName, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <FormField
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-white/90 font-medium'>
                                  {fieldName}
                                </FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input
                                      placeholder={`Enter your ${fieldName}`}
                                      {...field}
                                      className='pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
                                    />
                                    {fieldName === 'email' ? (
                                      <MailIcon className='absolute left-3 top-3.5 h-5 w-5 text-gray-200' />
                                    ) : (
                                      <Blocks className='absolute left-3 top-3.5 h-5 w-5 text-gray-200' />
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name='profileInfo'
                      render={({ field }) => (
                        <FormItem>

                          <FormLabel className='text-white/90 font-medium'>
                            Profile Info
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your Information ... '
                              {...field}
                              type='text'

                              className='h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    className='pt-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      type='submit'

                      className='w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <CircleDashed className='h-5 w-5 mr-2 animate-spin' />
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <ArrowRight className='h-5 w-5 ml-2' />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    className='mt-8 border-t pt-6 text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >

                    <p className='text-sm text-white/80'>
                      By continuing, you agree to our{' '}
                      <a
                        href='#'
                        className='text-white hover:underline font-medium'
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href='#'

                        className='text-white hover:underline font-medium'
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </motion.div>
                </form>
              </Form>
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HostRegisterForm;
