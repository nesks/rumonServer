import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';
import { Republic } from '../../republics/entities/republic.entity';

@Entity('event_republics')
export class EventRepublic {
  @ApiProperty({
    description: 'ID único da relação evento-república',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Evento',
    type: () => Event
  })
  @ManyToOne(() => Event, event => event.eventRepublics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  event_id: string;

  @ApiProperty({
    description: 'República organizadora',
    type: () => Republic
  })
  @ManyToOne(() => Republic)
  @JoinColumn({ name: 'republic_id' })
  republic: Republic;

  @Column()
  republic_id: string;

  @ApiProperty({
    description: 'Data de criação da relação',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;
} 