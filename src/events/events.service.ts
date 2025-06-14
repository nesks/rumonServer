import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus, EventVisibility } from './entities/event.entity';
import { EventType } from './entities/event-type.entity';
import { EventRepublic } from './entities/event-republic.entity';
import { EventInvite, InviteStatus } from './entities/event-invite.entity';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { UpdateInviteStatusDto } from './dto/update-invite-status.dto';
import { InviteBatchDto } from './dto/invite-batch.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Between } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventType)
    private eventTypeRepository: Repository<EventType>,
    @InjectRepository(EventRepublic)
    private eventRepublicRepository: Repository<EventRepublic>,
    @InjectRepository(EventInvite)
    private eventInviteRepository: Repository<EventInvite>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // EventType methods
  async createEventType(createEventTypeDto: CreateEventTypeDto): Promise<EventType> {
    try {
      const eventType = this.eventTypeRepository.create(createEventTypeDto);
      return await this.eventTypeRepository.save(eventType);
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'UQ_d5110ab69f4aacfe41fecdf4fcd') {
        throw new BadRequestException(`Já existe um tipo de evento com o nome "${createEventTypeDto.name}". Por favor, escolha outro nome.`);
      }
      throw error;
    }
  }

  async findAllEventTypes(): Promise<EventType[]> {
    return await this.eventTypeRepository.find();
  }

  async findEventTypeById(id: string): Promise<EventType> {
    const eventType = await this.eventTypeRepository.findOne({ where: { id } });
    if (!eventType) {
      throw new NotFoundException(`Tipo de evento com ID ${id} não encontrado`);
    }
    return eventType;
  }

  async updateEventType(id: string, updateEventTypeDto: UpdateEventTypeDto): Promise<EventType> {
    const eventType = await this.findEventTypeById(id);
    Object.assign(eventType, updateEventTypeDto);
    return await this.eventTypeRepository.save(eventType);
  }

  async deleteEventType(id: string): Promise<void> {
    const result = await this.eventTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tipo de evento com ID ${id} não encontrado`);
    }
  }

  // Event methods
  async createEvent(createEventDto: CreateEventDto, userId: string): Promise<EventResponseDto> {
    const { republic_ids, invited_user_ids, ...eventData } = createEventDto;

    // Verificar se o tipo de evento existe
    const eventType = await this.findEventTypeById(createEventDto.event_type_id);

    // Validação de antecedência removida temporariamente
    // TODO: Reativar validação de monthsInAdvance se necessário no futuro

    // Validação: apenas um evento tipo rock por dia
    if (eventType.onePerDay) {
      const existingEvent = await this.eventRepository
        .createQueryBuilder('event')
        .innerJoin('event.eventType', 'eventType')
        .where('eventType.id = :eventTypeId', { eventTypeId: eventType.id })
        .andWhere('event.eventDate = :eventDate', { eventDate: createEventDto.eventDate })
        .andWhere('event.status != :rejectedStatus', { rejectedStatus: EventStatus.REJEITADO })
        .getOne();

      if (existingEvent) {
        throw new BadRequestException(
          `Já existe um evento do tipo ${eventType.name} agendado para esta data`
        );
      }
    }

    // Criar o evento
    const event = this.eventRepository.create({
      ...eventData,
      created_by_id: userId,
      status: eventType.requiresApproval ? EventStatus.PENDENTE : EventStatus.APROVADO,
    });

    const savedEvent = await this.eventRepository.save(event);

    // Associar repúblicas organizadoras
    for (const republicId of republic_ids) {
      const eventRepublic = this.eventRepublicRepository.create({
        event_id: savedEvent.id,
        republic_id: republicId,
      });
      await this.eventRepublicRepository.save(eventRepublic);
    }

    // Criar convites se fornecidos
    if (invited_user_ids && invited_user_ids.length > 0) {
      for (const invitedUserId of invited_user_ids) {
        const eventInvite = this.eventInviteRepository.create({
          event_id: savedEvent.id,
          user_id: invitedUserId,
        });
        await this.eventInviteRepository.save(eventInvite);
      }
    }

    return await this.findEventById(savedEvent.id);
  }

  private transformEventToResponseDto(event: Event): EventResponseDto {
    return {
      ...event,
      createdBy: {
        id: event.createdBy.id,
        apelido: event.createdBy.apelido,
        linkfotoPerfil: event.createdBy.linkfotoPerfil
      },
      eventType: {
        id: event.eventType.id,
        name: event.eventType.name,
        color: event.eventType.color
      },
      eventRepublics: event.eventRepublics.map(er => ({
        id: er.id,
        republic: {
          id: er.republic.id,
          name: er.republic.name,
          linkFoto: er.republic.linkFoto
        }
      }))
    };
  }

  async findAllEvents(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.find({
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
      order: { eventDate: 'ASC' },
    });
    return events.map(event => this.transformEventToResponseDto(event));
  }

  async findEventById(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    return this.transformEventToResponseDto(event);
  }

  async findEventsByRepublic(republicId: string): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.find({
      where: { eventRepublics: { republic_id: republicId } },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
      order: { eventDate: 'ASC' },
    });
    return events.map(event => this.transformEventToResponseDto(event));
  }

  async findEventsByUser(userId: string): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.find({
      where: { created_by_id: userId },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
      order: { eventDate: 'ASC' },
    });
    return events.map(event => this.transformEventToResponseDto(event));
  }

  async findPublicEvents(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.find({
      where: { visibility: EventVisibility.ABERTO, status: EventStatus.APROVADO },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
      order: { eventDate: 'ASC' },
    });
    return events.map(event => this.transformEventToResponseDto(event));
  }

  async findVisibleEventsByMonth(userId: string, year: number, month: number): Promise<EventResponseDto[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .leftJoinAndSelect('event.eventRepublics', 'eventRepublics')
      .leftJoinAndSelect('eventRepublics.republic', 'republic')
      .leftJoinAndSelect('event.eventInvites', 'eventInvites')
      .where('event.eventDate >= :startDate', { startDate: startDate.toISOString().split('T')[0] })
      .andWhere('event.eventDate <= :endDate', { endDate: endDate.toISOString().split('T')[0] })
      .andWhere('event.status IN (:...statuses)', { 
        statuses: [EventStatus.APROVADO, EventStatus.PENDENTE] 
      })
      .andWhere(
        `(
          event.visibility = :publicVisibility OR
          EXISTS (
            SELECT 1 FROM event_invites ei 
            WHERE ei.event_id = event.id 
            AND ei.user_id = :userId 
            AND ei.status = :acceptedStatus
          )
        )`,
        {
          publicVisibility: EventVisibility.ABERTO,
          userId: userId,
          acceptedStatus: InviteStatus.ACEITO
        }
      )
      .orderBy('event.eventDate', 'ASC')
      .addOrderBy('event.eventTime', 'ASC')
      .getMany();

    return events.map(event => this.transformEventToResponseDto(event));
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    Object.assign(event, updateEventDto);
    await this.eventRepository.save(event);
    return this.transformEventToResponseDto(event);
  }

  async updateEventStatus(id: string, updateEventStatusDto: UpdateEventStatusDto): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    
    if (updateEventStatusDto.status === EventStatus.REJEITADO && !updateEventStatusDto.rejectionReason) {
      throw new BadRequestException('Motivo da rejeição é obrigatório quando o evento é rejeitado');
    }
    
    event.status = updateEventStatusDto.status;
    
    if (updateEventStatusDto.rejectionReason) {
      event.rejectionReason = updateEventStatusDto.rejectionReason;
    }
    
    await this.eventRepository.save(event);
    return this.transformEventToResponseDto(event);
  }

  async deleteEvent(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
  }

  // Event Invite methods
  async updateInviteStatus(eventId: string, userId: string, updateInviteStatusDto: UpdateInviteStatusDto): Promise<EventInvite> {
    const invite = await this.eventInviteRepository.findOne({
      where: { event_id: eventId, user_id: userId },
      relations: ['event', 'user'],
    });

    if (!invite) {
      throw new NotFoundException('Convite não encontrado');
    }

    invite.status = updateInviteStatusDto.status;
    return await this.eventInviteRepository.save(invite);
  }

  async findEventInvitesByUser(userId: string): Promise<EventInvite[]> {
    return await this.eventInviteRepository.find({
      where: { user_id: userId },
      relations: ['event', 'event.eventType', 'event.eventRepublics', 'event.eventRepublics.republic'],
      order: { createdAt: 'DESC' },
    });
  }

  async addInviteToEvent(eventId: string, userId: string): Promise<EventInvite> {
    const event = await this.findEventById(eventId);
    
    // Verificar se já existe convite
    const existingInvite = await this.eventInviteRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (existingInvite) {
      throw new BadRequestException('Usuário já foi convidado para este evento');
    }

    const invite = this.eventInviteRepository.create({
      event_id: eventId,
      user_id: userId,
    });

    return await this.eventInviteRepository.save(invite);
  }

  // Método para convites em lote
  async addBatchInvitesToEvent(eventId: string, inviteBatchDto: InviteBatchDto): Promise<{
    success: EventInvite[],
    failed: { userId: string, reason: string }[]
  }> {
    const event = await this.findEventById(eventId);
    
    let allUserIds: string[] = [];

    // Coletar IDs de usuários diretos
    if (inviteBatchDto.user_ids && inviteBatchDto.user_ids.length > 0) {
      allUserIds = [...allUserIds, ...inviteBatchDto.user_ids];
    }

    // Coletar usuários das repúblicas
    if (inviteBatchDto.republic_ids && inviteBatchDto.republic_ids.length > 0) {
      for (const republicId of inviteBatchDto.republic_ids) {
        const users = await this.userRepository.find({
          where: { republic_id: republicId },
          select: ['id'],
        });
        
        const republicUserIds = users.map(user => user.id);
        allUserIds = [...allUserIds, ...republicUserIds];
      }
    }

    // Remover duplicatas
    const uniqueUserIds = [...new Set(allUserIds)];

    const successfulInvites: EventInvite[] = [];
    const failedInvites: { userId: string, reason: string }[] = [];

    // Processar cada convite
    for (const userId of uniqueUserIds) {
      try {
        // Verificar se já existe convite
        const existingInvite = await this.eventInviteRepository.findOne({
          where: { event_id: eventId, user_id: userId },
        });

        if (existingInvite) {
          failedInvites.push({
            userId,
            reason: 'Usuário já foi convidado para este evento'
          });
          continue;
        }

        // Verificar se o usuário existe
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });

        if (!user) {
          failedInvites.push({
            userId,
            reason: 'Usuário não encontrado'
          });
          continue;
        }

        // Criar o convite
        const invite = this.eventInviteRepository.create({
          event_id: eventId,
          user_id: userId,
        });

        const savedInvite = await this.eventInviteRepository.save(invite);
        successfulInvites.push(savedInvite);

      } catch (error) {
        failedInvites.push({
          userId,
          reason: error.message || 'Erro desconhecido'
        });
      }
    }

    return {
      success: successfulInvites,
      failed: failedInvites
    };
  }

  // Método específico para convidar uma república inteira
  async inviteRepublicToEvent(eventId: string, republicId: string): Promise<{
    success: EventInvite[],
    failed: { userId: string, reason: string }[]
  }> {
    return this.addBatchInvitesToEvent(eventId, { republic_ids: [republicId] });
  }

  // Método específico para convidar múltiplas repúblicas
  async inviteMultipleRepublicsToEvent(eventId: string, republicIds: string[]): Promise<{
    success: EventInvite[],
    failed: { userId: string, reason: string }[]
  }> {
    return this.addBatchInvitesToEvent(eventId, { republic_ids: republicIds });
  }

  // Método específico para convidar múltiplos usuários
  async inviteMultipleUsersToEvent(eventId: string, userIds: string[]): Promise<{
    success: EventInvite[],
    failed: { userId: string, reason: string }[]
  }> {
    return this.addBatchInvitesToEvent(eventId, { user_ids: userIds });
  }
} 