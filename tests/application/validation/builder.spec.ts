import type { Validator } from "@/application/validation";
import { RequiredStringValidator } from "@/application/validation";

namespace ValidationBuilderOf {
  export type Params = {
    value: string;
    fieldName: string;
  };

  export type Result = ValidationBuilder;
}

class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of(params: ValidationBuilderOf.Params): ValidationBuilderOf.Result {
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

describe("ValidationBuilder", () => {
  it("should return a RequiredStringValidator", () => {
    const validators = ValidationBuilder.of({
      value: "any_value",
      fieldName: "any_name",
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredStringValidator("any_value", "any_name"),
    ]);
  });
});
