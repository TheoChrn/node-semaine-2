import * as commentControllers from "./comments";
import * as authControllers from "./auth";
import * as featureControllers from "./features";
import * as usersControllers from "./users";

export const controllers = {
  ...commentControllers,
  ...authControllers,
  ...featureControllers,
  ...usersControllers,
};
