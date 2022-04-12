import { STATUS_CODES } from 'http';

export enum ErrorNames {
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  PaymentRequired = 'PaymentRequired',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  MethodNotAllowed = 'MethodNotAllowed',
  NotAcceptable = 'NotAcceptable',
  ProxyAuthenticationRequired = 'ProxyAuthenticationRequired',
  RequestTimeout = 'RequestTimeout',
  Conflict = 'Conflict',
  Gone = 'Gone',
  LengthRequired = 'LengthRequired',
  PreconditionFailed = 'PreconditionFailed',
  PayloadTooLarge = 'PayloadTooLarge',
  URITooLong = 'URITooLong',
  UnsupportedMediaType = 'UnsupportedMediaType',
  RangeNotSatisfiable = 'RangeNotSatisfiable',
  ExpectationFailed = 'ExpectationFailed',
  ImaTeapot = 'ImaTeapot',
  MisdirectedRequest = 'MisdirectedRequest',
  UnprocessableEntity = 'UnprocessableEntity',
  Locked = 'Locked',
  FailedDependency = 'FailedDependency',
  UnorderedCollection = 'UnorderedCollection',
  UpgradeRequired = 'UpgradeRequired',
  PreconditionRequired = 'PreconditionRequired',
  TooManyRequests = 'TooManyRequests',
  RequestHeaderFieldsTooLarge = 'RequestHeaderFieldsTooLarge',
  UnavailableForLegalReasons = 'UnavailableForLegalReasons',
  InternalServerError = 'InternalServerError',
  NotImplemented = 'NotImplemented',
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  HTTPVersionNotSupported = 'HTTPVersionNotSupported',
  VariantAlsoNegotiates = 'VariantAlsoNegotiates',
  InsufficientStorage = 'InsufficientStorage',
  LoopDetected = 'LoopDetected',
  BandwidthLimitExceeded = 'BandwidthLimitExceeded',
  NotExtended = 'NotExtended',
  NetworkAuthenticationRequired = 'NetworkAuthenticationRequired',
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public error: keyof typeof ErrorNames,
    public data?: unknown,
  ) {
    super(message);
    this.name = this.error;
    this.message = message;
    this.data = data;
  }

  toJson() {
    return {
      error: this.error,
      message: this.message,
      data: this.data,
    };
  }
}

type Errors = {
  [errorName in ErrorNames]: new (message: string, data?: unknown) => HttpError;
};

const createErrorClass = function (
  statusCode: string,
  name: keyof typeof ErrorNames,
) {
  return <new (message: string) => HttpError>(
    (<unknown>function (message: string, data?: unknown) {
      return new HttpError(message, parseInt(statusCode, 10), name, data);
    })
  );
};

export const HttpErrors: Errors = Object.keys(STATUS_CODES)
  .filter((code) => parseInt(code, 10) >= 400)
  .reduce<Errors>((errors: Errors, errorCode: string) => {
    const statusCode = STATUS_CODES[errorCode] || '';
    const errorType = statusCode.replace(/\W/g, '') as keyof typeof ErrorNames;

    errors[errorType] = createErrorClass(errorCode, errorType);

    return errors;
  }, {} as Errors);

export function isHttpError(err: unknown): err is HttpError {
  return err instanceof HttpError;
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function assertFound<C>(
  condition: C | undefined | null,
  message: string,
  data?: unknown,
): NonNullable<C> {
  if (!isNonNullable(condition)) {
    throw new HttpErrors.NotFound(message, data);
  }

  return condition;
}
