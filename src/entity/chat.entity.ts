import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  roomId: number;
  @Column()
  userId: number;
  @Column()
  text: string;
  @Column()
  time: Date;
}
