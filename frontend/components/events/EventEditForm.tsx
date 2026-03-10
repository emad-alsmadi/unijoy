'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { EventCategory, HallType, HostCategory } from '@/types';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, MapPin, Tag, Type as TitleIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { fetchCategories } from '@/lib/api/hostCategories';
import { fetchHalls } from '@/lib/api/halls';
import { eventUpdateSchema } from '@/lib/validation/eventSchema';
import { updateEvent, updateEventMultipart } from '@/lib/api/events';
import { ImageUploadComponent } from '@/components/ui/ImageUploadComponent';

export default function EventEditForm({
  initialEvent,
  eventId,
}: {
  initialEvent: EventCategory;
  eventId: string;
}) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<HostCategory[]>([]);
  const [halls, setHalls] = useState<HallType[]>([]);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  useEffect(() => {
    fetchCategories(setLoading, toast).then((data) =>
      setCategories(data?.categories || []),
    );
    fetchHalls(setLoading, toast).then((data) => setHalls(data?.halls || []));
  }, []);
  const category = categories.map((c: HostCategory) => {
    (initialEvent as any)?.category?._id === c._id ? String(c.name) : '';
  });

  const hall = halls.map((h: HallType) => {
    (initialEvent as any)?.hall?._id === h._id ? String(h.name) : '';
  });

  type FormValues = z.infer<typeof eventUpdateSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: {
      title: (initialEvent as any)?.title || '',
      description: (initialEvent as any)?.description || '',
      time: (initialEvent as any)?.time || '',
      date: (initialEvent as any)?.date
        ? new Date((initialEvent as any)?.date)
        : new Date(),
      startDate: (initialEvent as any)?.startDate
        ? new Date((initialEvent as any)?.startDate)
        : new Date(),
      endDate: (initialEvent as any)?.endDate
        ? new Date((initialEvent as any)?.endDate)
        : new Date(),
      price: (initialEvent as any)?.price ?? 0,
      location: (initialEvent as any)?.location || '',
      category: (initialEvent as any)?.category?._id
        ? String((initialEvent as any)?.category?._id)
        : '',
      hall: (initialEvent as any)?.hall?._id
        ? String((initialEvent as any)?.hall?._id)
        : '',
      capacity: (initialEvent as any)?.capacity ?? 1,
      image: (initialEvent as any)?.image || undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setLoading(true);
    try {
      const image = (values as any).image;
      if (image instanceof File) {
        const fd = new FormData();
        fd.append('title', values.title || '');
        fd.append('description', values.description as any);
        fd.append('date', (values as any).date?.toISOString() || '');
        fd.append('startDate', (values as any).startDate?.toISOString() || '');
        fd.append('endDate', (values as any).endDate?.toISOString() || '');
        fd.append('location', (values as any).location || '');
        fd.append('capacity', String((values as any).capacity || ''));
        fd.append('time', (values as any).time || '');
        fd.append('category', (values as any).category._id || '');
        fd.append('hall', (values as any).hall._id || '');
        fd.append('price', String((values as any).price ?? 0));
        fd.append('image', image);
        await updateEventMultipart(eventId, fd, token);
      } else {
        await updateEvent(
          eventId,
          {
            ...values,
            date: (values as any).date?.toISOString(),
            startDate: (values as any).startDate?.toISOString(),
            endDate: (values as any).endDate?.toISOString(),
          } as any,
          token,
        );
      }
      toast({
        title: 'Updated',
        description: 'Event updated successfully',
        className: 'bg-green-600 text-white border-0',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Something went wrong',
        variant: 'destructive' as any,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E0E7FF] to-white p-4 md:p-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-[#4F46E5]'>
            Edit Event
          </h1>
          <p className='text-slate-600 mt-1'>
            Update details and preview changes instantly
          </p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <motion.div
            layout
            className='lg:col-span-2 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 md:p-6'
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div>
                  <h2 className='text-sm font-semibold uppercase tracking-wide text-[#4F46E5] mb-3'>
                    Event Details
                  </h2>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-xs font-medium text-slate-700'>
                        Title
                      </label>
                      <div className='relative mt-1'>
                        <TitleIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                        <Input
                          {...form.register('title')}
                          placeholder='Event Title'
                          className='pl-9 rounded-xl border-slate-200 focus:ring-2 focus:ring-[#6C63FF]/30'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='text-xs font-medium text-slate-700'>
                        Location
                      </label>
                      <div className='relative mt-1'>
                        <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                        <Input
                          {...form.register('location')}
                          placeholder='Location'
                          className='pl-9 rounded-xl border-slate-200 focus:ring-2 focus:ring-[#6C63FF]/30'
                        />
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name={'date' as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-slate-700'>
                              Date
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className={cn(
                                      'pl-3 w-full text-left font-normal bg-white border border-slate-200 hover:bg-slate-50 rounded-md py-2 px-4 text-slate-800',
                                      !field.value && 'text-slate-500',
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value as any, 'PPP')
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
                                  selected={field.value as any}
                                  onSelect={field.onChange as any}
                                  initialFocus
                                  className='bg-white'
                                  classNames={{
                                    day_selected:
                                      'bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white',
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <label className='text-xs font-medium text-slate-700'>
                        Time
                      </label>
                      <Input
                        type='time'
                        {...form.register('time')}
                        className='rounded-xl border-slate-200'
                      />
                    </div>
                    <div>
                      <label className='text-xs font-medium text-slate-700'>
                        Price
                      </label>
                      <div className='relative mt-1'>
                        <Tag className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                        <Input
                          type='number'
                          step='1'
                          {...form.register('price', { valueAsNumber: true })}
                          className='pl-9 rounded-xl border-slate-200'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='text-xs font-medium text-slate-700'>
                        Capacity
                      </label>
                      <Input
                        type='number'
                        {...form.register('capacity', { valueAsNumber: true })}
                        className='rounded-xl border-slate-200'
                      />
                    </div>
                  </div>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                  <FormField
                    name={'startDate' as any}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-slate-700'>
                          Start Date
                        </FormLabel>
                        <Popover
                          open={openStartDate}
                          onOpenChange={setOpenStartDate}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'pl-3 w-full text-left font-normal bg-white border border-slate-200 hover:bg-slate-50 rounded-md py-2 px-4 text-slate-800',
                                  !field.value && 'text-slate-500',
                                )}
                              >
                                {field.value ? (
                                  format(field.value as any, 'PPP')
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
                              selected={field.value as any}
                              onSelect={(val) => {
                                field.onChange(val as any);
                                setOpenStartDate(false);
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={'endDate' as any}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-slate-700'>
                          End Date
                        </FormLabel>
                        <Popover
                          open={openEndDate}
                          onOpenChange={setOpenEndDate}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'pl-3 w-full text-left font-normal bg-white border border-slate-200 hover:bg-slate-50 rounded-md py-2 px-4 text-slate-800',
                                  !field.value && 'text-slate-500',
                                )}
                              >
                                {field.value ? (
                                  format(field.value as any, 'PPP')
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
                              selected={field.value as any}
                              onSelect={(val) => {
                                field.onChange(val as any);
                                setOpenEndDate(false);
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                  <FormField
                    name={'category' as any}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-slate-700'>
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a category' />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem
                                key={String(cat._id)}
                                value={String(cat._id)}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={'hall' as any}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-slate-700'>Hall</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a hall' />
                          </SelectTrigger>
                          <SelectContent>
                            {halls?.map((h) => (
                              <SelectItem
                                key={String(h._id)}
                                value={String(h._id)}
                              >
                                {h.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <h2 className='text-sm font-semibold uppercase tracking-wide text-[#4F46E5] mb-3'>
                    Description
                  </h2>
                  <Textarea
                    rows={4}
                    {...form.register('description')}
                    placeholder='Write a short event description'
                    className='rounded-xl border-slate-200 focus:ring-2 focus:ring-[#6C63FF]/30'
                  />
                </div>
                <div>
                  <FormLabel className='text-slate-700'>Event Image</FormLabel>
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
                      <CalendarIcon
                        className={`mx-auto h-10 w-10 mb-3 ${
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
                  <FormMessage />
                </div>
                <div className='pt-2'>
                  <Button
                    disabled={loading || isSubmitting}
                    className='w-full rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] hover:opacity-95'
                  >
                    {loading || isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
          <motion.div
            layout
            className='lg:col-span-1 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 md:p-6'
          >
            <h2 className='text-sm font-semibold uppercase tracking-wide text-[#4F46E5] mb-3'>
              Live Preview
            </h2>
            <div className='rounded-xl bg-white/70 border border-white/50 p-4'>
              <p className='text-xs text-slate-500'>Title</p>
              <p className='text-base font-semibold text-slate-900'>
                {(form.watch('title') as any) || 'Event Title'}
              </p>
              <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <p className='text-xs text-slate-500'>Date</p>
                  <p className='font-medium text-slate-800'>
                    {(() => {
                      const d = form.watch('date') as any;
                      if (!d) return '-';
                      return typeof d === 'string' ? d : format(d, 'PPP');
                    })()}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-slate-500'>Time</p>
                  <p className='font-medium text-slate-800'>
                    {(form.watch('time') as any) || '-'}
                  </p>
                </div>
              </div>
              <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <p className='text-xs text-slate-500'>Location</p>
                  <p className='font-medium text-slate-800'>
                    {(form.watch('location') as any) || '-'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-slate-500'>Capacity</p>
                  <p className='font-medium text-slate-800'>
                    {(form.watch('capacity') as any) || '-'}
                  </p>
                </div>
              </div>

              <div className='mt-5'>
                <p className='text-xs text-slate-500'>Category</p>
                <p className='font-medium text-slate-800'>
                  {(form.watch('category') as any) || '-'}
                </p>
              </div>
              <div className='mt-5'>
                <p className='text-xs text-slate-500'>Hall</p>
                <p className='font-medium text-slate-800'>
                  {(form.watch('hall') as any) || '-'}
                </p>
              </div>
              <div className='mt-3'>
                <p className='text-xs text-slate-500'>Price</p>
                <p className='font-medium text-slate-800'>
                  {(form.watch('price') as any) ?? 0}
                </p>
              </div>
              <div className='mt-3'>
                <p className='text-xs text-slate-500'>Description</p>
                <p className='text-slate-700 text-sm leading-relaxed line-clamp-5'>
                  {(form.watch('description') as any) || '—'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
