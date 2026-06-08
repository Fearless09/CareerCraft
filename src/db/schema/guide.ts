import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const resourceTypeEnum = pgEnum("resource_type", [
  "Resume",
  "Interview",
]);

export const guide = pgTable("guide", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: resourceTypeEnum("type").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  bullets: jsonb("bullets").$type<string[]>(),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GuideInsert = Omit<typeof guide.$inferInsert, "id" | "createdAt">;
export type Guide = typeof guide.$inferSelect;
