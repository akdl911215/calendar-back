import { BaseCommonCoreDto } from '../../_common/dtos/base.common.core.dto';

export class UsersModel extends BaseCommonCoreDto {
  private appId!: string;
  private nickname!: string;
  private password!: string;
  private phone!: string;
  private refreshToken?: string;

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

  public setUpdate(param: {
    id: string;
    appId: string;
    nickname?: string;
    password?: string;
    phone?: string;
  }): void {
    super.setId(param.id);
    this.appId = param.appId;
    this.nickname = param.nickname;
    this.password = param.password;
    this.phone = param.phone;
  }
  public getUpdate(): {
    id: string;
    appId: string;
    nickname?: string;
    password?: string;
    phone?: string;
  } {
    return {
      id: super.getId(),
      appId: this.appId,
      nickname: this.nickname,
      password: this.password,
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

  public setDelete(param: { id: string }): void {
    super.setId(param.id);
  }
  public getDelete(): { id: string } {
    return {
      id: super.getId(),
    };
  }

  public setCreate(param: {
    appId: string;
    phone: string;
    nickname: string;
    password: string;
  }): void {
    const { appId, phone, nickname, password } = param;
    this.appId = appId;
    this.phone = phone;
    this.nickname = nickname;
    this.password = password;
  }
  public getCreate(): {
    appId: string;
    phone: string;
    nickname: string;
    password: string;
  } {
    return {
      appId: this.appId,
      phone: this.phone,
      nickname: this.nickname,
      password: this.password,
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
