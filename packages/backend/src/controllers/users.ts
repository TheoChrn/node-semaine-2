import { models } from "@/models/index";
import { logger } from "@/utils/logger";
import { APIResponse } from "@/utils/response";
import { validateIdSchema } from "@monorepo/shared";
import type { Request, Response } from "express";

export const user = {
  getSession: async (request: Request, response: Response) => {
    logger.info("[GET] Récupérer la session du user");
    try {
      const { user } = response.locals;

      const validation = validateIdSchema.safeParse(user.id);

      if (validation.error) {
        APIResponse({
          response,
          message: "Cet user n'existe pas",
          status: 404,
        });
        return;
      }

      const userSession = await models.user.getSession({ id: user.id });

      if (!userSession) {
        APIResponse({
          response,
          message: "Cet user n'existe pas",
          status: 404,
        });
        return;
      }

      APIResponse({
        response,
        data: userSession,
      });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du feature: " + error.message
      );
      APIResponse({
        response,
        message: "Erreur lors de la récupération du feature",
        status: 500,
      });
    }
  },
};
