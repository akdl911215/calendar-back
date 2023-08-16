import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  MisdirectedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export function errorHandling(e: any): void {
  if (e instanceof BadRequestException) throw new BadRequestException(); // 400

  if (e instanceof UnauthorizedException) throw new UnauthorizedException(); // 401

  // 402 Payment Required 예약만 되있는 상태

  if (e instanceof ForbiddenException) throw new ForbiddenException(); // 403

  if (e instanceof NotFoundException) throw new NotFoundException(); // 404

  if (e instanceof MethodNotAllowedException)
    throw new MethodNotAllowedException(); // 405

  if (e instanceof NotAcceptableException) throw new NotAcceptableException(); // 406

  // 407 X

  if (e instanceof RequestTimeoutException) throw new RequestTimeoutException(); // 408

  if (e instanceof ConflictException) throw new ConflictException(); // 409

  if (e instanceof GoneException) throw new GoneException(); // 410

  // 411 X

  if (e instanceof PreconditionFailedException)
    throw new PreconditionFailedException(); // 412

  if (e instanceof PayloadTooLargeException)
    throw new PayloadTooLargeException(); // 413

  // 414 X

  if (e instanceof UnsupportedMediaTypeException)
    throw new UnsupportedMediaTypeException(); // 415

  // 416 X

  // 417 X

  if (e instanceof ImATeapotException) throw new ImATeapotException(); // 418

  if (e instanceof MisdirectedException) throw new MisdirectedException(); // 421

  if (e instanceof UnprocessableEntityException)
    throw new UnprocessableEntityException(); // 422

  // 423 X

  // 423 X

  // 424 X

  // 426 X

  // 428 X

  // 429 X

  // 431 X

  // 451 X

  if (e instanceof InternalServerErrorException)
    throw new InternalServerErrorException(); // 500

  if (e instanceof NotImplementedException) throw new NotImplementedException(); // 501

  if (e instanceof BadGatewayException) throw new BadGatewayException(); // 502

  if (e instanceof ServiceUnavailableException)
    throw new ServiceUnavailableException(); // 503

  if (e instanceof GatewayTimeoutException) throw new GatewayTimeoutException(); // 504

  // 505 X

  // 506 X

  // 507 X

  // 508 X

  // 510 X

  // 511 X

  throw new Error(`${e}`);
}
