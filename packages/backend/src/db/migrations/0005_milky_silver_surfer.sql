ALTER TABLE "upvotes" RENAME COLUMN "feature_Id" TO "feature_id";--> statement-breakpoint
ALTER TABLE "upvotes" DROP CONSTRAINT "upvotes_id_user_id_feature_Id_unique";--> statement-breakpoint
ALTER TABLE "upvotes" DROP CONSTRAINT "upvotes_feature_Id_features_id_fk";
--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_id_user_id_feature_id_unique" UNIQUE("id","user_id","feature_id");