import type { Controller } from "@/application/controllers";
import { ExpressRouter } from "@/infra/http";

export const makeExpressRouter = (controller: Controller): ExpressRouter => {
  return new ExpressRouter(controller);
};
