export type UsersAppIdDuplicateVerificationInputType = {
  readonly appId: string;
};

export type UsersAppIdDuplicateVerificationOutputType = {
  readonly appIdExists: string;
};

export type UsersPhoneDuplicateVerificationInputType = {
  readonly phone: string;
};

export type UsersPhoneDuplicateVerificationOutputType = {
  readonly phoneExists: string;
};

export type UsersEmailDuplicateVerificationInputType = {
  readonly email: string;
};

export type UsersEmailDuplicateVerificationOutputType = {
  readonly emailExists: string;
};

export type UsersNicknameDuplicateVerificationInputType = {
  readonly nickname: string;
};

export type UsersNicknameDuplicateVerificationOutputType = {
  readonly nicknameExists: string;
};
