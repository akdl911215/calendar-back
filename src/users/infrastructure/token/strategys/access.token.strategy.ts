import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersFindByEntityInterface } from '../../../interfaces/users.find.by.entity.interface';
import {
  StrategyPayloadIdInputDto,
  StrategyPayloadOutputDto,
} from '../../../dtos/strategy.payload.id.input.dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'JWT-ACCESS-TOKEN',
) {
  constructor(
    @Inject('SERVICE')
    private readonly service: UsersFindByEntityInterface,
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
  }: StrategyPayloadIdInputDto): Promise<StrategyPayloadOutputDto> {
    const user = await this.service.usersFindById({ id });
    return { response: user };
  }
}
