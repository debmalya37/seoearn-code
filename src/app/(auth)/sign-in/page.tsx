"use client";

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button  className="bg-orange-500 px-3 py-1 mx-4 rounded" onClick={() => signIn()}>Sign in</button>
    </>
  )
}





// "use client"
// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';

// const Signin = () => {
//   // const router = useRouter();
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const onSubmit = async (data:any) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/api/next-auth/auth/signin', data);
//       if (response.status === 200) {
//         // router.push('/dashboard');
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
//     } catch (error:any) {
//       setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Sign in</h1>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label>Email/Phone:</label>
//           <input className='bg-blue-300' type="text" {...register('identifier', { required: true })} />
//           {errors.identifier && <span>Email or phone number is required</span>}
//         </div>
//         <div>
//           <label>Password:</label>
//           <input className='bg-purple-300' type="password" {...register('password', { required: true })} />
//           {errors.password && <span>Password is required</span>}
//         </div>
//         {error && <div>{error}</div>}
//         <button type="submit" disabled={loading}>Sign in</button>
//       </form>
//     </div>
//   );
// };

// export default Signin;
