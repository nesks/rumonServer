import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepublicDto {
  @ApiProperty({
    description: 'Nome da república',
    example: 'República dos Estudantes',
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Endereço da república',
    example: 'Rua das Flores, 123'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Descrição da república',
    example: 'República para estudantes universitários',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
} 