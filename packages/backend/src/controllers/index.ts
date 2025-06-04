import * as postControllers from "./posts";
import * as commentControllers from "./comments";
import * as authControllers from "./auth";

export const controllers = {
  ...postControllers,
  ...commentControllers,
  ...authControllers,
};
