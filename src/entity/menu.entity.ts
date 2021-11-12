import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  participantId: number;

  @ManyToOne(() => Participant, participant => participant.id)
  @JoinColumn()
  participant: Participant;

  @Column()
  menu: string;

  @Column()
  price: number;
}
