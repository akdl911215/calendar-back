import {
  UsersAppIdDuplicateVerificationInputType,
  UsersAppIdDuplicateVerificationOutputType,
  UsersEmailDuplicateVerificationInputType,
  UsersEmailDuplicateVerificationOutputType,
  UsersNicknameDuplicateVerificationInputType,
  UsersNicknameDuplicateVerificationOutputType,
  UsersPhoneDuplicateVerificationInputType,
  UsersPhoneDuplicateVerificationOutputType,
} from '../entites/users.duplicate.verification.entity.interface.type';

export interface UsersDuplicateVerificationEntityInterface {
  readonly appIdDuplicateVerification: (
    entity: UsersAppIdDuplicateVerificationInputType,
  ) => Promise<UsersAppIdDuplicateVerificationOutputType>;

  readonly phoneDuplicateVerification: (
    entity: UsersPhoneDuplicateVerificationInputType,
  ) => Promise<UsersPhoneDuplicateVerificationOutputType>;

  readonly emailDuplicateVerification: (
    entity: UsersEmailDuplicateVerificationInputType,
  ) => Promise<UsersEmailDuplicateVerificationOutputType>;

  readonly nicknameDuplicateVerification: (
    entity: UsersNicknameDuplicateVerificationInputType,
  ) => Promise<UsersNicknameDuplicateVerificationOutputType>;
}
