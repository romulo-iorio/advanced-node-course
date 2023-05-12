import type { FacebookAuthentication } from "@/domain/features";
import { type MockProxy, mock } from "jest-mock-extended";

import { ServerError, UnauthorizedError } from "@/application/errors";
import { FacebookLoginController } from "@/application/controllers";
import {
  RequiredStringValidator,
  ValidationComposite,
} from "@/application/validation";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "@/domain/models";

jest.mock("@/application/validation/composite");

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

  it("should return 400 if validation fails", async () => {
    const error = new Error("validation_error");
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));

    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy);

    const httpResponse = await sut.handle({ token });

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator(token, "token"),
    ]);
    expect(httpResponse).toEqual({ statusCode: 400, data: error });
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

  it("should return 500 if authentication throws", async () => {
    const error = new Error("infra_error");
    facebookAuth.perform.mockRejectedValueOnce(error);

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
