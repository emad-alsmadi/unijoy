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
<<<<<<< HEAD
import {
  Building2,
  Mail,
  ArrowRight,
  CircleDashed,
  Lock,
  Blocks,
  MailIcon,
} from 'lucide-react';
=======
import { Building2, Mail, ArrowRight, CircleDashed, Lock } from 'lucide-react';
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
import { HostCategory } from '@/types';
import { fetchCategories } from '@/lib/api/hostCategories';
import { post } from '@/lib/api/base';
=======
import { HostCategory } from '@/types/type';
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

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
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<HostCategory[]>([]);
=======
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

  const form = useForm<z.infer<typeof hostSchema>>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: '',
      email: '',
      profileInfo: '',
    },
  });
<<<<<<< HEAD

  useEffect(() => {
    fetchCategories(setLoading).then((data) =>
      setCategories(data.categories || [])
    );
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
=======
  const fetchHostCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/host-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Fetch Host Categories Succussful',
          description: data.message,
        });
      }

      // Save categories
      // تأكد أن response يحتوي على hostCategories array
      setCategories(data.categories);
      console.log("data.categories",data.categories)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  useEffect(() => {
    fetchHostCategories();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (values: z.infer<typeof hostSchema>) => {
    setIsSubmitting(true);
    console.log('values', values);
    try {
<<<<<<< HEAD
      const data = await post<any>(`/auth/signup`, { ...values, role: 'host' });

      if (data) {
=======
      const response = await fetch(`http://localhost:8080/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, role: 'host' }),
      });

      const data = await response.json();

      if (response.ok) {
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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

<<<<<<< HEAD
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600'>
=======
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100'>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='flex flex-col items-center'
        >
<<<<<<< HEAD
          <CircleDashed className='h-16 w-16 text-white' />
          <p className='mt-4 text-lg font-medium text-white'>
=======
          <CircleDashed className='h-16 w-16 text-blue-600' />
          <p className='mt-4 text-lg font-medium text-gray-700'>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
            Loading registration form...
          </p>
        </motion.div>
      </div>
    );
  }
  return (
<<<<<<< HEAD
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 p-4 md:p-8 flex items-center'>
=======
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8'>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
<<<<<<< HEAD
        className='max-w-2xl w-full mx-auto rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden'
=======
        className='max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
      >
        <AnimatePresence mode='wait'>
          <div className='relative'>
            {/* Form container */}
<<<<<<< HEAD
            <div className='relative z-10 p-8 md:p-10'>
=======
            <div className='relative z-10 p-8 md:p-12'>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
<<<<<<< HEAD
                className='text-center mb-10'
=======
                className='text-center mb-12'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='inline-block mb-6'
                >
<<<<<<< HEAD
                  <Building2 className='mx-auto h-16 w-16 text-white p-3 bg-white/10 rounded-full' />
=======
                  <Building2 className='mx-auto h-16 w-16 text-blue-600 p-3 bg-blue-50 rounded-full' />
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                </motion.div>
                <motion.h1
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 }}
<<<<<<< HEAD
                  className='text-3xl md:text-4xl font-bold text-white mb-2'
=======
                  className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                >
                  Host Registration
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
<<<<<<< HEAD
                  className='text-white/80 text-lg'
=======
                  className='text-gray-600 text-lg'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
                          <FormLabel className='text-white/90 font-medium'>
                            Host Categories
=======
                          <FormLabel className='text-gray-700 font-medium'>
                            Host Type
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                          </FormLabel>

                          <Select
                            onValueChange={(value) =>
                              form.setValue('hostCategory', value)
                            }
                          >
<<<<<<< HEAD
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
=======
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(
                                (categorie: HostCategory) => (
                                  <SelectItem
                                    {...field}
                                    key={categorie._id}
                                    value={categorie._id}
                                  >
                                    {categorie.name}
                                  </SelectItem>
                                )
                              )}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
                            <FormLabel className='text-white/90 font-medium'>
                              Company Name
=======
                            <FormLabel className='text-gray-700 font-medium'>
                              {form.watch('hostCategory') === 'company'
                                ? 'Company Name'
                                : 'Department Name'}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
                                  className='pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
                                />
                                <Building2 className='absolute left-3 top-3.5 h-5 w-5 text-gray-200' />
=======
                                  className='pl-10 h-12'
                                />
                                <Building2 className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
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
=======
                    {['email', 'password'].map((fieldName, index) => (
                      <motion.div
                        key={fieldName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <FormField
                          control={form.control}
                          name={fieldName as keyof typeof hostSchema._type}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-white/80'>
                                {fieldName === 'email'
                                  ? 'Host Email'
                                  : 'Password'}
                              </FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <Input
                                    type={
                                      fieldName === 'password'
                                        ? 'password'
                                        : 'email'
                                    }
                                    placeholder={
                                      fieldName === 'email'
                                        ? 'student@university.edu'
                                        : '••••••••'
                                    }
                                    {...field}
                                    className='pl-10 h-12'
                                  />
                                  {fieldName === 'email' ? (
                                    <Mail className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
                                  ) : (
                                    <Lock className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    ))}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
                          <FormLabel className='text-white/90 font-medium'>
=======
                          <FormLabel className='text-gray-700 font-medium'>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                            Profile Info
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your Information ... '
                              {...field}
                              type='text'
<<<<<<< HEAD
                              className='h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus-visible:ring-4 focus-visible:ring-white/30'
=======
                              className='h-12'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
<<<<<<< HEAD
=======

                  {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700 font-medium'>
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              placeholder='1234567890'
                              {...field}
                              className='pl-10 h-12'
                            />
                            <Phone className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div> */}

                  {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700 font-medium'>
                          Main Address
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              placeholder='123 Main St, City'
                              {...field}
                              className='pl-10 h-12'
                            />
                            <MapPin className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div> */}

                  {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name='website'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700 font-medium'>
                          Website
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              placeholder='https://www.company.com'
                              {...field}
                              className='pl-10 h-12'
                            />
                            <Link className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div> */}

                  {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <FormField
                    control={form.control}
                    name='document'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700 font-medium'>
                          Authorization Document
                        </FormLabel>
                        <FormControl>
                          <div className='flex items-center gap-4'>
                            <label
                              className={cn(
                                'flex-1 cursor-pointer border-2 border-dashed rounded-lg p-4 h-24 flex flex-col items-center justify-center',
                                'hover:border-blue-400 transition-colors',
                                field.value
                                  ? 'border-blue-300 bg-blue-50'
                                  : 'border-gray-300'
                              )}
                            >
                              <FileText className='h-6 w-6 text-gray-500 mb-2' />
                              <span className='text-sm text-gray-600'>
                                {field.value?.name ||
                                  'Click to upload document'}
                              </span>
                              <input
                                type='file'
                                accept='.pdf,.docx'
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                className='hidden'
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div> */}

>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
                      className='w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl'
=======
                      className='w-full h-14 text-lg font-medium'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
<<<<<<< HEAD
                    <p className='text-sm text-white/80'>
                      By continuing, you agree to our{' '}
                      <a
                        href='#'
                        className='text-white hover:underline font-medium'
=======
                    <p className='text-sm text-gray-600'>
                      By continuing, you agree to our{' '}
                      <a
                        href='#'
                        className='text-blue-600 hover:underline font-medium'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href='#'
<<<<<<< HEAD
                        className='text-white hover:underline font-medium'
=======
                        className='text-blue-600 hover:underline font-medium'
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
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
