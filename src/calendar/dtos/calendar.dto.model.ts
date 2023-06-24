import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarDtoModel {
  @IsUUID()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
  })
  public id!: string;

  @IsNumber()
  public createdAt!: number;

  @IsNumber()
  public updatedAt!: number;

  @IsNumber()
  public deletedAt?: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
  })
  public authorId!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    default: 0,
    required: true,
  })
  public date!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
  })
  public todo: string;

  @IsBoolean()
  public done!: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  public month!: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  public day!: number;
}
