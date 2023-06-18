import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    { provide: 'SERVICE', useClass: UsersService },
    { provide: 'REPOSITORY', useClass: UsersRepository },
  ],
})
export class UsersModule {}
