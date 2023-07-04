import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRefreshTokenReIssuanceInputDto } from './dtos/user.refresh.token.re.issuance.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException } from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';

describe('Users Profile Process', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let jwt: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'REPOSITORY', useClass: UsersRepository },
        PrismaService,
        { provide: 'HASH_ENCODED', useClass: HashEncodedService },
        HashEncodedService,
        HashDecodedService,
        { provide: 'HASH_DECODED', useClass: HashDecodedService },
        { provide: 'TOKEN_SERVICE', useClass: TokenService },
        ConfigService,
        TokenService,
        JwtService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<TokenService>(TokenService);
  });

  describe('user refresh token unit test', () => {
    it('id empty, so it fails', async () => {
      const dto: UsersRefreshTokenReIssuanceInputDto = {
        id: '',
        appId: '',
        phone: '',
      };

      try {
        await service.refresh(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'unique_id_required',
            statusCode: 400,
          });
        }
      }
    });

    it('app-id empty, so it fails', async () => {
      const dto: UsersRefreshTokenReIssuanceInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: '',
        phone: '',
      };

      try {
        await service.refresh(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'app_id_required',
            statusCode: 400,
          });
        }
      }
    });

    it('phone empty, so it fails', async () => {
      const dto: UsersRefreshTokenReIssuanceInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: 'master',
        phone: '',
      };

      try {
        await service.refresh(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'phone_required',
            statusCode: 400,
          });
        }
      }
    });

    it('success should user logout', async () => {
      const dto: UsersRefreshTokenReIssuanceInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: 'master',
        phone: '01050939902',
      };

      const refreshDto = {
        id: dto.id,
        appId: 'test',
        nickname: 'test',
        password: 'test',
        phone: 'test',
        refreshToken: null,
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: null,
      };

      jest.spyOn(prisma.users, 'update').mockResolvedValue(refreshDto);
      try {
        const { response } = await service.refresh(dto);
        console.log(response);

        expect(response.id).toStrictEqual(refreshDto.id);
        expect(response.appId).toStrictEqual(refreshDto.appId);
        expect(response.phone).toStrictEqual(refreshDto.phone);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
