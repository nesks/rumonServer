import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { InviteStatus } from '../entities/event-invite.entity';

export class UpdateInviteStatusDto {
  @ApiProperty({
    description: 'Novo status do convite',
    enum: InviteStatus,
    example: 'confirmado'
  })
  @IsEnum(InviteStatus)
  status: InviteStatus;
} 