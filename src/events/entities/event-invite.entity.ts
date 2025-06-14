import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';
import { User } from '../../users/entities/user.entity';

export enum InviteStatus {
  PENDENTE = 'pendente',
  ACEITO = 'aceito',
  RECUSADO = 'recusado'
}

@Entity('event_invites')
export class EventInvite {
  @ApiProperty({
    description: 'ID único do convite',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Evento',
    type: () => Event
  })
  @ManyToOne(() => Event, event => event.eventInvites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  event_id: string;

  @ApiProperty({
    description: 'Usuário convidado',
    type: () => User
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ApiProperty({
    description: 'Status do convite',
    enum: InviteStatus,
    example: 'pendente'
  })
  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.PENDENTE
  })
  status: InviteStatus;

  @ApiProperty({
    description: 'Data de criação do convite',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do convite',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 