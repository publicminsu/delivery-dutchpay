import { Menu } from '@/entity/menu.entity';
import { Tip } from '@/entity/tip.entity';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsEmail({ allow_utf8_local_part: false })
  public userEmail: string;
  @IsString()
  public shopName: string;
  @IsEnum(Tip)
  public tipInfos: Tip[];
  @IsEnum(Menu)
  public perchaserMenus: Menu[];
}

export class JoinRoomDto {
  @IsNumber()
  public roomId: number;
  @IsString()
  public userEmail: string;
}

export class AddMenuDto {
  @IsNumber()
  public roomId: number;
  @IsString()
  public userEmail: string;
  @IsEnum(Menu)
  public menus: Menu[];
}
