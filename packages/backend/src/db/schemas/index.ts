import * as users from "./users";
import * as posts from "./posts";
import * as comments from "./comments";

export const schema = {
  ...users,
  ...posts,
  ...comments,
};
