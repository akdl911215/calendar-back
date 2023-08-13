import { BaseCommonCoreDto } from '../../_common/dtos/base.common.core.dto';

export class UsersModel extends BaseCommonCoreDto {
  private appId!: string;
  private nickname!: string;
  private password!: string;
  private phone!: string;
  private email!: string;
  private refreshToken?: string;

  public setUsersFindById(param: { id: string }): void {
    super.setId(param.id);
  }
  public getUsersFindById(): { id: string } {
    return { id: super.getId() };
  }

  public setRefreshTokenReIssuance(param: {
    id: string;
    appId: string;
    phone: string;
  }): void {
    super.setId(param.id);
    this.appId = param.appId;
    this.phone = param.phone;
  }
  public getRefreshTokenReIssuance(): {
    id: string;
    appId: string;
    phone: string;
  } {
    return {
      id: super.getId(),
      appId: this.appId,
      phone: this.phone,
    };
  }

  public setProfile(param: { id: string }): void {
    super.setId(param.id);
  }
  public getProfile(): { id: string } {
    return {
      id: super.getId(),
    };
  }

  public setLogout(param: { id: string }): void {
    super.setId(param.id);
  }
  public getLogout(): { id: string } {
    return {
      id: super.getId(),
    };
  }

  public setLogin(param: { appId: string; password: string }): void {
    this.appId = param.appId;
    this.password = param.password;
  }
  public getLogin(): { appId: string; password: string } {
    return {
      appId: this.appId,
      password: this.password,
    };
  }

  public set _updateNickname(param: { id: string; nickname: string }) {
    super.setId(param.id);
    this.nickname = param.nickname;
  }
  public get _updateNickname(): {
    id: string;
    nickname: string;
  } {
    return {
      id: super.getId(),
      nickname: this.nickname,
    };
  }

  public set _updatePhone(param: { id: string; phone: string }) {
    super.setId(param.id);
    this.phone = param.phone;
  }
  public get _updatePhone(): {
    id: string;
    phone: string;
  } {
    return {
      id: super.getId(),
      phone: this.phone,
    };
  }

  public setInquiry(param: { id: string }): void {
    super.setId(param.id);
  }
  public getInquiry(): { id: string } {
    return {
      id: super.getId(),
    };
  }

  public set _delete(param: { id: string }) {
    super.setId(param.id);
  }
  public get _delete(): { id: string } {
    return {
      id: super.getId(),
    };
  }

  public set _create(param: {
    appId: string;
    phone: string;
    nickname: string;
    password: string;
    email: string;
  }) {
    const { appId, phone, nickname, password, email } = param;
    this.appId = appId;
    this.phone = phone;
    this.nickname = nickname;
    this.password = password;
    this.email = email;
  }
  public get _create(): {
    appId: string;
    phone: string;
    nickname: string;
    password: string;
    email: string;
  } {
    return {
      appId: this.appId,
      phone: this.phone,
      nickname: this.nickname,
      password: this.password,
      email: this.email,
    };
  }

  public setCompareCurrentPasswordAndPassword(param: { id: string }): void {
    super.setId(param.id);
  }
  public getCompareCurrentPasswordAndPassword(): { id: string } {
    return {
      id: super.getId(),
    };
  }
}
