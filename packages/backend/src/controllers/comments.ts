import type { Request, Response } from "express";
import { APIResponse } from "@/utils/response";
import { logger } from "@/utils/logger";
import { models } from "@/models/index";
import type { UpdateComment } from "@/db/entities/comments";

export const comment = {
  get: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      logger.info("[GET] Récupérer un commentaire"); // Log d'information en couleur
      const comment = await models.comment.get({ id: id! });
      APIResponse(response, comment, "OK");
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du commentaire: " + error.message
      );
      APIResponse(
        response,
        null,
        "Erreur lors de la récupération du commentaire",
        500
      );
    }
  },
  create: async (request: Request, response: Response) => {
    try {
      const { content, title, postId } = request.body;
      const { id } = response.locals.user;
      logger.info("[POST] Créer un commentaire");
      const comment = await models.comment.create({
        authorId: id,
        title,
        content,
        postId,
      });
      APIResponse(response, comment, "OK", 201);
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du commentaire: " + error.message
      );
      APIResponse(
        response,
        null,
        "Erreur lors de la récupération du commentaire",
        500
      );
    }
  },
  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { user } = response.locals;
      logger.info("[DELETE] Supprimer un commentaire"); // Log d'information en couleur
      await models.comment.delete({ id: id! });
      APIResponse(response, null, "OK", 201);
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression du commentaire: " + error.message
      );
      APIResponse(
        response,
        null,
        "Erreur lors de la suppression du commentaire",
        500
      );
    }
  },
  update: async (request: Request, response: Response) => {
    try {
      logger.info("[UPDATE] Update un commentaire");
      const { id } = request.params;
      const { content, postId, title } = request.body;
      const { user } = response.locals;

      const input = {
        id,
        content,
        postId,
        title,
        authorId: user.id,
      } as UpdateComment;

      await models.comment.update(input);
      APIResponse(response, null, "OK", 201);
    } catch (error: any) {
      logger.error("Erreur lors de la màj du commentaire: " + error.message);
      APIResponse(response, null, "Erreur lors de la màj du commentaire", 500);
    }
  },
};
