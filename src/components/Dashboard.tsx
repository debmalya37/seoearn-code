// "use client";

// import React, { useEffect, useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
// import DatePicker from 'react-date-picker';
// import 'react-date-picker/dist/DatePicker.css';
// import CountrySelect from './CountrySelect';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { date, z } from 'zod';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import { getData } from 'country-list';
// import { useParams } from 'next/navigation';

// // Schema for validation
// const userDetailsSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   username: z.string().min(2, 'Username must be at least 2 characters'),
//   phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
//   // dateOfBirth: z.date,
//   country: z.string().nonempty('Country is required'),
//   gender: z.string().nonempty('Gender is required'),
// });

// type UserDetails = z.infer<typeof userDetailsSchema>;

// const Dashboard: React.FC = () => {
//   const {data: session, update} = useSession()
//   const router = useRouter()
//   const [form, setform]= useState({})

//   const { register, control, formState: { errors } } = useForm<UserDetails>({
//     resolver: zodResolver(userDetailsSchema),
//   });
//   const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

//   const onSubmit = (data: UserDetails) => {
//     console.log('User Details:', data);
//   };
//   const getData = async () => {
//     const username = useParams()

//   }
//   useEffect(()=> {
//     getData()
//     if(!session) {
//       router.push('/sign-in')
//     }
//   }, [router, session])

//   const handleChange = (e)=> {
//     setform({...form, [e.target.name]: e.target.value})
//   }

//   // const handleSubmit = async (e)=> {
//   //   update()
//   //   let a = await updateProfile(e, session?.user.name)
//   //   alert('profile updated')
//   // }


//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8 space-y-6">
//         <h2 className="text-2xl font-bold text-gray-800 text-center">User Dashboard</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Name
//                 <div className="relative mt-1">
//                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     {...register('name')}
//                     className="block w-full pl-10 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//               </label>
//               {/* {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>} */}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//                 <div className="relative mt-1">
//                   <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="email"
//                     {...register('email')}
//                     className="block w-full pl-10 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//               </label>
//               {/* {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>} */}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Username
//                 <div className="relative mt-1">
//                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     {...register('username')}
//                     className="block w-full pl-10 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//               </label>
//               {/* {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>} */}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Phone Number
//                 <div className="relative mt-1">
//                   <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     {...register('phoneNumber')}
//                     className="block w-full pl-10 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//               </label>
//               {/* {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>} */}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Date of Birth
//               <div className="relative mt-1">
//                 <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Controller
//                   control={control}
//                   name="dateOfBirth"
//                   render={({ field }) => (
//                     // <DatePicker
//                     //   {...field}
//                     //   onChange={setDateOfBirth}
//                     //   value={dateOfBirth}
//                     //   className="block w-full pl-10 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                     // />
//                   )}
//                 />
//               </div>
//             </label>
//             {/* {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>} */}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Country
//               <Controller
//                 control={control}
//                 name="country"
//                 render={({ field }) => (
//                   <CountrySelect
//                     value={field.value}
//                     onChange={field.onChange}
//                   />
//                 )}
//               />
//             </label>
//             {/* {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>} */}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Gender
//               <div className="relative mt-1">
//                 <select
//                   {...register('gender')}
//                   className="block w-full pl-3 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </label>
//             {/* {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>} */}
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="px-6 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               Save Details
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


