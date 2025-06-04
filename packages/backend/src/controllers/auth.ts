import { env } from "@/config/env";
import jwt from "jsonwebtoken";

import * as argon2 from "argon2";

import type { Request, Response } from "express";
import { APIResponse } from "@/utils/response";

import { models } from "@/models";
import { logger } from "@/utils/logger";
import {
  createUserSchema,
  loginUserSchema,
} from "@monorepo/shared/src/validators";

const { JWT_SECRET, NODE_ENV } = env;

export const auth = {
  login: async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const validation = loginUserSchema.safeParse(email);
      if (!validation.success) {
        APIResponse(response, null, validation.error.message, 401);
        return;
      }

      const user = await models.user.getByEmail(email);

      if (!user) {
        APIResponse(
          response,
          null,
          "L'email ou le mot de passe saisi est incorrecte",
          401
        );
        return;
      }
      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        APIResponse(
          response,
          null,
          "L'email ou le mot de passe saisi est incorrecte",
          401
        );
        return;
      }

      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: NODE_ENV === "production",
      });
      APIResponse(response, null, "Vous êtes bien connecté", 200);
    } catch (err: any) {
      logger.error(
        `Erreur lors de la connexion de l'utilisateur: ${err.message}`
      );
      APIResponse(response, null, "Erreur serveur", 500);
    }
  },
  register: async (request: Request, response: Response) => {
    try {
      const { userName, email, password } = request.body;
      const validation = createUserSchema.safeParse(request.body);

      if (!validation.success) {
        APIResponse(response, null, validation.error.message, 401);
        return;
      }

      const existingUser = await models.user.getByEmail({ email });

      if (existingUser) {
        APIResponse(response, null, "Cet email est déjà utilisé !", 401);
        return;
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = await models.user.create({
        userName,
        email,
        password: hashedPassword,
      });

      const accessToken = jwt.sign({ id: newUser!.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: NODE_ENV === "production",
      });
      APIResponse(response, null, "Vous êtes bien connecté", 200);
    } catch (err: any) {
      logger.error(
        `Erreur lors de la création de l'utilisateur: ${err.message}`
      );
      APIResponse(response, null, "Erreur serveur", 500);
    }
  },
  logout: async (request: Request, response: Response) => {
    response.clearCookie("accessToken");
    APIResponse(response, null, "Vous êtes déconnecté", 200);
  },
};
