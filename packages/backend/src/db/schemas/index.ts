import * as users from "./users";
import * as features from "./features";
import * as comments from "./comments";

export const schema = {
  ...users,
  ...features,
  ...comments,
};
