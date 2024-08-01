import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

const SECRET_KEY = process.env.JWT_TOKEN || 'your-secret-key';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          ...profile,
          id: profile.sub,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        await dbConnect();
        
        try {
          // Check if the user already exists in the database
          const existingUser = await UserModel.findOne({ email: profile.email });
          
          if (!existingUser) {
            // Create a new user if not exists
            const newUser = new UserModel({
              email: profile.email,
              username: profile.email?.split('@')[0],
              isVerified: true,
              googleId: profile.sub,
              name: profile.name,
              profilePicture: profile.image,
            });
            await newUser.save();
            console.log("New user created: ", newUser);
          } else {
            console.log('User already exists: ', existingUser);
          }

          return true;
        } catch (error) {
          console.error('Error during sign-in process:', error);
          return false; // Return false to prevent sign-in
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.isVerified = (user?.isVerified as boolean) || false;
        token.isAcceptingMessages = (user?.isAcceptingMessages as boolean) || false;
        token.username = user?.username || '';
        token.accessToken = account.access_token as string; // Explicitly typing as string
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
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};





// if (user) {
//   token._id = user._id?.toString();
//   token.isVerified = user.isVerified;
//   token.isAcceptingMessages = user.isAcceptingMessages;
//   token.username = user.username;
//   token.accessToken = user.accessToken; // Set access token from user object
// }
// return token;


    // CredentialsProvider({
    //   id: 'credentials',
    //   name: 'Credentials',
    //   credentials: {
    //     email: { label: 'Email or Username', type: 'text' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials: any) {
    //     await dbConnect();
    //     try {
    //       const user = await UserModel.findOne({
    //         $or: [
    //           { email: credentials.identifier },
    //           { username: credentials.identifier },
    //         ],
    //       });

    //       if (!user) {
    //         throw new Error('No user found with this email or username');
    //       }

    //       if (!user.isVerified) {
    //         throw new Error('Please verify your account before login');
    //       }

    //       const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
    //       if (isPasswordCorrect) {
    //         // Generate an access token for the user
    //         const accessToken = jwt.sign(
    //           {
    //             userId: user._id,
    //             username: user.username,
    //             email: user.email,
    //           },
    //           SECRET_KEY,
    //           { expiresIn: '1h' }, // Token expiration time
    //         );
    //         return { ...user.toObject(), accessToken };
    //       } else {
    //         throw new Error('Incorrect Password');
    //       }
    //     } catch (error: any) {
    //       throw new Error(error.message);
    //     }
    //   },
    // }),

// async session({session, user, token}) {
//   const dbUser = await UserModel.findOne({email: session.user.email})
//   console.log(dbUser);
//   session.user.name = dbUser.Username
//   return session

// }