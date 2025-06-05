import * as commentControllers from "./comments";
import * as authControllers from "./auth";
import * as featureControllers from "./features";
import * as voteControllers from "./votes";
import * as usersControllers from "./users";

export const controllers = {
  ...commentControllers,
  ...authControllers,
  ...featureControllers,
  ...voteControllers,
  ...usersControllers,
};
