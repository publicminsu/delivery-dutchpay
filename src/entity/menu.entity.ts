import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity()
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RoomEntity, roomEntity => roomEntity.id)
  room: RoomEntity;

  @ManyToOne(type => UserEntity, userEntity => userEntity.id)
  user: UserEntity;

  @Column()
  menu: string;

  @Column()
  price: number;
}
