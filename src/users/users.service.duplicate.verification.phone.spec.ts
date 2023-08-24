import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersPhoneDuplicateVerificationInputDto } from './dtos/users.duplicate.verification.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException } from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';
import { PHONE_REQUIRED } from '../_common/https/errors/400';

describe('Users Phone Duplicate Verification Process', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'REPOSITORY',
          useClass: UsersRepository,
        },
        PrismaService,
        {
          provide: 'HASH_ENCODED',
          useClass: HashEncodedService,
        },
        { provide: 'HASH_DECODED', useClass: HashDecodedService },
        { provide: 'TOKEN_SERVICE', useClass: TokenService },
        ConfigService,
        JwtService,
        {
          provide: 'FIND_BY_REPOSITORY',
          useClass: UsersRepository,
        },
        {
          provide: 'REFRESH_TOKEN_REPOSITORY',
          useClass: UsersRepository,
        },
        {
          provide: 'DUPLICATE_VERIFICATION_REPOSITORY',
          useClass: UsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('user phone duplicate verification unit test', () => {
    it('phone empty, so it fails', async () => {
      const dto: UsersPhoneDuplicateVerificationInputDto = {
        phone: '',
      };

      try {
        await service.phoneDuplicateVerification(dto);
      } catch (e: any) {
        if (e instanceof BadRequestException) {
          const { response, status } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: PHONE_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('success should user duplicate verification', async () => {
      const dto: UsersPhoneDuplicateVerificationInputDto = {
        phone: 'testing',
      };

      const findUniqueDto = {
        id: '',
        app_id: 'appId',
        nickname: 'nick',
        password: 'qwer!@34',
        phone: dto.phone,
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(findUniqueDto);

      try {
        const { phoneExists } = await service.phoneDuplicateVerification(dto);
        expect(phoneExists).toStrictEqual(true);
        expect(findUniqueMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);
      }
    });
  });
});
