import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsUUID, ValidateIf, ArrayNotEmpty } from 'class-validator';

export class InviteBatchDto {
  @ApiProperty({
    description: 'Lista de IDs de usuários para convidar',
    example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e12d-34a5-b678-912345678901'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  user_ids?: string[];

  @ApiProperty({
    description: 'Lista de IDs de repúblicas para convidar (todos os integrantes)',
    example: ['789e0123-e45f-67b8-c901-234567890123'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  republic_ids?: string[];

  @ValidateIf((o) => !o.user_ids && !o.republic_ids)
  @ArrayNotEmpty({ message: 'Pelo menos user_ids ou republic_ids deve ser fornecido' })
  private readonly _validation?: never;
} 