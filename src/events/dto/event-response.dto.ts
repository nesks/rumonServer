import { ApiProperty } from '@nestjs/swagger';
import { EventVisibility, EventStatus } from '../entities/event.entity';

class UserResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'João Silva' })
  apelido: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg' })
  linkfotoPerfil: string;
}

class EventTypeResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'Festa' })
  name: string;

  @ApiProperty({ example: '#FF0000' })
  color: string;
}

class RepublicResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'República dos Artistas' })
  name: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg' })
  linkFoto: string;
}

class EventRepublicResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ type: RepublicResponseDto })
  republic: RepublicResponseDto;
}

export class EventResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'Festa de Aniversário' })
  name: string;

  @ApiProperty({ example: 'Venha celebrar conosco!' })
  description: string;

  @ApiProperty({ example: '2024-03-15' })
  eventDate: Date;

  @ApiProperty({ example: '19:00' })
  eventTime: string;

  @ApiProperty({ example: 'Rua das Flores, 123' })
  location: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg', nullable: true })
  mediaUrl: string;

  @ApiProperty({ enum: EventVisibility, example: EventVisibility.ABERTO })
  visibility: EventVisibility;

  @ApiProperty({ enum: EventStatus, example: EventStatus.APROVADO })
  status: EventStatus;

  @ApiProperty({ example: 'Evento não atende aos critérios', nullable: true })
  rejectionReason: string;

  @ApiProperty({ type: UserResponseDto })
  createdBy: UserResponseDto;

  @ApiProperty({ type: EventTypeResponseDto })
  eventType: EventTypeResponseDto;

  @ApiProperty({ type: [EventRepublicResponseDto] })
  eventRepublics: EventRepublicResponseDto[];

  @ApiProperty({ example: '2024-03-15T19:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-15T19:00:00Z' })
  updatedAt: Date;
} 