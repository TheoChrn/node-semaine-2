ALTER TABLE "comments" RENAME COLUMN "feature_id" TO "feature";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_feature_id_features_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_feature_features_id_fk" FOREIGN KEY ("feature") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;