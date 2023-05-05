import { RequiredFieldError } from "../errors";

export class RequiredStringValidator {
  constructor(
    private readonly value: string | null | undefined,
    private readonly fieldName: string
  ) {}

  validate(): Error | undefined {
    if (this.value === "" || this.value == null)
      return new RequiredFieldError(this.fieldName);
  }
}
