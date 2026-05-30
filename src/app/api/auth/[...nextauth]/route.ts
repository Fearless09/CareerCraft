import NextAuth, { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Database, db } from "@/db";

export const authOptions: AuthOptions = {
  // Use Drizzle ORM to store users, accounts, sessions, and verification tokens
  adapter: DrizzleAdapter(db.$primary as Database),

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],

  callbacks: {
    // Inject the database user's ID into the session object so the client can access it
    async session({ session, user }) {
      if (session.user) {
        (session.user as User).id = user.id;
      }
      return session;
    },
  },

  // NextAuth secret for encrypting cookies and sessions
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
