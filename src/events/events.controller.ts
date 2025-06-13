import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { UpdateInviteStatusDto } from './dto/update-invite-status.dto';
import { InviteBatchDto } from './dto/invite-batch.dto';
import { InviteRepublicsDto } from './dto/invite-republics.dto';
import { InviteUsersDto } from './dto/invite-users.dto';
import { EventsByMonthDto } from './dto/events-by-month.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventResponseDto } from './dto/event-response.dto';
import { EventType } from './entities/event-type.entity';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Event Type routes
  @Post('types')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo tipo de evento' })
  @ApiResponse({ status: 201, description: 'Tipo de evento criado com sucesso', type: EventType })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou nome de tipo de evento já existe' })
  @ApiResponse({ status: 401, description: 'Token de autenticação necessário' })
  createEventType(@Body() createEventTypeDto: CreateEventTypeDto): Promise<EventType> {
    return this.eventsService.createEventType(createEventTypeDto);
  }

  @Get('types')
  @ApiOperation({ summary: 'Listar todos os tipos de evento' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de evento', type: [EventType] })
  findAllEventTypes(): Promise<EventType[]> {
    return this.eventsService.findAllEventTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Buscar tipo de evento por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de evento encontrado', type: EventType })
  @ApiResponse({ status: 404, description: 'Tipo de evento não encontrado' })
  findEventType(@Param('id') id: string): Promise<EventType> {
    return this.eventsService.findEventTypeById(id);
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar tipo de evento' })
  @ApiResponse({ status: 200, description: 'Tipo de evento atualizado com sucesso', type: EventType })
  @ApiResponse({ status: 404, description: 'Tipo de evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de autenticação necessário' })
  updateEventType(@Param('id') id: string, @Body() updateEventTypeDto: UpdateEventTypeDto): Promise<EventType> {
    return this.eventsService.updateEventType(id, updateEventTypeDto);
  }

  @Delete('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar tipo de evento' })
  @ApiResponse({ status: 200, description: 'Tipo de evento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de autenticação necessário' })
  deleteEventType(@Param('id') id: string): Promise<void> {
    return this.eventsService.deleteEventType(id);
  }

  // Event routes
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo evento' })
  @ApiResponse({ 
    status: 201, 
    description: 'Evento criado com sucesso',
    type: EventResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regras de negócio violadas' })
  @ApiResponse({ status: 401, description: 'Token de autenticação necessário' })
  createEvent(@Body() createEventDto: CreateEventDto, @Request() req): Promise<EventResponseDto> {
    const userId = req.user.userId;
    return this.eventsService.createEvent(createEventDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos',
    type: [EventResponseDto]
  })
  findAllEvents(): Promise<EventResponseDto[]> {
    return this.eventsService.findAllEvents();
  }

  @Get('public')
  @ApiOperation({ summary: 'Listar eventos públicos aprovados' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos públicos',
    type: [EventResponseDto]
  })
  findPublicEvents(): Promise<EventResponseDto[]> {
    return this.eventsService.findPublicEvents();
  }

  @Get('republic/:republicId')
  @ApiOperation({ summary: 'Listar eventos de uma república' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos da república',
    type: [EventResponseDto]
  })
  findEventsByRepublic(@Param('republicId') republicId: string): Promise<EventResponseDto[]> {
    return this.eventsService.findEventsByRepublic(republicId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar eventos criados por um usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos do usuário',
    type: [EventResponseDto]
  })
  findEventsByUser(@Param('userId') userId: string): Promise<EventResponseDto[]> {
    return this.eventsService.findEventsByUser(userId);
  }

  @Get('invites/user/:userId')
  @ApiOperation({ summary: 'Listar convites de um usuário' })
  @ApiResponse({ status: 200, description: 'Lista de convites do usuário' })
  findEventInvitesByUser(@Param('userId') userId: string) {
    return this.eventsService.findEventInvitesByUser(userId);
  }

  @Get('visible/month/:year/:month')
  @ApiOperation({ summary: 'Listar eventos visíveis por mês' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos visíveis do mês', 
    type: [EventResponseDto] 
  })
  findVisibleEventsByMonth(
    @Param('year') year: number,
    @Param('month') month: number
  ): Promise<EventResponseDto[]> {
    return this.eventsService.findVisibleEventsByMonth(year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Evento encontrado',
    type: EventResponseDto
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  findEvent(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.findEventById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar evento' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do evento (aprovar/rejeitar)' })
  @ApiResponse({ status: 200, description: 'Status do evento atualizado com sucesso', type: EventResponseDto })
  @ApiResponse({ status: 400, description: 'Status inválido ou motivo de rejeição obrigatório' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  updateEventStatus(@Param('id') id: string, @Body() updateEventStatusDto: UpdateEventStatusDto): Promise<EventResponseDto> {
    return this.eventsService.updateEventStatus(id, updateEventStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar evento' })
  @ApiResponse({ status: 200, description: 'Evento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  deleteEvent(@Param('id') id: string): Promise<void> {
    return this.eventsService.deleteEvent(id);
  }

  // Event Invite routes
  @Post(':eventId/invite/:userId')
  @ApiOperation({ summary: 'Convidar usuário para evento' })
  @ApiResponse({ status: 201, description: 'Convite criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Usuário já foi convidado' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  addInviteToEvent(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.eventsService.addInviteToEvent(eventId, userId);
  }

  @Patch(':eventId/invite/:userId/status')
  @ApiOperation({ summary: 'Atualizar status do convite (interessado/confirmado/recusado)' })
  @ApiResponse({ status: 200, description: 'Status do convite atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  updateInviteStatus(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body() updateInviteStatusDto: UpdateInviteStatusDto,
  ) {
    return this.eventsService.updateInviteStatus(eventId, userId, updateInviteStatusDto);
  }

  // Rotas para convites em lote
  @Post(':eventId/invite/batch')
  @ApiOperation({ summary: 'Convidar múltiplos usuários ou repúblicas inteiras para evento' })
  @ApiResponse({ 
    status: 201, 
    description: 'Convites processados com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              event_id: { type: 'string' },
              user_id: { type: 'string' },
              status: { type: 'string', enum: ['pendente', 'interessado', 'confirmado', 'recusado'] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        failed: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              userId: { type: 'string' },
              reason: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  addBatchInvitesToEvent(
    @Param('eventId') eventId: string,
    @Body() inviteBatchDto: InviteBatchDto,
  ) {
    return this.eventsService.addBatchInvitesToEvent(eventId, inviteBatchDto);
  }

  @Post(':eventId/invite/republic/:republicId')
  @ApiOperation({ summary: 'Convidar todos os integrantes de uma república para evento' })
  @ApiResponse({ status: 201, description: 'Convites para a república criados com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  inviteRepublicToEvent(
    @Param('eventId') eventId: string,
    @Param('republicId') republicId: string,
  ) {
    return this.eventsService.inviteRepublicToEvent(eventId, republicId);
  }

  @Post(':eventId/invite/republics')
  @ApiOperation({ summary: 'Convidar todos os integrantes de múltiplas repúblicas para evento' })
  @ApiResponse({ status: 201, description: 'Convites para as repúblicas criados com sucesso' })
  @ApiResponse({ status: 400, description: 'Lista de repúblicas inválida' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  inviteMultipleRepublicsToEvent(
    @Param('eventId') eventId: string,
    @Body() inviteRepublicsDto: InviteRepublicsDto,
  ) {
    return this.eventsService.inviteMultipleRepublicsToEvent(eventId, inviteRepublicsDto.republic_ids);
  }

  @Post(':eventId/invite/users')
  @ApiOperation({ summary: 'Convidar múltiplos usuários para evento' })
  @ApiResponse({ status: 201, description: 'Convites para os usuários criados com sucesso' })
  @ApiResponse({ status: 400, description: 'Lista de usuários inválida' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  inviteMultipleUsersToEvent(
    @Param('eventId') eventId: string,
    @Body() inviteUsersDto: InviteUsersDto,
  ) {
    return this.eventsService.inviteMultipleUsersToEvent(eventId, inviteUsersDto.user_ids);
  }
} 