import { InternalServerErrorException } from '@nestjs/common';

export function errorHandling(e: any): void {
  if (e instanceof InternalServerErrorException) {
    throw new InternalServerErrorException(e);
  } else {
    throw new Error(`${e}`);
  }
}
