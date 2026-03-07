'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  Image as ImageIcon,
  MapPin,
  Users,
  Tag,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

import { HallType, HostCategory } from '@/types';
import { useRouter } from 'next/navigation';
import { fetchCategories } from '@/lib/api/hostCategories';
import { fetchHalls } from '@/lib/api/halls';
import { Loading } from '@/components/ui/Loading';
import { API_BASE_URL } from '@/lib/api/base';

export const eventSchema = z.object({
  title: z.string().min(5, 'Title must contain at minimum 5 characters'),
  description: z
    .string()
    .min(10, 'Description must contain at minimum 10 characters'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  date: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  price: z.number().optional(),
  location: z.string().min(3, 'Location is required'),
  category: z.string().min(1, 'Non Empty'),

  hall: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  image: z.instanceof(File),
});

const CreateEventPage = () => {
  const { toast } = useToast();
  const { token, userRole } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<HostCategory[]>();

  const [halls, setHalls] = useState<HallType[]>([]);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      hall: '',
      time: '',
      date: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
    },
  });

  const { isSubmitting } = form.formState;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      form.setValue('image', acceptedFiles[0]);
    },
  });
  const rootProps = getRootProps();

  useEffect(() => {
    fetchHalls(setLoading, toast).then((data) => {
      console.log('data.halls', data.halls);
      if (data && Array.isArray(data.halls)) setHalls(data.halls);
      else setHalls([]);
    });
    fetchCategories(setLoading, toast).then((data) => {
      console.log('data.categories', data.categories);
      if (data && Array.isArray(data.categories))
        setCategories(data.categories);
      else setCategories([]);
    });
  }, []);

  console.log('data.halls from  create.tsx', halls);

  useEffect(() => {
    console.log('Form errors:', form.formState.errors);
  }, [form.formState.errors]);

  // helper to build FormData cleanly
  const buildFormData = (values: z.infer<typeof eventSchema>) => {
    const fd = new FormData();
    fd.append('title', values.title);
    fd.append('description', values.description);
    fd.append('date', values.date?.toISOString());
    fd.append('startDate', values.startDate?.toISOString());
    fd.append('endDate', values.endDate?.toISOString());
    fd.append('location', values.location);
    fd.append('hall', values.hall ? String(values.hall) : '');
    fd.append('capacity', String(values.capacity));
    fd.append('time', values.time);
    fd.append('category', values.category || '');
    fd.append('price', String(values.price ?? 0));
    if (values.image instanceof File) {
      fd.append('image', values.image);
    }
    return fd;
  };

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    console.log('form values', values);
    try {
      setLoading(true);
      const formData = buildFormData(values);
      const response = await fetch(`${API_BASE_URL}/host/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(' valuses', values);
      console.log(' Response Status', response.status);

      const data = await response.json();
      console.log('response data', data);

      router.push(`/${userRole}/events`);

      if (!response.ok) {
        throw new Error(data.message);
      }
      toast({
        title: 'Success',
        description: data.message || 'Event created success',
        className: 'bg-green-500 text-white',
      });
      console.log('host values', values);
    } catch (err: any) {
      toast({
        title: 'Fetch Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E0E7FF] to-white relative overflow-hidden p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="pointer-events-none absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat"
      />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='mx-auto max-w-6xl'
        >
          <div className='text-center mb-6'>
            <div className='inline-flex p-4 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] rounded-full mb-4'>
              <CalendarIcon className='h-8 w-8 text-white' />
            </div>
            <h1 className='text-3xl font-bold text-[#4F46E5] mb-1'>
              Create New Event
            </h1>
            <p className='text-slate-600'>
              Fill in the details to organize your amazing event
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <motion.div
              whileHover={{ scale: 1.002 }}
              className='lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden'
            >
              <div className='p-6'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    {/* Title & Description */}
                    <div className='grid md:grid-cols-2 gap-6'>
                      {['title', 'description'].map((field, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <FormField
                            control={form.control}
                            name={field as keyof typeof form.watch}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormLabel className='text-slate-800'>
                                  {field === 'title'
                                    ? 'Event Title'
                                    : 'Description'}
                                </FormLabel>
                                <FormControl>
                                  {field === 'title' ? (
                                    <Input
                                      placeholder='Enter event title'
                                      {...formField}
                                      className='rounded-xl border-slate-200 text-slate-900 placeholder-slate-400'
                                    />
                                  ) : (
                                    <Textarea
                                      placeholder='Describe your event'
                                      {...formField}
                                      className='rounded-xl border-slate-200 text-slate-900 placeholder-slate-400 min-h-[120px]'
                                    />
                                  )}
                                </FormControl>
                                <FormMessage className='text-red-500' />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      ))}
                    </div>
                    {/* Dates Section */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className='grid md:grid-cols-3 gap-6'
                    >
                      {['startDate', 'endDate'].map((dateField, index) => {
                        const isStart = dateField === 'startDate';
                        const open = isStart ? openStartDate : openEndDate;
                        const setOpen = isStart
                          ? setOpenStartDate
                          : setOpenEndDate;

                        return (
                          <FormField
                            key={index}
                            control={form.control}
                            name={dateField as 'startDate' | 'endDate'}
                            render={({ field }) => (
                              <FormItem className='flex flex-col'>
                                <FormLabel className='text-slate-900'>
                                  {isStart ? 'Start Date' : 'End Date'}
                                </FormLabel>
                                <Popover
                                  open={open}
                                  onOpenChange={setOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <motion.div whileHover={{ scale: 1.01 }}>
                                        <div
                                          tabIndex={0}
                                          className={cn(
                                            'pl-3 text-left font-normal bg-white border border-slate-200 hover:bg-slate-50 rounded-md py-2 px-4 cursor-pointer flex items-center gap-2 text-slate-800',
                                            !field.value && 'text-slate-500',
                                          )}
                                          onClick={() => setOpen(true)}
                                        >
                                          {field.value ? (
                                            format(field.value, 'PPP')
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className='ml-auto h-4 w-4 text-slate-400' />
                                        </div>
                                      </motion.div>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-auto p-0 bg-white border border-slate-200'>
                                    <Calendar
                                      mode='single'
                                      selected={field.value}
                                      onSelect={(val) => {
                                        field.onChange(val);
                                        setOpen(false);
                                      }}
                                      initialFocus
                                      className='bg-white'
                                      classNames={{
                                        day_selected:
                                          'bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white',
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage className='text-red-500' />
                              </FormItem>
                            )}
                          />
                        );
                      })}
                      <motion.div>
                        <FormField
                          control={form.control}
                          name='time'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-slate-900'>
                                Time
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type='time'
                                  {...field}
                                  onChange={(e) => {
                                    // الحصول على القيمة بشكل صحيح
                                    const timeValue = e.target.value;
                                    field.onChange(timeValue);
                                  }}
                                  className='rounded-xl border-slate-200 text-slate-900 placeholder-slate-400'
                                />
                              </FormControl>
                              <FormMessage className='text-red-500' />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </motion.div>
                    {/* Location & Capacity */}
                    <div className='grid md:grid-cols-3 gap-6'>
                      {['location', 'capacity'].map((fieldName, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={fieldName as 'location' | 'capacity'}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-slate-800'>
                                {fieldName === 'location'
                                  ? 'Location'
                                  : 'Capacity'}
                              </FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <Input
                                    type={
                                      fieldName === 'capacity'
                                        ? 'number'
                                        : 'text'
                                    }
                                    placeholder={
                                      fieldName === 'location'
                                        ? 'Enter event location'
                                        : 'Enter max attendees'
                                    }
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                      if (fieldName === 'capacity') {
                                        // تحويل القيمة لرقم لحقل capacity فقط
                                        const value = e.target.value;
                                        field.onChange(
                                          value === '' ? '' : Number(value),
                                        );
                                      } else {
                                        // ترك القيمة كما هي للحقول الأخرى
                                        field.onChange(e.target.value);
                                      }
                                    }}
                                    className='rounded-xl border-slate-200 text-slate-900 placeholder-slate-400 pl-10'
                                  />
                                  {fieldName === 'location' ? (
                                    <MapPin className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                                  ) : (
                                    <Users className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className='text-red-500' />
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={form.control}
                        name='date'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='text-slate-900'>
                              Event Date
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className={cn(
                                      'pl-3 text-left font-normal bg-white border border-slate-200 hover:bg-slate-50 rounded-md py-2 px-4 text-slate-800',
                                      !field.value && 'text-slate-500',
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 text-slate-400' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0 bg-white border border-slate-200'>
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className='bg-white'
                                  classNames={{
                                    day_selected:
                                      'bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white',
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-red-500' />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Hall & Time */}
                    <div className='grid md:grid-cols-3 gap-6'>
                      {/* category*/}
                      <motion.div>
                        <FormField
                          control={form.control}
                          name='category'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-slate-900 font-medium'>
                                Category Type
                              </FormLabel>

                              <Select
                                onValueChange={(value) =>
                                  form.setValue('category', value)
                                }
                              >
                                <SelectTrigger className=''>
                                  <SelectValue placeholder='Select Category' />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories?.map(
                                    (categorie: HostCategory) => (
                                      <SelectItem
                                        {...field}
                                        key={categorie._id}
                                        value={categorie._id || ''}
                                      >
                                        {categorie.name}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      {/* hall*/}
                      <motion.div>
                        <FormField
                          control={form.control}
                          name='hall'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-slate-900 font-medium'>
                                Hall Type
                              </FormLabel>

                              <Select
                                onValueChange={(value) =>
                                  form.setValue('hall', value)
                                }
                              >
                                <SelectTrigger className=''>
                                  <SelectValue placeholder='Select Hall' />
                                </SelectTrigger>
                                <SelectContent>
                                  {halls?.map((hall: HallType) => (
                                    <SelectItem
                                      {...field}
                                      key={hall._id}
                                      value={hall._id || ''}
                                    >
                                      {hall.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className='text-red-500' />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      {/* Price */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        <FormField
                          control={form.control}
                          name='price'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-slate-800'>
                                Ticket Price (Optional)
                              </FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <Input
                                    type='number'
                                    placeholder='Enter ticket price'
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                    className='rounded-xl border-slate-200 text-slate-900 placeholder-slate-400 pl-10'
                                  />
                                  <Tag className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                                </div>
                              </FormControl>
                              <FormMessage className='text-red-500' />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                    {/* Event Image */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormLabel className='text-slate-800'>
                        Event Image
                      </FormLabel>
                      <div {...rootProps}>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                            isDragActive
                              ? 'border-[#6C63FF] bg-[#E0E7FF]/40'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <ImageIcon
                            className={`mx-auto h-12 w-12 mb-4 ${
                              isDragActive ? 'text-[#6C63FF]' : 'text-slate-400'
                            }`}
                          />
                          <p
                            className={`${
                              isDragActive ? 'text-[#4F46E5]' : 'text-slate-600'
                            }`}
                          >
                            {isDragActive
                              ? 'Drop the image here'
                              : 'Drag & drop an image or click to select'}
                          </p>
                          <p className='text-sm text-slate-500 mt-2'>
                            PNG, JPG (Max 5MB)
                          </p>
                        </motion.div>
                      </div>
                      <FormMessage className='text-red-500' />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className='pt-4'
                    >
                      <Button
                        type='submit'
                        disabled={isSubmitting || loading}
                        className='w-full py-3 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2'
                      >
                        {isSubmitting || loading ? (
                          <>
                            <span className='h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin' />
                            <span>Creating...</span>
                          </>
                        ) : (
                          <span>Create Event</span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </div>
            </motion.div>

            <motion.div className='lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6'>
              <h2 className='text-sm font-semibold uppercase tracking-wide text-[#4F46E5] mb-3'>
                Live Preview
              </h2>
              <div className='rounded-xl bg-white border border-slate-200 p-4'>
                <p className='text-xs text-slate-500'>Title</p>
                <p className='text-base font-semibold text-slate-900'>
                  {form.watch('title') || 'Event Title'}
                </p>
                <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-xs text-slate-500'>Date</p>
                    <p className='font-medium text-slate-800'>
                      {form.watch('date')
                        ? format(form.watch('date'), 'PPP')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-slate-500'>Time</p>
                    <p className='font-medium text-slate-800'>
                      {form.watch('time') || '-'}
                    </p>
                  </div>
                </div>
                <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-xs text-slate-500'>Location</p>
                    <p className='font-medium text-slate-800'>
                      {form.watch('location') || '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-slate-500'>Capacity</p>
                    <p className='font-medium text-slate-800'>
                      {form.watch('capacity') || '-'}
                    </p>
                  </div>
                </div>
                <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-xs text-slate-500'>Category</p>
                    <p className='font-medium text-slate-800'>
                      {form.watch('category') || '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-slate-500'>Hall</p>
                    <p className='font-medium text-slate-800'>
                      {form.watch('hall') || '-'}
                    </p>
                  </div>
                </div>
                <div className='mt-3'>
                  <p className='text-xs text-slate-500'>Price</p>
                  <p className='font-medium text-slate-800'>
                    {form.watch('price') ?? 0}
                  </p>
                </div>
                <div className='mt-3'>
                  <p className='text-xs text-slate-500'>Description</p>
                  <p className='text-slate-700 text-sm leading-relaxed line-clamp-5'>
                    {form.watch('description') || '—'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CreateEventPage;
