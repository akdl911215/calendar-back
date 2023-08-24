import {
  UsersAppIdDuplicateVerificationInputDto,
  UsersAppIdDuplicateVerificationOutputDto,
  UsersEmailDuplicateVerificationInputDto,
  UsersEmailDuplicateVerificationOutputDto,
  UsersNicknameDuplicateVerificationInputDto,
  UsersNicknameDuplicateVerificationOutputDto,
  UsersPhoneDuplicateVerificationInputDto,
  UsersPhoneDuplicateVerificationOutputDto,
} from '../dtos/users.duplicate.verification.dto';

export interface UsersDuplicateVerificationDtoInterface {
  readonly appIdDuplicateVerification: (
    dto: UsersAppIdDuplicateVerificationInputDto,
  ) => Promise<UsersAppIdDuplicateVerificationOutputDto>;

  readonly phoneDuplicateVerification: (
    dto: UsersPhoneDuplicateVerificationInputDto,
  ) => Promise<UsersPhoneDuplicateVerificationOutputDto>;

  readonly emailDuplicateVerification: (
    dto: UsersEmailDuplicateVerificationInputDto,
  ) => Promise<UsersEmailDuplicateVerificationOutputDto>;

  readonly nicknameDuplicateVerification: (
    dto: UsersNicknameDuplicateVerificationInputDto,
  ) => Promise<UsersNicknameDuplicateVerificationOutputDto>;
}
