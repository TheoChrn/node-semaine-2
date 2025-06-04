import * as requestLogger from "./requestLogger";
import * as auth from "./requestLogger";

export const middlewares = {
  ...requestLogger,
  ...auth,
};
