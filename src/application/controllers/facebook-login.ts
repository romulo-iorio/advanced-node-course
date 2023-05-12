import type { FacebookAuthentication } from "@/domain/features";
import type { HttpResponse } from "@/application/helpers";

import {
  RequiredStringValidator,
  ValidationComposite,
} from "@/application/validation";
import { AccessToken } from "@/domain/models";
import * as httpResponseHelpers from "@/application/helpers";

type HttpRequest = {
  token: string | undefined | null;
};

type Model = Error | { accessToken: string };

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  private validate(httpRequest: HttpRequest): Error | undefined {
    const validators = [
      new RequiredStringValidator(httpRequest.token, "token"),
    ];

    const validator = new ValidationComposite(validators);
    return validator.validate();
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const { token } = httpRequest;

    try {
      const error = this.validate(httpRequest);
      if (error !== undefined) return httpResponseHelpers.badRequest(error);
      if (token == null) return httpResponseHelpers.unauthorized();

      const result = await this.facebookAuthentication.perform({ token });

      const isAccessToken = result instanceof AccessToken;
      if (!isAccessToken) return httpResponseHelpers.unauthorized();

      const { value: accessToken } = result;

      return httpResponseHelpers.ok({ accessToken });
    } catch (err) {
      return httpResponseHelpers.serverError(err as Error);
    }
  }
}
