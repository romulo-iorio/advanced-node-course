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

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    const { token } = httpRequest;

    try {
      if (token === "" || token == null)
        return badRequest(new RequiredFieldError("token"));

      const accessToken = await this.facebookAuthentication.perform({ token });

      if (accessToken instanceof AccessToken)
        return ok({ accessToken: accessToken.value });

      return unauthorized();
    } catch (err) {
      return serverError(err as Error);
    }
  }
}
