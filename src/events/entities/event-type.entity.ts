import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity('event_types')
export class EventType {
  @ApiProperty({
    description: 'ID único do tipo de evento',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome do tipo de evento',
    example: 'rock'
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Descrição do tipo de evento',
    example: 'Eventos de música rock com bandas',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Cor hexadecimal para identificação visual',
    example: '#FF6B6B',
    required: false
  })
  @Column({ nullable: true })
  color: string;

  @ApiProperty({
    description: 'Se apenas um evento deste tipo pode ocorrer por dia',
    example: true
  })
  @Column({ default: false })
  onePerDay: boolean;

  @ApiProperty({
    description: 'Quantos meses antes o evento pode ser agendado',
    example: 6,
    required: false
  })
  @Column({ nullable: true })
  monthsInAdvance: number;

  @ApiProperty({
    description: 'Se eventos deste tipo precisam de aprovação',
    example: true
  })
  @Column({ default: false })
  requiresApproval: boolean;

  @OneToMany(() => Event, event => event.eventType)
  events: Event[];

  @ApiProperty({
    description: 'Data de criação do tipo de evento',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do tipo de evento',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 