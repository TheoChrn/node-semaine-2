import { BaseUser } from "@/db/entities/users";

export {};

declare global {
  interface User extends BaseUser {}

  interface CreateUser extends Pick<User, "userName" | "email" | "password"> {}
  interface UpdateUser extends CreateUser, Pick<User, "id"> {}

  interface EnvConfig {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    ORIGIN: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}
