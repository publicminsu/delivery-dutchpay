import { User } from './users.interface';

export interface Room {
  id: number;

  shopName: string;
  tipInfo: TipInfo[];

  perchaserId: User;
  users: User[];

  menuInfos: Map<User, Menu[]>;

  totalPrice: number;
  totalTip: number;
}

export interface Menu {
  name: string;
  price: number;
}

export interface TipInfo {
  largerThan: number;
  price: number;
}
