import { RequiredFieldError, ServerError } from "@/application/errors";
import { type HttpResponse, badRequest } from "@/application/helpers";
import type { FacebookAuthentication } from "@/domain/features";
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

      const result = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value },
        };
      }

      return {
        statusCode: 401,
        data: result,
      };
    } catch (err) {
      const error = err as Error;
      return {
        statusCode: 500,
        data: new ServerError(error),
      };
    }
  }
}