import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Tip {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.id)
  room: Room;

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
