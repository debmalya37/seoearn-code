import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(2, "username must be at least 2 characters")
  .max(20, "username must be no more than 20 characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'invalid email address' }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "phone number must be 10 digits")
    .transform((val) => parseInt(val, 10)),
  password: z.string().min(6, { message: "password must be at least 6 chars" }),
  gender: z.string(),
  age: z
    .string()
    .regex(/^\d+$/, "age must be a number")
    .transform((val) => parseInt(val, 10)),
    referralCode: z.string().optional(),
});
