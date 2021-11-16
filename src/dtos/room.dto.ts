import { Menu, TipInfo } from '@/interfaces/room.interface';

export class CreateRoomDto {
  public userEmail: string;

  public shopName: string;
  public tipInfos: TipInfo[];

  public perchaserMenus: Menu[];
}

export class JoinRoomDto {
  public roomId: number;
  public userEmail: string;
}

export class AddMenuDto {
  public roomId: number;
  public userEmail: string;
  public menus: Menu[];
}
