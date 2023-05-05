import type { FacebookAuthentication } from "@/domain/features";

import {
  type HttpResponse,
  unauthorized,
  serverError,
  badRequest,
  ok,
} from "@/application/helpers";
import { RequiredFieldError } from "@/application/errors";
import { AccessToken } from "@/domain/models";

type HttpRequest = {
  token: string | undefined | null;
};

type Model = Error | { accessToken: string };

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  private validate(httpRequest: HttpRequest): Error | undefined {
    const { token } = httpRequest;

    if (token === "" || token == null) return new RequiredFieldError("token");
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const { token } = httpRequest;

    try {
      const error = this.validate(httpRequest);
      if (error !== undefined) return badRequest(error);
      if (token == null) return unauthorized();

      const result = await this.facebookAuthentication.perform({ token });

      const isAccessToken = result instanceof AccessToken;
      if (!isAccessToken) return unauthorized();

      const { value: accessToken } = result;

      return ok({ accessToken });
    } catch (err) {
      return serverError(err as Error);
    }
  }
}
