import * as users from "./users";
import * as features from "./features";
import * as comments from "./comments";
import * as upvotes from "./votes";

export const schema = {
  ...users,
  ...features,
  ...comments,
  ...upvotes,
};
