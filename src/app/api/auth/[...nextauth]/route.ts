import NextAuth, { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Database, db } from "@/db";
import { admin } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  // Use Drizzle ORM to store users, accounts, sessions, and verification tokens
  adapter: DrizzleAdapter(db.$primary as Database),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.id) {
        try {
          const adminRecord = await db.query.admin.findFirst({
            where: eq(admin.userId, token.id as string),
          });
          token.isAdmin = !!adminRecord;
          token.isSuperAdmin = adminRecord?.isSuperAdmin;
        } catch (err) {
          token.isAdmin = false;
          token.isSuperAdmin = false;
        }
      } else {
        token.isAdmin = false;
        token.isSuperAdmin = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
      }
      return session;
    },
  },

  // NextAuth secret for encrypting cookies and sessions
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
