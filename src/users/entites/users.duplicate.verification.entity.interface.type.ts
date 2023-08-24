export type UsersAppIdDuplicateVerificationInputType = {
  readonly appId: string;
};

export type UsersAppIdDuplicateVerificationOutputType = {
  readonly appIdExists: boolean;
};

export type UsersPhoneDuplicateVerificationInputType = {
  readonly phone: string;
};

export type UsersPhoneDuplicateVerificationOutputType = {
  readonly phoneExists: boolean;
};

export type UsersEmailDuplicateVerificationInputType = {
  readonly email: string;
};

export type UsersEmailDuplicateVerificationOutputType = {
  readonly emailExists: boolean;
};

export type UsersNicknameDuplicateVerificationInputType = {
  readonly nickname: string;
};

export type UsersNicknameDuplicateVerificationOutputType = {
  readonly nicknameExists: boolean;
};
