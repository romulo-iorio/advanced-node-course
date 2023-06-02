import type { MockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock } from "jest-mock-extended";

import type { Controller } from "@/application/controllers";

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body });
  }
}

describe("ExpressRouter", () => {
  let req: Request;
  let res: Response;
  let controller: MockProxy<Controller>;
  let sut: ExpressRouter;

  beforeEach(() => {
    req = getMockReq({ body: { any: "any" } });
    res = getMockRes().res;
    controller = mock<Controller>();
    sut = new ExpressRouter(controller);
  });

  it("should call handle with correct request", async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ any: "any" });
  });

  it("should call handle with empty request", async () => {
    const req = getMockReq();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
  });
});
