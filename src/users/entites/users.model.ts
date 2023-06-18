import { BaseCommonCoreDto } from '../../_common/dtos/base.common.core.dto';

export class UsersModel extends BaseCommonCoreDto {
  private appId!: string;
  private nickname!: string;
  private password!: string;
  private phone!: string;
  private refreshToken?: string;

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
