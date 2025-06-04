import * as commentModel from "./comments";
import * as postModel from "./posts";
import * as userModel from "./users";

export const models = {
  ...commentModel,
  ...postModel,
  ...userModel,
};
