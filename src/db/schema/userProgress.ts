import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from ".";

export const userProgress = pgTable("user_progress", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull().$type<UserProgress>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type UserProgressSelect = typeof userProgress.$inferSelect;

export interface UserProgress {
  resumeCompletedSections: string[]; // e.g. ["personalInfo", "summary", "experience", "education", "skills"]
  practiceQuestionsAnswered: string[]; // Question IDs practiced
  bookmarkedQuestions: string[]; // Bookmarked Question IDs
  blogArticlesRead: string[]; // Blog article slugs read
  lastVisited: string; // ISO string
}
