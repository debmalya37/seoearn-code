import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// Define a custom User type to include role
interface CustomUser extends User {
  role: string;
}

// Define a custom Session type to include role
interface CustomSession extends Session {
  user: CustomUser;
}

// Define a custom JWT type to include role
interface CustomJWT extends JWT {
  role: string;
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      profile(profile) {
        console.log("profile Google: ", profile);

        const userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        } as CustomUser;
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<CustomJWT> {
      if (user) {
        token.role = (user as CustomUser).role;
      }
      return token as CustomJWT;
    },
    async session({ session, token }): Promise<CustomSession> {
      if (session?.user) {
        (session.user as CustomUser).role = (token as CustomJWT).role;
      }
      return session as CustomSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

export default NextAuth(options);
