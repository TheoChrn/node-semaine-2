ALTER TABLE "users" DROP CONSTRAINT "users_user_name_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "user_name";