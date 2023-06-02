import type { MockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock } from "jest-mock-extended";

import type { Controller } from "@/application/controllers";

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body });

    if (httpResponse.statusCode === 200)
      res.status(200).json(httpResponse.data);

    if (httpResponse.statusCode === 400)
      res.status(400).json({ error: httpResponse.data.message });
  }
}

const data = { data: "any_data" };

describe("ExpressRouter", () => {
  let req: Request;
  let res: Response;
  let controller: MockProxy<Controller>;
  let sut: ExpressRouter;

  beforeEach(() => {
    req = getMockReq({ body: { any: "any" } });
    res = getMockRes().res;

    controller = mock<Controller>();
    controller.handle.mockResolvedValue({ statusCode: 200, data });

    sut = new ExpressRouter(controller);
  });

  it("should call handle with correct request", async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ any: "any" });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it("should call handle with empty request", async () => {
    const req = getMockReq();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it("should respond with 200 and valid data", async () => {
    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({ ...data });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it("should respond with 400 and valid error", async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error("any_error"),
    });

    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
