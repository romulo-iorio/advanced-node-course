import { RequiredStringValidator } from "@/application/validation";
import type { Validator } from "@/application/validation";

type OfParams = { value: string; fieldName: string };

export class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of(params: OfParams): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName);
  }

  required(): ValidationBuilder {
    this.validators.push(
      new RequiredStringValidator(this.value, this.fieldName)
    );
    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
