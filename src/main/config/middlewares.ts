import { type Express } from "express";

import { json } from "express";
import cors from "cors";

export const setupMiddlewares = (app: Express): void => {
  app.use(cors());
  app.use(json());
  app.use((_, res, next) => {
    res.type("json");
    next();
  });
};
