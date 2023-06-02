import type { MockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock } from "jest-mock-extended";

import type { Controller } from "@/application/controllers";
import { ExpressRouter } from "@/infra/http";

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

  it("should respond with 500 and valid error", async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error("any_error"),
    });

    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
