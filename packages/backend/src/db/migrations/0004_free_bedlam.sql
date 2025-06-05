CREATE TABLE "upvotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"user_id" uuid NOT NULL,
	"feature_Id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "upvotes_id_user_id_feature_Id_unique" UNIQUE("id","user_id","feature_Id")
);
--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_feature_Id_features_id_fk" FOREIGN KEY ("feature_Id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;