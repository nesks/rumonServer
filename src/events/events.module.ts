import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventType } from './entities/event-type.entity';
import { EventRepublic } from './entities/event-republic.entity';
import { EventInvite } from './entities/event-invite.entity';
import { User } from '../users/entities/user.entity';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventType, EventRepublic, EventInvite, User]),
    FeedModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {} 