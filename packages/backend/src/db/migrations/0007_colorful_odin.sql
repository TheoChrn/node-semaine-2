ALTER TABLE "votes" DROP CONSTRAINT "votes_id_user_id_feature_id_unique";--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_feature_id_unique" UNIQUE("user_id","feature_id");