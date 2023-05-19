import type { FacebookAuthentication } from "@/domain/features";
import { type MockProxy, mock } from "jest-mock-extended";

import { FacebookLoginController } from "@/application/controllers";
import { RequiredStringValidator } from "@/application/validation";
import { UnauthorizedError } from "@/application/errors";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "@/domain/models";

describe("FacebookLoginController", () => {
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let sut: FacebookLoginController;
  let token: string;

  beforeAll(() => {
    token = "any_token";

    facebookAuth = mock<FacebookAuthentication>();
    facebookAuth.perform.mockResolvedValue(new AccessToken("any_value"));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it("should build Validators correctly", async () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([new RequiredStringValidator(token, "token")]);
  });

  it("should call FacebookAuthentication with correct params", async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if authentication fails", async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it("should return 200 if authentication succeeds", async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: "any_value" },
    });
  });
});
