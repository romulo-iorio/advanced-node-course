import type { Router, RequestHandler } from "express";

import {
  makeFacebookLoginController,
  makeExpressRouter,
} from "@/main/factories";

export default (router: Router): void => {
  const controller = makeFacebookLoginController();
  const adapter = makeExpressRouter(controller);

  const requestHandler = adapter.adapt as RequestHandler;

  router.post("/api/login/facebook", requestHandler);
};
