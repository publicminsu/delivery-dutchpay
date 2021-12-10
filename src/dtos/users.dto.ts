import { User } from '@/entity/user.entity';
import { Contains, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  public studentId: number;

  @IsString()
  public phone: string;

  @IsString()
  public nickname: string;

  @IsString()
  public password: string;

  @Contains('@hknu.ac.kr')
  @IsEmail({ allow_utf8_local_part: false }) //잘 적용되는거 같습니다. hknu.ac.kr이여야합니다.
  public email: string;
}
export class LoginUserDto {
  @Contains('@hknu.ac.kr')
  @IsEmail({ allow_utf8_local_part: false })
  public email: string;
  @IsString()
  public password: string;
}
export class reportUserDto {
  @IsNumber()
  public reportType: number;
}
export class estimateDto {
  @IsNumber()
  public targetUserId: number;
  @IsNumber()
  public score: number;
}
export interface RequestWithUser extends Request {
  user: User;
}
