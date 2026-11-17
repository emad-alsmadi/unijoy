import { z } from 'zod';

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
  image: z.union([z.instanceof(File), z.string().url().optional()]).optional(),
});

// For updates where image might be optional
export const eventUpdateSchema = eventSchema.partial();
