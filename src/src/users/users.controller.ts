import { Controller, Inject } from '@nestjs/common';
import { UsersInterface } from './interfaces/users.interface';

@Controller('users')
export class UsersController {
  constructor(@Inject('SERVICE') private readonly service: UsersInterface) {}
}
