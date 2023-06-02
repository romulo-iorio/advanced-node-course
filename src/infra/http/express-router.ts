import type { Request, Response } from "express";

import type { Controller } from "@/application/controllers";

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body });

    const isSuccess = httpResponse.statusCode === 200;

    const statusCode = isSuccess ? 200 : httpResponse.statusCode;

    const data = isSuccess
      ? httpResponse.data
      : { error: httpResponse.data.message };

    res.status(statusCode).json(data);
  }
}
