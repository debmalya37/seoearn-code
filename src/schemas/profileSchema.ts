import * as z from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  phoneNumber: z.string().min(1),
  gender: z.string().min(1),
  age: z.string().min(1),
  paymentPreference: z.string().min(1),
  paymentGateway: z.string().min(1),
  profilePicture: z.string().optional(),
  country: z.string()
});
