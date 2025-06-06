import type { UpdateComment } from "@/db/entities/comments";
import { models } from "@/models/index";
import { logger } from "@/utils/logger";
import { APIResponse } from "@/utils/response";
import type { Request, Response } from "express";

export const comment = {
  create: async (request: Request, response: Response) => {
    console.log("create");
    try {
      const { content, featureId, parentId } = request.body;
      const { id } = response.locals.user;
      logger.info("[POST] Créer un commentaire");
      const comment = await models.comment.create({
        authorId: id,
        parentId,
        featureId,
        content,
      });
      APIResponse({ response, data: comment, message: "OK", status: 201 });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du commentaire: " + error.message
      );
      APIResponse({
        response,
        message: "Erreur lors de la récupération du commentaire",
        status: 500,
      });
    }
  },
  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { id: userId, role } = response.locals.user;
      logger.info("[DELETE] Supprimer un commentaire");
      await models.comment.delete({ id: id!, userId, role });
      APIResponse({ response, message: "OK", status: 201 });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression du commentaire: " + error.message
      );
      APIResponse({
        response,
        message: "Erreur lors de la suppression du commentaire",
        status: 500,
      });
    }
  },
  update: async (request: Request, response: Response) => {
    try {
      logger.info("[UPDATE] Update un commentaire");
      const { id } = request.params;
      const { content } = request.body;
      const { user } = response.locals;

      const input = {
        id,
        content,
        authorId: user.id,
      } as UpdateComment;

      await models.comment.update(input);
      APIResponse({ response, message: "OK", status: 201 });
    } catch (error: any) {
      logger.error("Erreur lors de la màj du commentaire: " + error.message);
      APIResponse({
        response,
        message: "Erreur lors de la màj du commentaire",
        status: 500,
      });
    }
  },
};
