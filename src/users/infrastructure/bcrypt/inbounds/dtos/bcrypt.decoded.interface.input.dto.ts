import { IsNotEmpty, IsString } from 'class-validator';

export class BcryptDecodedInterfaceInputDto {
  @IsString()
  @IsNotEmpty()
  public readonly password!: string;

  @IsString()
  @IsNotEmpty()
  public readonly hashPassword!: string;
}
