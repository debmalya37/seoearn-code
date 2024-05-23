import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import Email from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                Email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.indentifer},
                            {username: credentials.indentifer}
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found with this email')
                    }
                    
                    if(user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    }
                    else {
                        throw new Error('Incorrect Password')
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,

            profile(profile) {
                console.log("profile Google: ", profile);
                
                return {
                    ...profile,
                    id: profile.sub,
                    
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;

            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}









//previous code for the file name [...nextauth].ts = not in use now as we have defined two files options and route





// import { NextApiRequest, NextApiResponse } from 'next';
// import { Session } from 'next-auth';
// import NextAuth from 'next-auth';
// import EmailProvider from 'next-auth/providers/email';
// import connectDB from '@/lib/dbConnect';
// import UserModel, { User } from '@/models/userModel';

// // Define a custom Session type by extending the default Session type
// interface CustomSession extends Session {
//   user: User; // Extend user property with the User interface
// }

// const options = {
//   providers: [
//     EmailProvider({
//       server: process.env.EMAIL_SERVER,
//       from: process.env.EMAIL_FROM,
//     }),
//     PhoneProvider({
//       id: 'phone',
//       name: 'Phone',
//       signInUrl: '/auth/signin',
//     }),
//   ],
//   database: process.env.MONGODB_URI,
//   session: {
//     jwt: true,
//   },
//   callbacks: {
//     async jwt(token: any, user: User) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session(session: CustomSession, token: any) {
//       if (token) {
//         session.user = token; // Assign token to user property
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//     signOut: '/auth/signout',
//     newUser: '/auth/signup',
//   },
//   events: {},
//   debug: false,
// };

// const NextAuthHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

// export default NextAuthHandler;
