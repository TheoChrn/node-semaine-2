import * as requestLogger from "./requestLogger";
import * as auth from "./auth";

export const middlewares = {
  ...requestLogger,
  ...auth,
};
