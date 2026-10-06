export class AuthorizationError extends Error {
  constructor(message = "Permission denied") {
    super(message);

    this.name = "AuthorizationError";
    this.status = 403;
    this.code = "PERMISSION_DENIED";
  }
}
