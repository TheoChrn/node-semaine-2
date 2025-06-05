import { models } from "@/models/index";
import { logger } from "@/utils/logger";
import { APIResponse } from "@/utils/response";
import { createVoteSchema } from "@monorepo/shared/src/validators";
import type { Request, Response } from "express";

export const vote = {
  upsert: async (request: Request, response: Response) => {
    logger.info("[POST] Créer un vote");
    try {
      const { featureId, value } = request.body;
      const { id } = response.locals.user;

      const input = {
        featureId,
        value,
        userId: id,
      };

      const validation = createVoteSchema.safeParse(input);

      if (validation.error) {
        APIResponse({
          response,
          message: validation.error.message,
          status: 400,
        });
      }

      await models.vote.upsert(input);

      APIResponse({ response, message: "Vote crée", status: 201 });
    } catch (error: any) {
      logger.error("Erreur lors de la création de la vote: " + error.message);
      APIResponse({
        response,

        message: "Erreur lors de la création de la vote",
        status: 500,
      });
    }
  },
};
