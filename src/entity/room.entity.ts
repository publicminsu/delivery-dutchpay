import { Room } from '@/interfaces/room.interface';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MenuEntity } from './menu.entity';
import { UserEntity } from './user.entity';

@Entity()
export class RoomEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shop: string;

  @Column()
  date: Date;

  @Column({
    default: 0,
  })
  totalPrice: number;

  @Column({
    default: 0,
  })
  totalTip: number;

  @ManyToOne(type => UserEntity, userEntity => userEntity.id)
  @JoinColumn()
  perchaser: UserEntity;
}
