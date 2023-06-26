import { PickType } from '@nestjs/swagger';
import { UsersDtoModel } from './users.dto.model';

export class StrategyPayloadIdInputDto extends PickType(UsersDtoModel, [
  'id',
]) {}
