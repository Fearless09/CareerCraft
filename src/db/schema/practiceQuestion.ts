import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("practice_question_category", [
  "General",
  "Behavioral",
  "Situational",
  "Strengths & Weaknesses",
  "Remote Work",
]);

export const practiceQuestionCategory = categoryEnum.enumValues;

export const practiceQuestion = pgTable("practice_question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  category: categoryEnum("category").notNull(),
  question: text("question").notNull(),
  tip: text("tip").notNull(),
  modelAnswer: jsonb("model_answer").notNull().$type<ModelAnswer>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PracticeQuestion = typeof practiceQuestion.$inferSelect;
export type PracticeQuestionInsert = Omit<
  typeof practiceQuestion.$inferInsert,
  "id" | "createdAt"
>; 

export interface ModelAnswer {
  overview: string;
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
  generalAnswer?: string; // For non-behavioral prompts
}
