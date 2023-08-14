import { IsDate, IsUUID } from 'class-validator';

export abstract class BaseCommonCoreDto {
  @IsUUID()
  private id!: string;

  @IsDate()
  private createdAt!: Date;

  @IsDate()
  private updatedAt!: Date;

  @IsDate()
  private deletedAt?: Date;

  public set _id(param: { readonly id: string }) {
    this.id = param.id;
  }
  public get _id(): { readonly id: string } {
    return { id: this.id };
  }

  public set _createdAt(param: { readonly createdAt: Date }) {
    this.createdAt = param.createdAt;
  }
  public get _createdAt(): { readonly createdAt: Date } {
    return { createdAt: this.createdAt };
  }

  public set _updatedAt(param: { readonly updatedAt: Date }) {
    this.updatedAt = param.updatedAt;
  }
  public get _updatedAt(): { readonly updatedAt: Date } {
    return {
      updatedAt: this.updatedAt,
    };
  }

  public set _deletedAt(param: { readonly deletedAt: Date }) {
    this.deletedAt = param.deletedAt;
  }
  public get _deletedAt(): { readonly deletedAt: Date } {
    return {
      deletedAt: this.deletedAt,
    };
  }
}
