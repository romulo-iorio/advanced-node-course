export class ServerError extends Error {
  constructor(error?: Error) {
    super("Internal server error. Try again later");
    this.name = "ServerError";
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(field: string) {
    super(`The field ${field} is required`);
    this.name = "RequiredFieldError";
  }
}
