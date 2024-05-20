import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import connectDB from '@/lib/dbConnect';
import UserModel, { User } from '@/models/userModel';

// Define a custom Session type by extending the default Session type
interface CustomSession extends Session {
  user: User; // Extend user property with the User interface
}

const options = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    PhoneProvider({
      id: 'phone',
      name: 'Phone',
      signInUrl: '/auth/signin',
    }),
  ],
  database: process.env.MONGODB_URI,
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token: any, user: User) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session: CustomSession, token: any) {
      if (token) {
        session.user = token; // Assign token to user property
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    newUser: '/auth/signup',
  },
  events: {},
  debug: false,
};

const NextAuthHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

export default NextAuthHandler;
