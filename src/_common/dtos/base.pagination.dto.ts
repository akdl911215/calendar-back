import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseOffsetPaginationInputDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    default: 1,
  })
  public readonly page!: number;

  // 리스트 행 개수
  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    default: 10,
  })
  public readonly take!: number;
}

export class BaseCursorPaginationInputDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    default: 1,
  })
  public readonly take!: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    default: '',
  })
  public readonly id?: string;
}

export class BasePaginationOffsetOutputDto<T> {
  @IsNumber()
  public readonly currentPage!: number;

  @IsNumber()
  public readonly resultLastPage!: number;

  @IsNumber()
  public readonly resultTotalPage!: number;

  @IsArray()
  public readonly currentList!: T[];
}
