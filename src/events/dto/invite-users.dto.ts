import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class InviteUsersDto {
  @ApiProperty({
    description: 'Lista de IDs de usuários para convidar',
    example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e12d-34a5-b678-912345678901'],
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'A lista de usuários não pode estar vazia' })
  @IsUUID(4, { each: true })
  user_ids: string[];
} 