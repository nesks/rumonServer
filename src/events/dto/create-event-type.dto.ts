import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsHexColor } from 'class-validator';

export class CreateEventTypeDto {
  @ApiProperty({
    description: 'Nome do tipo de evento',
    example: 'rock'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição do tipo de evento',
    example: 'Eventos de música rock com bandas',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Cor hexadecimal para identificação visual',
    example: '#FF6B6B',
    required: false
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({
    description: 'Se apenas um evento deste tipo pode ocorrer por dia',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  onePerDay?: boolean;

  @ApiProperty({
    description: 'Quantos meses antes o evento pode ser agendado',
    example: 6,
    required: false
  })
  @IsOptional()
  @IsNumber()
  monthsInAdvance?: number;

  @ApiProperty({
    description: 'Se eventos deste tipo precisam de aprovação',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
} 