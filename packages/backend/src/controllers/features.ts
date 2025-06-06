import { userRolesValues } from "@/db/schemas/users";
import { models } from "@/models/index";
import { logger } from "@/utils/logger";
import { APIResponse } from "@/utils/response";
import {
  createFeatureInputSchema,
  updateFeatureSchema,
  validateIdSchema,
} from "@monorepo/shared";
import type { Request, Response } from "express";

export const feature = {
  get: async (request: Request, response: Response) => {
    logger.info("[GET] Récupérer une feature");
    try {
      const { id } = request.params;
      const { user } = response.locals;

      const validation = validateIdSchema.safeParse(id);

      if (validation.error) {
        APIResponse({
          response,
          message: "Cette feature n'existe pas",
          status: 404,
        });
        return;
      }

      const feature = await models.feature.get({ id: id!, userId: user.id });

      if (!feature) {
        APIResponse({
          response,
          message: "Cette feature n'existe pas",
          status: 404,
        });
        return;
      }

      APIResponse({
        response,
        data: feature,
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
  getAll: async (_: Request, response: Response) => {
    logger.info("[GET] Récupérer toutes les features");
    try {
      const features = await models.feature.getAll();

      APIResponse({
        response,
        data: features,
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
  create: async (request: Request, response: Response) => {
    logger.info("[POST] Créer une feature");
    try {
      const { description, title } = request.body;
      const { id, role } = response.locals.user;

      if (role !== userRolesValues.ADMIN) {
        APIResponse({
          response,
          message: "Unauthorized",
          status: 401,
        });
        return;
      }

      const input = {
        description,
        title,
        createdBy: id,
      };

      const validation = createFeatureInputSchema.safeParse(input);

      if (validation.error) {
        APIResponse({
          response,
          message: validation.error.message,
          status: 400,
        });
      }

      await models.feature.create(input);

      APIResponse({ response, message: "Feature crée", status: 201 });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la création de la feature: " + error.message
      );
      APIResponse({
        response,

        message: "Erreur lors de la création de la feature",
        status: 500,
      });
    }
  },
  delete: async (request: Request, response: Response) => {
    logger.info("[DELETE] Supprimer une feature");
    try {
      const { id } = request.params;
      const { role } = response.locals.user;

      if (role !== userRolesValues.ADMIN) {
        APIResponse({
          response,
          message: "Unauthorized",
          status: 401,
        });
        return;
      }

      const validation = validateIdSchema.safeParse(id);

      if (validation.error) {
        APIResponse({
          response,
          message: "Cette feature n'existe pas",
          status: 404,
        });
        return;
      }

      await models.feature.delete({ id: id! });

      APIResponse({
        response,
        message: "Feature supprimée",
        status: 204,
      });
      return;
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression de la feature: " + error.message
      );
      APIResponse({
        response,
        message: "Erreur lors de la suppression de la feature",
        status: 500,
      });
    }
  },
  update: async (request: Request, response: Response) => {
    logger.info("[UPDATE] Update un feature");
    try {
      const { id } = request.params;
      const { description, title } = request.body;
      const { user, role } = response.locals;

      if (role !== userRolesValues.ADMIN) {
        APIResponse({
          response,
          message: "Unauthorized",
          status: 401,
        });
        return;
      }

      const input = {
        id: id!,
        description,
        title,
        userId: user.id,
      } as UpdateFeature;

      const validation = updateFeatureSchema.safeParse(input);

      if (validation.error) {
        APIResponse({
          response,
          message: validation.error.message,
          status: 400,
        });
      }

      await models.feature.update(input);

      APIResponse({
        response,
        message: "Feature mise à jour",
        status: 204,
      });
    } catch (error: any) {
      logger.error("Erreur lors de la màj de la feature: " + error.message);
      APIResponse({
        response,

        message: "Erreur lors de la màj de la feature",
        status: 500,
      });
    }
  },
};
