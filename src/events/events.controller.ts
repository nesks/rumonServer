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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { UpdateInviteStatusDto } from './dto/update-invite-status.dto';

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
} 