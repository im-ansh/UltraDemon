export class UltrademonError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'UltrademonError';
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends UltrademonError {
  constructor(message: string = 'Authentication failed. Please verify your API key or bearer token.') {
    super(message, 401, 'AUTHENTICATION_REQUIRED');
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends UltrademonError {
  constructor(message: string = 'Rate limit or monthly quota exceeded.') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends UltrademonError {
  constructor(message: string = 'Requested resource was not found.') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends UltrademonError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

