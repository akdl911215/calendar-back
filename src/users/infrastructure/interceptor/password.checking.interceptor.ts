import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class PasswordCheckingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>().body;

    if ('confirmPassword' in request) {
      if (
        request.password !== request.confirmPassword ||
        request.confirmPassword === ''
      ) {
        throw new BadRequestException('password !== confirmPassword');
      } else {
        delete request['confirmPassword'];
        delete request['currentPassword'];
      }
    }

    return next.handle().pipe(tap((data) => delete data.response.password));
  }
}
