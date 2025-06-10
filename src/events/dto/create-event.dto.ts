import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsUUID, IsArray, IsEnum, IsUrl } from 'class-validator';
import { EventVisibility } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({
    description: 'Nome do evento',
    example: 'Show de Rock na República'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição do evento',
    example: 'Grande show de rock com bandas locais',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Data do evento no formato YYYY-MM-DD',
    example: '2024-12-25'
  })
  @IsDateString()
  eventDate: string;

  @ApiProperty({
    description: 'Hora do evento no formato HH:MM',
    example: '20:30'
  })
  @IsString()
  eventTime: string;

  @ApiProperty({
    description: 'Local do evento',
    example: 'Pátio da República dos Estudantes'
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Link da imagem ou vídeo do evento',
    example: 'https://storage.example.com/events/rock-show.jpg',
    required: false
  })
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @ApiProperty({
    description: 'Visibilidade do evento',
    enum: EventVisibility,
    example: 'aberto',
    required: false
  })
  @IsOptional()
  @IsEnum(EventVisibility)
  visibility?: EventVisibility;

  @ApiProperty({
    description: 'ID do tipo do evento',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  event_type_id: string;

  @ApiProperty({
    description: 'IDs das repúblicas organizadoras',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String]
  })
  @IsArray()
  @IsUUID(4, { each: true })
  republic_ids: string[];

  @ApiProperty({
    description: 'IDs dos usuários convidados (para eventos fechados)',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  invited_user_ids?: string[];
} 