export declare class UltrademonError extends Error {
    readonly status?: number;
    readonly code?: string;
    readonly details?: unknown;
    constructor(message: string, status?: number, code?: string, details?: unknown);
}
export declare class AuthenticationError extends UltrademonError {
    constructor(message?: string);
}
export declare class RateLimitError extends UltrademonError {
    constructor(message?: string);
}
export declare class NotFoundError extends UltrademonError {
    constructor(message?: string);
}
export declare class ValidationError extends UltrademonError {
    constructor(message: string, details?: unknown);
}
