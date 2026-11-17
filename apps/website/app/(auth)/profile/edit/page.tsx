'use client';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Mail, User, FileText } from 'lucide-react';
import { put } from '@/lib/api/base';

// ✅ Schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  profileInfo: z.string().max(500).optional(),
  hostCategory: z.string().optional(),
});

export default function EditProfilePage() {
  const { token, detailsProfile, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: detailsProfile?.name || '',
      email: detailsProfile?.email || '',
      profileInfo: detailsProfile?.profileInfo || '',
      hostCategory: (detailsProfile as any)?.hostCategory?.name || '',
    },
  });

  useEffect(() => {
    if (token && detailsProfile) {
      form.reset({
        name: detailsProfile?.name || '',
        email: detailsProfile?.email || '',
        profileInfo: detailsProfile?.profileInfo || '',
        hostCategory: (detailsProfile as any)?.hostCategory?.name || '',
      });
    }
  }, [detailsProfile, form, token]);
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    try {
      await put(`/profile`, values, { token });

      toast({
        title: 'Success',
        description: 'Profile updated successfully ✅',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong ❌',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-purple-100 p-6 flex items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-lg bg-white rounded-2xl shadow-xl border border-purple-200 p-8'
      >
        <h2 className='text-2xl font-bold text-center text-purple-700 mb-6'>
          Edit Profile
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className='relative'
                    >
                      <User className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400' />
                      <Input
                        placeholder='Enter your name'
                        className='w-full rounded-lg p-3 pr-10 border-2 border-purple-100 focus:border-purple-500 transition-all'
                        {...field}
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
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

            {/* Host Extra Fields */}
            {userRole === 'host' && (
              <>
                {/* Profile Info */}
                <FormField
                  control={form.control}
                  name='profileInfo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Info</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className='relative'
                        >
                          <FileText className='absolute right-3 top-3 text-purple-400' />
                          <textarea
                            placeholder='Tell us more about your hosting experience...'
                            className='w-full rounded-lg p-3 pr-10 border-2 border-purple-100 focus:border-purple-500 transition-all min-h-[100px]'
                            {...field}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Host Category */}
                <FormField
                  control={form.control}
                  name='hostCategory'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter category name'
                          className='w-full rounded-lg p-3 border-2 border-purple-100 focus:border-purple-500 transition-all'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Submit */}
            <motion.button
              type='submit'
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg transition-all ${
                loading ? 'opacity-80' : 'hover:shadow-lg'
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <Loader2 className='animate-spin mr-2' />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
