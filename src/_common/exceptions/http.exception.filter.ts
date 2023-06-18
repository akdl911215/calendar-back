import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException))
      exception = new InternalServerErrorException();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = (exception as HttpException).getResponse();
    const message = exception.message;

    const developErrorLog = {
      status,
      timestamp: new Date().toLocaleString('ko-KR', { hour12: true }),
      url: req.url,
      response,
    };

    const productErrorLog = {
      message,
      status,
    };

    this.logger.error(developErrorLog);
    res
      .status(status)
      .json(
        process.env.NODE_ENV === 'development'
          ? developErrorLog
          : productErrorLog,
      );
  }
}
