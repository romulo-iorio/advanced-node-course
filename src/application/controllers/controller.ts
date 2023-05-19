import type { HttpResponse } from "@/application/helpers";

import { type Validator } from "@/application/validation";

import { ValidationComposite } from "@/application/validation";
import * as httpResponseHelpers from "@/application/helpers";

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>;

  buildValidators(httpRequest: any): Validator[] {
    return [];
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest);
    return new ValidationComposite(validators).validate();
  }

  public async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error !== undefined) return httpResponseHelpers.badRequest(error);

    try {
      return await this.perform(httpRequest);
    } catch (err) {
      return httpResponseHelpers.serverError(err as Error);
    }
  }
}
