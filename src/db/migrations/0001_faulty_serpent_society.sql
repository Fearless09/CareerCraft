CREATE TYPE "public"."tip_category" AS ENUM('ATS', 'Formatting', 'Wording', 'Preparation', 'Behavior', 'Follow Up', 'Negotiation');--> statement-breakpoint
ALTER TABLE "admin" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "admin" DROP CONSTRAINT "admin_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "is_super_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;