import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayloadType } from '../type/refresh.token.payload.type';
import { Users } from '@prisma/client';
import { BaseOutputDto } from '../../../../_common/dtos/base.output.dto';
import { NOT_MATCH_REFRESH_TOKEN } from '../../../../_common/http/errors/400';
import { UsersFindByInterface } from '../../../interfaces/users.find.by.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'JWT-REFRESH-TOKEN',
) {
  constructor(
    @Inject('SERVICE') private readonly service: UsersFindByInterface,
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
  ): Promise<BaseOutputDto<Users>> {
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    const user = await this.service.usersFindById({ id: payload.id });
    const { refreshToken } = user.response;

    if (token !== refreshToken)
      throw new BadRequestException(NOT_MATCH_REFRESH_TOKEN);

    return user;
  }
}
