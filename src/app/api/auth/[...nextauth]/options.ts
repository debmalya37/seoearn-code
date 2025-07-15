// src/app/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_TOKEN || 'your-secret-key';

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid profile email',
          prompt: 'consent',
          access_type: 'offline',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          ratings: [], // default ratings for new users
        };
      },
    }),

    // 2. GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          ratings: [], // default ratings for new users
        };
      },
    }),

    // 3. CredentialsProvider (email + password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // If no credentials were supplied, fail
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // 1. Connect to MongoDB
        await dbConnect();

        // 2. Find user by email
        const user = await UserModel.findOne({ email: credentials.email }).exec();
        if (!user) {
          // No user means login fails
          return null;
        }

        // 3. Compare submitted password against hashed password in DB
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password || ''
        );
        if (!isValidPassword) {
          return null;
        }

        // 4. If valid, return a minimal user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.profilePicture || null,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // For OAuth (Google/Github), create or update the user in our DB.
      await dbConnect();
      if (account?.provider === 'google' || account?.provider === 'github') {
        let existingUser = await UserModel.findOne({ email: user.email }).exec();
        if (!existingUser) {
          const newUser = new UserModel({
            email: user.email,
            username: user.email?.split('@')[0],
            profilePicture: user.image,
            isVerified: true,
            name: user.name,
            referralCode: user.email?.split('@')[0],
            ratings: [], // store as an array
          });
          await newUser.save();
          existingUser = newUser;
        }
    
        const ratingsArray = existingUser.ratings || [];
    const avgRating = ratingsArray.length > 0
      ? ratingsArray.reduce((a: number, b: number) => a + b, 0) / ratingsArray.length
      : 0;

    // Attach to user for jwt()
    (user as any).ratings = ratingsArray;
    (user as any).averageRating = avgRating;
      }
    
      return true;
    },
    async jwt({ token, user, account }) {
      // If user just signed in (either OAuth or Credentials), merge in relevant fields
      if (user) {
        token.id = user.id as string;
        token.isVerified = (user as any).isVerified || false;
        token.isAcceptingMessages = (user as any).isAcceptingMessages || false;
        token.username = (user as any).username || '';
        // Pass both ratings array and average
        token.ratings = (user as any).ratings || [];
        token.averageRating = (user as any).averageRating || 0;
      }
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose our custom fields on the `session`
      if (token) {
        session.user._id = token.id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.ratings = token.ratings as number[];
    session.user.averageRating = token.averageRating as number;

        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If relative URL, keep it. Otherwise force to base.
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/Profile`;
    },
  },

  pages: {
    signIn: '/sign-in',   // your sign-in page path
    signOut: '/sign-in',
    // You can also add custom pages for error, verify-request, new-user, etc.
  },

  session: {
    strategy: 'jwt',
  },
  secret: SECRET_KEY,
};

export default authOptions;




//  DFWDF
// async signIn({ user, account, profile }) {
//   if (account?.provider === 'google' && profile) {
//     await dbConnect();
    
//     try {
//       // Check if the user already exists in the database
//       const existingUser = await UserModel.findOne({ email: profile.email });
      
//       if (!existingUser) {
//         // Create a new user if not exists
//         const newUser = new UserModel({
//           email: profile.email,
//           username: profile.email?.split('@')[0],
//           isVerified: true,
//           googleId: profile.sub,
//           name: profile.name,
//           profilePicture: profile.image,
//         });
//         await newUser.save();
//         console.log("New user created: ", newUser);
//       } else {
//         console.log('User already exists: ', existingUser);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error during sign-in process:', error);
//       return false; // Return false to prevent sign-in
//     }
//   }
//   return true;
// },
//  END





//     async jwt({ token, user, account }) {
//       if (account) {
//         token.idToken = account.id_token;
//         token.isVerified = (user?.isVerified as boolean) || false;
//         token.isAcceptingMessages = (user?.isAcceptingMessages as boolean) || false;
//         token.username = user?.username || '';
//         token.accessToken = account.access_token as string;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token.id;
//         session.user.isVerified = token.isVerified;
//         session.user.isAcceptingMessages = token.isAcceptingMessages;
//         session.user.username = token.username;
//         session.accessToken = token.accessToken;
//       }

//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       if (url.startsWith('/')) return `${baseUrl}${url}`;
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },
//   pages: {
//     signIn: '/sign-in',
//     signOut: '/'
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
