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

  public setId(id: string): void {
    this.id = id;
  }
  public getId(): string {
    return this.id;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setDeletedAt(deletedAt: Date): void {
    this.deletedAt = deletedAt;
  }
  public getDeletedAt(): Date {
    return this.deletedAt;
  }
}
