import { PartialType } from '@nestjs/mapped-types';
import { CreateRepublicDto } from './create-republic.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRepublicDto extends PartialType(CreateRepublicDto) {
  @ApiProperty({
    description: 'Nome da república',
    example: 'República dos Estudantes',
    minLength: 3,
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'Endereço da república',
    example: 'Rua das Flores, 123',
    required: false
  })
  address?: string;

  @ApiProperty({
    description: 'Descrição da república',
    example: 'República para estudantes universitários',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Link da foto da bandeira da república',
    example: 'https://example.com/republic-flags/republica-estudantes.jpg',
    required: false
  })
  linkFoto?: string;
} 