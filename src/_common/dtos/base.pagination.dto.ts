import { IsArray, IsNumber, IsOptional } from 'class-validator';
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

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  public readonly lastId?: number;
}

export class BaseOffsetPaginationOutputDto<T> {
  @IsNumber()
  public readonly currentPage!: number;

  @IsNumber()
  public readonly totalPages!: number;

  @IsNumber()
  public readonly totalTake!: number;

  @IsArray()
  public readonly currentList!: T[];
}
