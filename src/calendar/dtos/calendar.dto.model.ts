import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarDtoModel {
  @IsUUID()
  public id!: string;

  @IsNumber()
  public createdAt!: number;

  @IsNumber()
  public updatedAt!: number;

  @IsNumber()
  public deletedAt?: number;

  @IsUUID()
  public authorId!: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    default: 0,
    required: true,
  })
  public date!: number;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
  })
  public todo: string;

  @IsBoolean()
  public done!: boolean;

  @IsNumber()
  public month!: number;

  @IsNumber()
  public day!: number;
}
