import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { NO_MATCH_PASSWORD } from '../../../_common/https/errors/400';
import { UsersCompareCurrentPasswordAndPasswordInterface } from '../../interfaces/users.compare.current.password.and.password.interface';

@Injectable()
export class UsersCurrentPasswordMiddleware implements NestMiddleware {
  constructor(
    @Inject('COMPARE_CURRENT_PASSWORD_AND_PASSWORD')
    private readonly repository: UsersCompareCurrentPasswordAndPasswordInterface,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const compareCurrentPasswordAndPassword =
      await this.repository.compareCurrentPasswordAndPassword(req.body);

    const { compare } = compareCurrentPasswordAndPassword;

    if (compare) next();
    else throw new BadRequestException(NO_MATCH_PASSWORD);
  }
}
