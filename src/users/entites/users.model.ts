import { BaseCommonCoreDto } from '../../_common/dtos/base.common.core.dto';

export class UsersModel extends BaseCommonCoreDto {
  private appId!: string;
  private nickname!: string;
  private password!: string;
  private phone!: string;
  private email!: string;
  private refreshToken?: string;

  public set _usersFindById(param: { readonly id: string }) {
    super._id = { id: param.id };
  }
  public get _usersFindById(): { readonly id: string } {
    return { id: super._id.id };
  }

  public set _refreshTokenReIssuance(params: {
    readonly id: string;
    readonly appId: string;
    readonly phone: string;
  }) {
    super._id = { id: params.id };
    this.appId = params.appId;
    this.phone = params.phone;
  }
  public get _refreshTokenReIssuance(): {
    readonly id: string;
    readonly appId: string;
    readonly phone: string;
  } {
    return {
      id: super._id.id,
      appId: this.appId,
      phone: this.phone,
    };
  }

  public set _profile(param: { readonly id: string }) {
    super._id = { id: param.id };
  }
  public get _profile(): { readonly id: string } {
    return {
      id: super._id.id,
    };
  }

  public set _logout(param: { readonly id: string }) {
    super._id = { id: param.id };
  }
  public get _logout(): { readonly id: string } {
    return {
      id: super._id.id,
    };
  }

  public set _login(params: {
    readonly appId: string;
    readonly password: string;
  }) {
    this.appId = params.appId;
    this.password = params.password;
  }
  public get _login(): { readonly appId: string; readonly password: string } {
    return {
      appId: this.appId,
      password: this.password,
    };
  }

  public set _updateNickname(params: {
    readonly id: string;
    readonly nickname: string;
  }) {
    super._id = { id: params.id };
    this.nickname = params.nickname;
  }
  public get _updateNickname(): {
    readonly id: string;
    readonly nickname: string;
  } {
    return {
      id: super._id.id,
      nickname: this.nickname,
    };
  }

  public set _updatePhone(params: {
    readonly id: string;
    readonly phone: string;
  }) {
    super._id = { id: params.id };
    this.phone = params.phone;
  }
  public get _updatePhone(): {
    id: string;
    phone: string;
  } {
    return {
      id: super._id.id,
      phone: this.phone,
    };
  }

  public set _updateEmail(params: {
    readonly id: string;
    readonly email: string;
  }) {
    super._id = { id: params.id };
    this.email = params.email;
  }
  public get _updateEmail(): { readonly id: string; readonly email: string } {
    return {
      id: this._id.id,
      email: this.email,
    };
  }

  public set _reIssuancePassword(params: {
    readonly id: string;
    readonly password: string;
  }) {
    super._id = { id: params.id };
    this.password = params.password;
  }
  public get _reIssuancePassword(): {
    readonly id: string;
    readonly password: string;
  } {
    return {
      id: super._id.id,
      password: this.password,
    };
  }

  public set _inquiry(param: { readonly id: string }) {
    super._id = { id: param.id };
  }
  public get _inquiry(): { readonly id: string } {
    return {
      id: super._id.id,
    };
  }

  public set _delete(param: { id: string }) {
    super._id = { id: param.id };
  }
  public get _delete(): { id: string } {
    return {
      id: super._id.id,
    };
  }

  public set _create(params: {
    readonly appId: string;
    readonly phone: string;
    readonly nickname: string;
    readonly password: string;
    readonly email: string;
  }) {
    const { appId, phone, nickname, password, email } = params;
    this.appId = appId;
    this.phone = phone;
    this.nickname = nickname;
    this.password = password;
    this.email = email;
  }
  public get _create(): {
    readonly appId: string;
    readonly phone: string;
    readonly nickname: string;
    readonly password: string;
    readonly email: string;
  } {
    return {
      appId: this.appId,
      phone: this.phone,
      nickname: this.nickname,
      password: this.password,
      email: this.email,
    };
  }

  public set _compareCurrentPasswordAndPassword(param: {
    readonly id: string;
  }) {
    super._id = { id: param.id };
  }
  public get _compareCurrentPasswordAndPassword(): { readonly id: string } {
    return {
      id: super._id.id,
    };
  }
}
