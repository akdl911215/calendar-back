import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadType } from './type/access.token.payload.type';

import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayloadType } from './type/refresh.token.payload.type';
import { GenerateTokenOutputDto } from './dtos/generate.token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTokens(
    accessPayload: AccessTokenPayloadType,
    refreshPayload: RefreshTokenPayloadType,
  ): Promise<GenerateTokenOutputDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE_IN'),
      }),

      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE_IN'),
      }),
    ]);

    return {
      response: {
        accessToken,
        refreshToken,
      },
    };
  }
}
