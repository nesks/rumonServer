import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(
  OmitType(CreateEventDto, ['republic_ids', 'invited_user_ids'] as const)
) {} 