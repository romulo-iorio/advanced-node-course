import { type Express } from "express";
import { Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";

export const setupRoutes = (app: Express): void => {
  const router = Router();

  const allFiles = readdirSync(join(__dirname, "../routes"));
  const routeFiles = allFiles.filter((file) => !file.endsWith(".map"));

  routeFiles.map(async (file) => {
    (await import(`../routes/${file}`)).default(router);
  });

  app.use(router);
};
