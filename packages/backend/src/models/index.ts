import * as commentModel from "./comments";
import * as userModel from "./users";
import * as featureModel from "./features";

export const models = {
  ...commentModel,
  ...userModel,
  ...featureModel,
};
