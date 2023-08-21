import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayloadType } from '../type/refresh.token.payload.type';
import { CalendarUsers } from '@prisma/client';
import { NOT_MATCH_REFRESH_TOKEN } from '../../../../_common/https/errors/400';
import { UsersFindByEntityInterface } from '../../../interfaces/users.find.by.entity.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'JWT-REFRESH-TOKEN',
) {
  constructor(
    @Inject('SERVICE') private readonly service: UsersFindByEntityInterface,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: RefreshTokenPayloadType,
  ): Promise<CalendarUsers> {
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    const user = await this.service.userFindById({ id: payload.id });
    const { refresh_token } = user;

    if (token !== refresh_token)
      throw new BadRequestException(NOT_MATCH_REFRESH_TOKEN);

    return user;
  }
}
