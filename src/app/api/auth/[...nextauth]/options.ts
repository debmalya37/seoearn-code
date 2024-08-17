import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

const SECRET_KEY = process.env.JWT_TOKEN || 'your-secret-key';

export const authOptions: NextAuthOptions = {
  providers: [
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
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();
      try {
        if (account?.provider === 'google' || account?.provider === 'github') {
          const existingUser = await UserModel.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = new UserModel({
              email: user.email,
              username: user.email?.split('@')[0],
              profilePicture: user?.image,
              isVerified: true,
              googleId: account?.provider === 'google' ? user.id : undefined,
              githubId: account?.provider === 'github' ? user.id : undefined,
              name: user.name,
              referralCode: user.email?.split('@')[0],
            });
            await newUser.save();
            console.log("New user created: ", newUser);
          } else {
            console.log('User already exists: ', existingUser);
          }
        }
        return true;
      } catch (error) {
        console.error('Error during sign-in process:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.isVerified = (user?.isVerified as boolean) || false;
        token.isAcceptingMessages = (user?.isAcceptingMessages as boolean) || false;
        token.username = user?.username || '';
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the user's profile page after sign-in
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/Profile`; // Redirect to profile page or any other desired page
    },
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-in',
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
