CREATE TYPE "public"."blog_category" AS ENUM('Resume', 'Interview', 'Career', 'Job Search', 'Negotiation');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('Resume', 'Interview');--> statement-breakpoint
CREATE TYPE "public"."practice_question_category" AS ENUM('General', 'Behavioral', 'Situational', 'Strengths & Weaknesses', 'Remote Work');--> statement-breakpoint
CREATE TYPE "public"."tip_type" AS ENUM('do', 'dont');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"category" "blog_category" NOT NULL,
	"publish_date" text NOT NULL,
	"read_time" text NOT NULL,
	"image" text,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "resource_type" NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"content" text NOT NULL,
	"bullets" jsonb,
	"cta_text" text,
	"cta_link" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_question" (
	"id" text PRIMARY KEY NOT NULL,
	"category" "practice_question_category" NOT NULL,
	"question" text NOT NULL,
	"tip" text NOT NULL,
	"model_answer" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'Untitled Resume' NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tip" (
	"id" text PRIMARY KEY NOT NULL,
	"category" "tip_category" NOT NULL,
	"type" "tip_type" NOT NULL,
	"headline" text NOT NULL,
	"explanation" text NOT NULL,
	"example" text,
	"resource_type" "resource_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;