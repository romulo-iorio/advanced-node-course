import type { FacebookAuthentication } from "@/domain/features";
import type { HttpResponse } from "@/application/helpers";

import { type Validator } from "@/application/validation";

import { Controller } from "@/application/controllers/controller";
import { ValidationBuilder } from "@/application/validation";
import { AccessToken } from "@/domain/models";
import { unauthorized, ok } from "@/application/helpers";

type HttpRequest = {
  token: string | undefined | null;
};

type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  override buildValidators(httpRequest: HttpRequest): Validator[] {
    const value = httpRequest.token ?? "";
    const fieldName = "token";

    return [...ValidationBuilder.of({ value, fieldName }).required().build()];
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const { token } = httpRequest;

    if (token == null) return unauthorized();

    const result = await this.facebookAuthentication.perform({ token });

    const isAccessToken = result instanceof AccessToken;
    if (!isAccessToken) return unauthorized();

    const { value: accessToken } = result;

    return ok({ accessToken });
  }
}
