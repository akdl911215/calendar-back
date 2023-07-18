import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalendarBaseDto {
  @IsUUID()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
    description: 'UUID',
  })
  public id!: string;

  @IsDate()
  public createdAt!: Date;

  @IsDate()
  public updatedAt!: Date;

  @IsDate()
  public deletedAt?: Date;

  @IsUUID()
  public authorId!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    default: 0,
    required: true,
    description: '할일 시간',
  })
  public date!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
    description: '할일',
  })
  public todo: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    required: true,
    description: '할일 완료 유무',
  })
  public done!: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    minimum: 1,
    required: true,
    description: '월',
  })
  public month!: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    minimum: 1,
    required: true,
    description: '일',
  })
  public day!: number;
}
