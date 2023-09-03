import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';

export class UsersAppIdDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['appId'] as const,
) {}

export type UsersAppIdDuplicateVerificationOutputDto = {
  readonly appIdExists: string;
};

export class UsersPhoneDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['phone'] as const,
) {}

export type UsersPhoneDuplicateVerificationOutputDto = {
  readonly phoneExists: string;
};

export class UsersEmailDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['email'] as const,
) {}

export type UsersEmailDuplicateVerificationOutputDto = {
  readonly emailExists: string;
};

export class UsersNicknameDuplicateVerificationInputDto extends PickType(
  UsersBaseDto,
  ['nickname'] as const,
) {}

export type UsersNicknameDuplicateVerificationOutputDto = {
  readonly nicknameExists: string;
};
