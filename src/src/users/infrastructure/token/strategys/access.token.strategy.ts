import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
import { UsersFindByInterface } from '../../../interfaces/users.find.by.interface';
import { BaseOutputDto } from '../../../../_common/dtos/base.output.dto';
import { StrategyPayloadIdInputDto } from '../../../dtos/strategy.payload.id.input.dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'JWT-ACCESS-TOKEN',
) {
  constructor(
    @Inject('SERVICE')
    private readonly service: UsersFindByInterface,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate({
    id,
  }: StrategyPayloadIdInputDto): Promise<BaseOutputDto<Users>> {
    const user = await this.service.usersFindById({ id });
    return user;
  }
}
