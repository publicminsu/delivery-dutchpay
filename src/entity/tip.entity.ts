import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity()
export class TipEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RoomEntity, roomEntity => roomEntity.id)
  room: RoomEntity;

  @Column({
    type: 'int',
    nullable: false,
  })
  largerThan: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  price: number;
}
