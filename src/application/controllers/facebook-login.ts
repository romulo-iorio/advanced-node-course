import type { FacebookAuthentication } from "@/domain/features";

import {
  type HttpResponse,
  unauthorized,
  serverError,
  badRequest,
} from "@/application/helpers";
import { RequiredFieldError } from "@/application/errors";
import { AccessToken } from "@/domain/models";

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === "" || httpRequest.token == null) {
        return badRequest(new RequiredFieldError("token"));
      }

      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: accessToken.value },
        };
      }

      return unauthorized();
    } catch (err) {
      return serverError(err as Error);
    }
  }
}
