import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

/* 
=============================================================================
   1. USER TABLE (`user`)
   -------------------------------------------------------------------------
   PURPOSE: 
   Stores the core profile information for each user who signs up or logs 
   in via CareerCraft. NextAuth queries this table to retrieve user details 
   for session objects.
=============================================================================
*/
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

/* 
=============================================================================
   2. OAUTH ACCOUNTS TABLE (`account`)
   -------------------------------------------------------------------------
   PURPOSE: 
   Links OAuth providers (like Google, GitHub, Apple) to internal user records.
   This table enables a single user to log in using different providers and
   stores provider-specific tokens (refresh tokens, access tokens, etc.).
=============================================================================
*/
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

/* 
=============================================================================
   3. SESSIONS TABLE (`session`)
   -------------------------------------------------------------------------
   PURPOSE: 
   Tracks active login sessions for database-session adapter flows.
   NextAuth uses this table to verify if a user's session is still valid
   and active during client requests.
=============================================================================
*/
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/* 
=============================================================================
   4. VERIFICATION TOKENS TABLE (`verificationToken`)
   -------------------------------------------------------------------------
   PURPOSE: 
   Used for magic link logins (passwordless sign-in via email). It stores
   temporary, high-entropy tokens mapped to the user's email address.
=============================================================================
*/
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

/* 
=============================================================================
   5. RESUME STORAGE TABLE (`resume`)
   -------------------------------------------------------------------------
   PURPOSE: 
   Stores the user's resume data in the cloud. This table supports saving 
   multiple resumes per user account.
=============================================================================
*/
export const resumes = pgTable("resume", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Untitled Resume"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const admins = pgTable("admin", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type UserProgressSelect = typeof userProgress.$inferSelect;
