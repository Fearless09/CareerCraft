import { DefaultSession } from "next-auth";

// Extend the DefaultSession type to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin?: boolean;
      isSuperAdmin?: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
  }
}
