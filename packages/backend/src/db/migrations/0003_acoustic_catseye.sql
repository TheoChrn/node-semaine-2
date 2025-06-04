ALTER TABLE "users" RENAME COLUMN "username" TO "user_name";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");