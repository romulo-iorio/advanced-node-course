import jwt from "jsonwebtoken";

import type { TokenGenerator } from "@/data/contracts/crypto";

jest.mock("jsonwebtoken");

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(
    params: TokenGenerator.Params
  ): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;

    return jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });
  }
}

describe("JwtTokenGenerator", () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: JwtTokenGenerator;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => "any_value");
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator("any_secret");
  });

  it("should call sign with correct params", async () => {
    await sut.generateToken({ key: "any_key", expirationInMs: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: "any_key" },
      "any_secret",
      { expiresIn: 1 }
    );
  });

  it("should return a token", async () => {
    const token = await sut.generateToken({
      key: "any_key",
      expirationInMs: 1000,
    });

    expect(token).toEqual("any_value");
  });

  it("should rethrow if sign throws", async () => {
    const error = new Error("token_error");

    fakeJwt.sign.mockImplementationOnce(() => {
      throw error;
    });

    const promise = sut.generateToken({
      key: "any_key",
      expirationInMs: 1000,
    });

    await expect(promise).rejects.toThrow(error);
  });
});
