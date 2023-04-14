import jwt from "jsonwebtoken";

import { JwtTokenGenerator } from "@/infra/crypto";

jest.mock("jsonwebtoken");

describe("JwtTokenGenerator", () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: JwtTokenGenerator;

  let expirationInMs: number;
  let secret: string;
  let key: string;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => "any_value");

    expirationInMs = 1000;
    secret = "any_secret";
    key = "any_key";
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
  });

  it("should call sign with correct params", async () => {
    await sut.generateToken({ key, expirationInMs });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, {
      expiresIn: 1,
    });
  });

  it("should return a token", async () => {
    const token = await sut.generateToken({ key, expirationInMs });

    expect(token).toEqual("any_value");
  });

  it("should rethrow if sign throws", async () => {
    const error = new Error("token_error");

    fakeJwt.sign.mockImplementationOnce(() => {
      throw error;
    });

    const promise = sut.generateToken({ key, expirationInMs });

    await expect(promise).rejects.toThrow(error);
  });
});
