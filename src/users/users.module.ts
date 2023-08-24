import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { TokenModule } from './infrastructure/token/token.module';
import { AccessTokenStrategy } from './infrastructure/token/strategys/access.token.strategy';
import { RefreshTokenStrategy } from './infrastructure/token/strategys/refresh.token.strategy';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { UsersCompareCurrentPasswordAndPasswordRepository } from './infrastructure/repository/users.compare.current.password.and.password.repository';

@Module({
  imports: [TokenModule],
  controllers: [UsersController],
  providers: [
    // infrastructure
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,

    // service
    { provide: 'SERVICE', useClass: UsersService },
    { provide: 'REFRESH_TOKEN_SERVICE', useClass: UsersService },
    { provide: 'HASH_ENCODED', useClass: HashEncodedService },
    { provide: 'HASH_DECODED', useClass: HashDecodedService },
    { provide: 'DUPLICATE_VERIFICATION_SERVICE', useClass: UsersService },

    // repository
    { provide: 'REPOSITORY', useClass: UsersRepository },
    { provide: 'FIND_BY_REPOSITORY', useClass: UsersRepository },
    { provide: 'REFRESH_TOKEN_REPOSITORY', useClass: UsersRepository },
    { provide: 'DUPLICATE_VERIFICATION_REPOSITORY', useClass: UsersRepository },

    {
      provide: 'COMPARE_CURRENT_PASSWORD_AND_PASSWORD',
      useClass: UsersCompareCurrentPasswordAndPasswordRepository,
    },
  ],
  exports: [
    {
      provide: 'COMPARE_CURRENT_PASSWORD_AND_PASSWORD',
      useClass: UsersCompareCurrentPasswordAndPasswordRepository,
    },
  ],
})
export class UsersModule {}
