import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(20, "username must be no more than 20 characters")
    .regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/, "username must not contain special character")



export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'invalid email address'}),
    phoneNumber: z.number().max(10, {message: "phone number can't contain more than 10 numbers"}),
    password: z.string().min(6, {message: "password must be atleast 6 chars"}),
    gender: z.string(),
    age: z.number().min(1).max(100)
})    