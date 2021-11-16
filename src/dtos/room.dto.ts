import { Menu, TipInfo } from '@/interfaces/room.interface';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  public userEmail: string;

  @IsString()
  public shopName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => TipInfo)
  public tipInfos: TipInfo[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => Menu)
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

  @IsArray()
  @Type(() => Menu)
  public menus: Menu[];
}
