import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventStatusDto {
  @ApiProperty({
    description: 'Novo status do evento',
    enum: EventStatus,
    example: 'aprovado'
  })
  @IsEnum(EventStatus)
  status: EventStatus;

  @ApiProperty({
    description: 'Motivo da rejeição (obrigatório se status for rejeitado)',
    example: 'Data conflita com outro evento',
    required: false
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
} 