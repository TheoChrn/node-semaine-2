import type { BaseFeature } from "@/db/entities/features";
import { BaseUser } from "@/db/entities/users";
import type { BaseVote } from "@/db/entities/votes";

export {};

declare global {
  interface User extends BaseUser {}
  interface Feature extends BaseFeature {}
  interface Vote extends BaseVote {}

  interface CreateVoteInput
    extends Pick<Vote, "featureId" | "value" | "userId"> {}
  interface CreateFeatureInput
    extends Pick<Feature, "description" | "title" | "createdBy"> {}
  interface UpdateFeature extends CreateFeatureInput, Pick<Feature, "id"> {
    userId: string;
  }
  interface CreateUser extends Pick<User, "email" | "password"> {}
  interface UpdateUser extends CreateUser, Pick<User, "id"> {}

  interface EnvConfig {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}
