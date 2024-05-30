// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';

// const Signup = () => {
//   const router = useRouter();
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null); // Specify the type of error state

//   const onSubmit = async (data:any) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/api/next-auth/auth/signup', data);
//       if (response.status === 201) {
//         router.push('/dashboard'); // Redirect to dashboard after successful signup
//       } else {
//         setError('Something went wrong. Please try again later.');
//       }
//     } catch (error:any) {
//       setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Signup</h1>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label>Email:</label>
//           <input type="email" {...register('email', { required: true })} />
//           {errors.email && <span>Email is required</span>}
//         </div>
//         <div>
//           <label>Username:</label>
//           <input type="text" {...register('username', { required: true })} />
//           {errors.username && <span>Username is required</span>}
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" {...register('password', { required: true })} />
//           {errors.password && <span>Password is required</span>}
//         </div>
//         <div>
//           <label>Gender:</label>
//           <select {...register('gender', { required: true })}>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           {errors.gender && <span>Gender is required</span>}
//         </div>
//         <div>
//           <label>Age:</label>
//           <input type="number" {...register('age', { required: true })} />
//           {errors.age && <span>Age is required</span>}
//         </div>
//         {error && <div>{error}</div>}
//         <button type="submit" disabled={loading}>Sign up</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;
