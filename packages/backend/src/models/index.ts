import * as commentModel from "./comments";
import * as userModel from "./users";
import * as featureModel from "./features";
import * as voteModel from "./vote";

export const models = {
  ...commentModel,
  ...userModel,
  ...featureModel,
  ...voteModel,
};
