import { Menu, TipInfo } from '@/interfaces/room.interface';

export class CreateRoomDto {
  public userEmail: string;

  public shopName: string;
  public tipInfos: TipInfo[];

  public perchaserMenus: Menu[];
}
