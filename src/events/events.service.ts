import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus, EventVisibility } from './entities/event.entity';
import { EventType } from './entities/event-type.entity';
import { EventRepublic } from './entities/event-republic.entity';
import { EventInvite, InviteStatus } from './entities/event-invite.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { UpdateInviteStatusDto } from './dto/update-invite-status.dto';

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
  ) {}

  // EventType methods
  async createEventType(createEventTypeDto: CreateEventTypeDto): Promise<EventType> {
    const eventType = this.eventTypeRepository.create(createEventTypeDto);
    return await this.eventTypeRepository.save(eventType);
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
  async createEvent(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const { republic_ids, invited_user_ids, ...eventData } = createEventDto;

    // Verificar se o tipo de evento existe
    const eventType = await this.findEventTypeById(createEventDto.event_type_id);

    // Validação: regra dos 6 meses para eventos tipo rock
    if (eventType.monthsInAdvance) {
      const eventDate = new Date(createEventDto.eventDate);
      const now = new Date();
      const monthsDiff = (eventDate.getFullYear() - now.getFullYear()) * 12 + 
                        (eventDate.getMonth() - now.getMonth());
      
      if (monthsDiff < eventType.monthsInAdvance) {
        throw new BadRequestException(
          `Eventos do tipo ${eventType.name} devem ser agendados com pelo menos ${eventType.monthsInAdvance} meses de antecedência`
        );
      }
    }

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

  async findAllEvents(): Promise<Event[]> {
    return await this.eventRepository.find({
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic', 'eventInvites', 'eventInvites.user'],
      order: { eventDate: 'ASC' },
    });
  }

  async findEventById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic', 'eventInvites', 'eventInvites.user'],
    });
    
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    
    return event;
  }

  async findEventsByRepublic(republicId: string): Promise<Event[]> {
    return await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.eventRepublics', 'eventRepublic')
      .where('eventRepublic.republic_id = :republicId', { republicId })
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .leftJoinAndSelect('event.eventRepublics', 'eventRepublics')
      .leftJoinAndSelect('eventRepublics.republic', 'republic')
      .orderBy('event.eventDate', 'ASC')
      .getMany();
  }

  async findEventsByUser(userId: string): Promise<Event[]> {
    return await this.eventRepository.find({
      where: { created_by_id: userId },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
      order: { eventDate: 'ASC' },
    });
  }

  async findPublicEvents(): Promise<Event[]> {
    return await this.eventRepository.find({
      where: { 
        visibility: EventVisibility.ABERTO,
        status: EventStatus.APROVADO 
      },
      relations: ['createdBy', 'eventType', 'eventRepublics', 'eventRepublics.republic'],
      order: { eventDate: 'ASC' },
    });
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findEventById(id);
    Object.assign(event, updateEventDto);
    await this.eventRepository.save(event);
    return await this.findEventById(id);
  }

  async updateEventStatus(id: string, updateEventStatusDto: UpdateEventStatusDto): Promise<Event> {
    const event = await this.findEventById(id);
    
    if (updateEventStatusDto.status === EventStatus.REJEITADO && !updateEventStatusDto.rejectionReason) {
      throw new BadRequestException('Motivo da rejeição é obrigatório quando o evento é rejeitado');
    }
    
    event.status = updateEventStatusDto.status;
    if (updateEventStatusDto.rejectionReason) {
      event.rejectionReason = updateEventStatusDto.rejectionReason;
    }
    
    await this.eventRepository.save(event);
    return await this.findEventById(id);
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
} 