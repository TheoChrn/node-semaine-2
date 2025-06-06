ALTER TABLE "comments" RENAME COLUMN "feature" TO "feature_id";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_feature_features_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;