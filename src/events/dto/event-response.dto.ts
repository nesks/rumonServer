import { ApiProperty } from '@nestjs/swagger';
import { EventVisibility, EventStatus } from '../entities/event.entity';

class UserResponseDto {
  @ApiProperty({ example: 'fd36f7cd-6e48-40b8-8f50-a7c29a34bfcb' })
  id: string;

  @ApiProperty({ example: 'nesks' })
  apelido: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg' })
  linkfotoPerfil: string;
}

class EventTypeResponseDto {
  @ApiProperty({ example: '6389d3b2-e5b3-4ec4-b818-811a21fb5acc' })
  id: string;

  @ApiProperty({ example: 'rock' })
  name: string;

  @ApiProperty({ example: '#FF6B6B' })
  color: string;
}

class RepublicResponseDto {
  @ApiProperty({ example: 'b86ffa63-a5d0-42c0-a2cf-62f4c638680c' })
  id: string;

  @ApiProperty({ example: 'Alambique' })
  name: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg' })
  linkFoto: string;
}

class EventRepublicResponseDto {
  @ApiProperty({ example: '42d7381d-7469-4ebb-baa4-f513544298d8' })
  id: string;

  @ApiProperty({ type: () => RepublicResponseDto })
  republic: RepublicResponseDto;
}

export class EventResponseDto {
  @ApiProperty({ example: 'd2e0f37b-670c-45d2-a6ab-ddc8d9d76471' })
  id: string;

  @ApiProperty({ example: 'Teste' })
  name: string;

  @ApiProperty({ example: 'Teste' })
  description: string;

  @ApiProperty({ example: '2025-06-22' })
  eventDate: Date;

  @ApiProperty({ example: '21:00:00' })
  eventTime: string;

  @ApiProperty({ example: 'Teste' })
  location: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg' })
  mediaUrl: string;

  @ApiProperty({ enum: EventVisibility, example: EventVisibility.ABERTO })
  visibility: EventVisibility;

  @ApiProperty({ enum: EventStatus, example: EventStatus.PENDENTE })
  status: EventStatus;

  @ApiProperty({ example: null })
  rejectionReason: string | null;

  @ApiProperty({ type: () => UserResponseDto })
  createdBy: UserResponseDto;

  @ApiProperty({ example: 'fd36f7cd-6e48-40b8-8f50-a7c29a34bfcb' })
  created_by_id: string;

  @ApiProperty({ type: () => EventTypeResponseDto })
  eventType: EventTypeResponseDto;

  @ApiProperty({ example: '6389d3b2-e5b3-4ec4-b818-811a21fb5acc' })
  event_type_id: string;

  @ApiProperty({ type: () => [EventRepublicResponseDto] })
  eventRepublics: EventRepublicResponseDto[];

  @ApiProperty({ type: () => [] })
  eventInvites: any[];

  @ApiProperty({ example: '2025-06-13T22:28:11.147Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-13T22:28:11.147Z' })
  updatedAt: Date;
} 