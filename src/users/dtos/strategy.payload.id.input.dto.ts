import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';

export class StrategyPayloadIdInputDto extends PickType(UsersBaseDto, ['id']) {}
