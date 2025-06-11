import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class InviteRepublicsDto {
  @ApiProperty({
    description: 'Lista de IDs de repúblicas para convidar (todos os integrantes)',
    example: ['789e0123-e45f-67b8-c901-234567890123', '012e3456-e78f-90b1-c234-567890123456'],
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'A lista de repúblicas não pode estar vazia' })
  @IsUUID(4, { each: true })
  republic_ids: string[];
} 