import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from ".";

export const blogCategoryEnum = pgEnum("blog_category", [
  "Resume",
  "Interview",
  "Career",
  "Job Search",
  "Negotiation",
]);
export const blogCategories = blogCategoryEnum.enumValues;

export const blog = pgTable("blog", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  category: blogCategoryEnum("category").notNull(),
  publishDate: text("publish_date").notNull(),
  readTime: text("read_time").notNull(),
  image: text("image"),
  content: text("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogInsert = Omit<
  typeof blog.$inferInsert,
  "authorId" | "id" | "createdAt"
>;

export type Blog = typeof blog.$inferSelect;

export type BlogPost = Blog & {
  author: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
};
