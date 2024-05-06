import {z} from "zod";


export const taskSchema = z.object({
    description: z
    .string()
    .min(10, {message: "desc can't be less than 10 chars"})
    .max(5000, {message: "desc can't be more than 5000 chars"})
})
