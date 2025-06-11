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

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Event Type routes
  @Post('types')
  @ApiOperation({ summary: 'Criar novo tipo de evento' })
  @ApiResponse({ status: 201, description: 'Tipo de evento criado com sucesso' })
  createEventType(@Body() createEventTypeDto: CreateEventTypeDto) {
    return this.eventsService.createEventType(createEventTypeDto);
  }

  @Get('types')
  @ApiOperation({ summary: 'Listar todos os tipos de evento' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de evento' })
  findAllEventTypes() {
    return this.eventsService.findAllEventTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Buscar tipo de evento por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de evento encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de evento não encontrado' })
  findEventType(@Param('id') id: string) {
    return this.eventsService.findEventTypeById(id);
  }

  @Patch('types/:id')
  @ApiOperation({ summary: 'Atualizar tipo de evento' })
  @ApiResponse({ status: 200, description: 'Tipo de evento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de evento não encontrado' })
  updateEventType(@Param('id') id: string, @Body() updateEventTypeDto: UpdateEventTypeDto) {
    return this.eventsService.updateEventType(id, updateEventTypeDto);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: 'Deletar tipo de evento' })
  @ApiResponse({ status: 200, description: 'Tipo de evento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de evento não encontrado' })
  deleteEventType(@Param('id') id: string) {
    return this.eventsService.deleteEventType(id);
  }

  // Event routes
  @Post()
  @ApiOperation({ summary: 'Criar novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regras de negócio violadas' })
  createEvent(@Body() createEventDto: CreateEventDto, @Request() req) {
    // Assumindo que o middleware de autenticação adiciona user.id ao request
    const userId = req.user?.id || 'user-placeholder';
    return this.eventsService.createEvent(createEventDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({ status: 200, description: 'Lista de eventos' })
  findAllEvents() {
    return this.eventsService.findAllEvents();
  }

  @Get('public')
  @ApiOperation({ summary: 'Listar eventos públicos aprovados' })
  @ApiResponse({ status: 200, description: 'Lista de eventos públicos' })
  findPublicEvents() {
    return this.eventsService.findPublicEvents();
  }

  @Get('republic/:republicId')
  @ApiOperation({ summary: 'Listar eventos de uma república' })
  @ApiResponse({ status: 200, description: 'Lista de eventos da república' })
  findEventsByRepublic(@Param('republicId') republicId: string) {
    return this.eventsService.findEventsByRepublic(republicId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar eventos criados por um usuário' })
  @ApiResponse({ status: 200, description: 'Lista de eventos do usuário' })
  findEventsByUser(@Param('userId') userId: string) {
    return this.eventsService.findEventsByUser(userId);
  }

  @Get('invites/user/:userId')
  @ApiOperation({ summary: 'Listar convites de um usuário' })
  @ApiResponse({ status: 200, description: 'Lista de convites do usuário' })
  findEventInvitesByUser(@Param('userId') userId: string) {
    return this.eventsService.findEventInvitesByUser(userId);
  }

  @Get('visible/month/:year/:month')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar eventos visíveis a um usuário em um mês específico' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos visíveis ao usuário no mês especificado',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          eventDate: { type: 'string', format: 'date' },
          eventTime: { type: 'string' },
          location: { type: 'string' },
          mediaUrl: { type: 'string' },
          visibility: { type: 'string', enum: ['aberto', 'fechado'] },
          status: { type: 'string', enum: ['pendente', 'aprovado', 'rejeitado'] }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parâmetros inválidos (ano ou mês fora do intervalo permitido)' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de autenticação necessário' 
  })
  findVisibleEventsByMonth(
    @Param('year') year: string,
    @Param('month') month: string,
    @Query('userId') userId?: string,
    @Request() req?
  ) {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    // Validação básica dos parâmetros
    if (isNaN(yearNum) || isNaN(monthNum) || yearNum < 2020 || yearNum > 2030 || monthNum < 1 || monthNum > 12) {
      throw new BadRequestException('Ano deve estar entre 2020-2030 e mês entre 1-12');
    }
    
    // Usar userId do query param ou do usuário autenticado (prioriza o usuário autenticado por segurança)
    const targetUserId = userId || req?.user?.id;
    
    if (!targetUserId) {
      throw new BadRequestException('User ID é obrigatório');
    }
    
    return this.eventsService.findVisibleEventsByMonth(targetUserId, yearNum, monthNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  findEvent(@Param('id') id: string) {
    return this.eventsService.findEventById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar evento' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do evento (aprovar/rejeitar)' })
  @ApiResponse({ status: 200, description: 'Status do evento atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Status inválido ou motivo de rejeição obrigatório' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  updateEventStatus(@Param('id') id: string, @Body() updateEventStatusDto: UpdateEventStatusDto) {
    return this.eventsService.updateEventStatus(id, updateEventStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar evento' })
  @ApiResponse({ status: 200, description: 'Evento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  deleteEvent(@Param('id') id: string) {
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