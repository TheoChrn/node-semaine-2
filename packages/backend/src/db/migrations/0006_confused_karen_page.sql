ALTER TABLE "upvotes" RENAME TO "votes";--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "upvotes_id_user_id_feature_id_unique";--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "upvotes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "upvotes_feature_id_features_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_id_user_id_feature_id_unique" UNIQUE("id","user_id","feature_id");