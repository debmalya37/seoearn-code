import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(2, "username must be at least 2 characters")
  .max(20, "username must be no more than 20 characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  name: z
    .string(),
    email: z.string().email({ message: 'invalid email address' }),
    countryCode: z.string().min(1, 'Select a country code'),
    phoneNumber: z.string().min(5, 'Enter valid number'),
  password: z.string().min(6, { message: "password must be at least 6 chars" }),
  gender: z.string(),
  age: z
    .string()
    .regex(/^\d+$/, "age must be a number")
    .transform((val) => parseInt(val, 10)),
    referralCode: z.string().optional(),
});
