import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { SelectUser, users } from ".";

export const admin = pgTable("admin", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Admin = typeof admin.$inferSelect;
export type AdminInsert = Omit<typeof admin.$inferInsert, "id" | "createdAt">;

export type AdminUser = Admin & Omit<SelectUser, keyof Admin>;
