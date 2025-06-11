import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class EventsByMonthDto {
  @ApiProperty({
    description: 'Ano para buscar os eventos',
    example: 2024,
    minimum: 2020,
    maximum: 2030
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Ano deve ser um número inteiro' })
  @Min(2020, { message: 'Ano deve ser no mínimo 2020' })
  @Max(2030, { message: 'Ano deve ser no máximo 2030' })
  year: number;

  @ApiProperty({
    description: 'Mês para buscar os eventos (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Mês deve ser um número inteiro' })
  @Min(1, { message: 'Mês deve ser entre 1 e 12' })
  @Max(12, { message: 'Mês deve ser entre 1 e 12' })
  month: number;

  @ApiProperty({
    description: 'ID do usuário (opcional, se não fornecido será usado o usuário autenticado)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID deve ser um UUID válido' })
  userId?: string;
} 