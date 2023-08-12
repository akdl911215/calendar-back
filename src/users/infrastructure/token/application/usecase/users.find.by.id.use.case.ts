// import { BadRequestException, Inject, Injectable } from '@nestjs/common';
// import {
//   UsersFindByIdInputDto,
//   UsersFindByIdOutputDto,
// } from '../../../../domain/interfaces/dto/users.find.by.id.dto';
// import { UsersFindByEntityInterface } from '../../../../domain/interfaces/users.find.by.interfaces';
// import { UNIQUE_ID_REQUIRED } from '../../../../../_common/constants/http/errors/400';
// import { PrismaService } from '../../../../../_common/infrastructure/prisma/prisma.service';
// import { Users } from '@prisma/client';
//
// @Injectable()
// export class UsersFindByIdUseCase implements UsersFindByEntityInterface {
//   constructor(private readonly prisma: PrismaService) {}
//
//   public async usersFindById(
//     dto: UsersFindByIdInputDto,
//   ): Promise<UsersFindByIdOutputDto> {
//     const { id } = dto;
//     if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
//
//     const userFindById: Users = await this.prisma.users.findUnique({
//       where: { id },
//     });
//
//     return { response: userFindById };
//   }
// }
