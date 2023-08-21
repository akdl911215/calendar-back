import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { CalendarUsers } from '@prisma/client';

export class UsersProfileInputDto extends PickType(UsersBaseDto, [
  'id',
] as const) {}

export type UsersProfileOutputDto = CalendarUsers;
