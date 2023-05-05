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

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { token } = httpRequest;

    try {
      if (token === "" || token == null)
        return badRequest(new RequiredFieldError("token"));

      const result = await this.facebookAuthentication.perform({ token });

      if (!(result instanceof AccessToken)) return unauthorized();

      const { value: accessToken } = result;

      return ok({ accessToken });
    } catch (err) {
      return serverError(err as Error);
    }
  }
}
