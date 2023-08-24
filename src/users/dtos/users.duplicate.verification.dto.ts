import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';

export class UsersAppIdDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['appId'] as const,
) {}

export type UsersAppIdDuplicateVerificationOutputDto = {
  readonly appIdExists: boolean;
};

export class UsersPhoneDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['phone'] as const,
) {}

export type UsersPhoneDuplicateVerificationOutputDto = {
  readonly phoneExists: boolean;
};

export class UsersEmailDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['email'] as const,
) {}

export type UsersEmailDuplicateVerificationOutputDto = {
  readonly emailExists: boolean;
};

export class UsersNicknameDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['nickname'] as const,
) {}

export type UsersNicknameDuplicateVerificationOutputDto = {
  readonly nicknameExists: boolean;
};
