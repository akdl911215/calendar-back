import { IsNumber, IsUUID } from 'class-validator';

export abstract class BaseCommonCoreDto {
  @IsUUID()
  private id!: string;

  @IsNumber()
  private createdAt!: number;

  @IsNumber()
  private updatedAt!: number;

  @IsNumber()
  private deletedAt?: number;

  public setId(id: string): void {
    this.id = id;
  }
  public getId(): string {
    return this.id;
  }

  public setCreatedAt(createdAt: number): void {
    this.createdAt = createdAt;
  }
  public getCreatedAt(): number {
    return this.createdAt;
  }

  public setUpdatedAt(updatedAt: number): void {
    this.updatedAt = updatedAt;
  }
  public getUpdatedAt(): number {
    return this.updatedAt;
  }

  public setDeletedAt(deletedAt: number): void {
    this.deletedAt = deletedAt;
  }
  public getDeletedAt(): number {
    return this.deletedAt;
  }
}
