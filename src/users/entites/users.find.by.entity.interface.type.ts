import { CalendarUsers } from '@prisma/client';

export type UsersFindByIdInputType = { readonly id: string };

export type UsersFindByIdOutputType = CalendarUsers;

export type UsersFindByAppIdInputType = { readonly appId: string };

export type UsersFindByAppIdOutputType = CalendarUsers;

export type UsersFindByNicknameInputType = { readonly nickname: string };

export type UsersFindByNicknameOutputType = CalendarUsers;

export type UsersFindByPhoneInputType = { readonly phone: string };

export type UsersFindByPhoneOutputType = CalendarUsers;

export type UsersFindByEmailInputType = { readonly email: string };

export type UsersFindByEmailOutputType = CalendarUsers;

export type UsersFindByIdOrNicknameInputType = {
  readonly id: string;
  readonly nickname: string;
};

export type UsersFindByIdOrNicknameOutputType = CalendarUsers;

export type UsersFindByIdOrPhoneInputType = {
  readonly id: string;
  readonly phone: string;
};

export type UsersFindByIdOrPhoneOutputType = CalendarUsers;

export type UsersFindByIdOrEmailInputType = {
  readonly id: string;
  readonly email: string;
};

export type UsersFindByIdOrEmailOutputType = CalendarUsers;
