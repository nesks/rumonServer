import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { EventType } from './event-type.entity';
import { EventRepublic } from './event-republic.entity';
import { EventInvite } from './event-invite.entity';

export enum EventStatus {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado'
}

export enum EventVisibility {
  ABERTO = 'aberto',
  FECHADO = 'fechado'
}

@Entity('events')
export class Event {
  @ApiProperty({
    description: 'ID único do evento',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome do evento',
    example: 'Show de Rock na República'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Descrição do evento',
    example: 'Grande show de rock com bandas locais',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Data do evento',
    example: '2024-12-25'
  })
  @Column({ type: 'date' })
  eventDate: Date;

  @ApiProperty({
    description: 'Hora do evento',
    example: '20:30'
  })
  @Column({ type: 'time' })
  eventTime: string;

  @ApiProperty({
    description: 'Local do evento',
    example: 'Pátio da República dos Estudantes'
  })
  @Column()
  location: string;

  @ApiProperty({
    description: 'Link da imagem ou vídeo do evento',
    example: 'https://storage.example.com/events/rock-show.jpg',
    required: false
  })
  @Column({ nullable: true })
  mediaUrl: string;

  @ApiProperty({
    description: 'Visibilidade do evento',
    enum: EventVisibility,
    example: 'aberto'
  })
  @Column({ type: 'enum', enum: EventVisibility, default: EventVisibility.ABERTO })
  visibility: EventVisibility;

  @ApiProperty({
    description: 'Status do evento',
    enum: EventStatus,
    example: 'pendente'
  })
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.PENDENTE })
  status: EventStatus;

  @ApiProperty({
    description: 'Motivo da rejeição (se aplicável)',
    example: 'Data conflita com outro evento',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ApiProperty({
    description: 'Usuário criador do evento',
    type: () => User
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column()
  created_by_id: string;

  @ApiProperty({
    description: 'Tipo do evento',
    type: () => EventType
  })
  @ManyToOne(() => EventType, eventType => eventType.events)
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventType;

  @Column()
  event_type_id: string;

  @ApiProperty({
    description: 'Repúblicas organizadoras do evento',
    type: () => [EventRepublic]
  })
  @OneToMany(() => EventRepublic, eventRepublic => eventRepublic.event)
  eventRepublics: EventRepublic[];

  @ApiProperty({
    description: 'Convites do evento',
    type: () => [EventInvite]
  })
  @OneToMany(() => EventInvite, eventInvite => eventInvite.event)
  eventInvites: EventInvite[];

  @ApiProperty({
    description: 'Data de criação do evento',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do evento',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 