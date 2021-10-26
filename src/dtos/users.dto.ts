import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  public studentId: number;

  @IsString()
  public phone: string;

  @IsString()
  public nickname: string;

  @IsString()
  public password: string;

  @IsEmail()
  public email: string;
}
