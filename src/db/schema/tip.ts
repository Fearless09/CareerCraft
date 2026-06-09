import { timestamp, pgTable, text, pgEnum } from "drizzle-orm/pg-core";

export const tipTypeEnum = pgEnum("tip_type", ["do", "dont"]);
export const tipCategoryEnum = pgEnum("tip_category", [
  "ATS",
  "Formatting",
  "Wording",
  "Preparation",
  "Behavior",
  "Follow Up",
  "Negotiation",
]);
export const resourceTypeEnum = pgEnum("resource_type", [
  "Resume",
  "Interview",
]);

export const tip = pgTable("tip", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  category: tipCategoryEnum("category").notNull(),
  type: tipTypeEnum("type").notNull(),
  headline: text("headline").notNull(),
  explanation: text("explanation").notNull(),
  example: text("example"),
  resourceType: resourceTypeEnum("resource_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TipInsert = Omit<typeof tip.$inferInsert, "id" | "createdAt">;
export type Tip = typeof tip.$inferSelect;
