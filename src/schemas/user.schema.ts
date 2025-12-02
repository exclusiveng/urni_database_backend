import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    age: z.number().or(z.string().transform((val) => parseInt(val, 10))).optional(),
    location: z.string().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(1, 'Phone number is required'),
    event: z.string().optional(),
  }),
});
