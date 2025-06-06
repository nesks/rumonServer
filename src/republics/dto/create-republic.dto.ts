import { IsString, IsNotEmpty, IsOptional, IsUrl, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RepublicTipo, RepublicStatus } from '../entities/republic.entity';

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

  @ApiProperty({
    description: 'Link da foto da bandeira da república',
    example: 'https://example.com/republic-flags/republica-estudantes.jpg',
    required: false
  })
  @IsUrl()
  @IsOptional()
  linkFoto?: string;

  @ApiProperty({
    description: 'Tipo da república',
    enum: RepublicTipo,
    example: 'mista',
    required: false
  })
  @IsEnum(RepublicTipo)
  @IsOptional()
  tipo?: RepublicTipo;

  @ApiProperty({
    description: 'Data de fundação da república',
    example: '1995-03-15',
    required: false
  })
  @IsDateString()
  @IsOptional()
  fundada_em?: Date;

  @ApiProperty({
    description: 'Status atual da república',
    enum: RepublicStatus,
    example: 'ativa',
    required: false
  })
  @IsEnum(RepublicStatus)
  @IsOptional()
  status?: RepublicStatus;

  @ApiProperty({
    description: 'Foto de capa da república',
    example: 'https://example.com/covers/republica-estudantes.jpg',
    required: false
  })
  @IsUrl()
  @IsOptional()
  foto_capa?: string;

  @ApiProperty({
    description: 'Link do Instagram da república',
    example: 'https://instagram.com/republicaestudantes',
    required: false
  })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    description: 'Hino da república',
    example: 'Letra do hino da república...',
    required: false
  })
  @IsString()
  @IsOptional()
  hino?: string;

  @ApiProperty({
    description: 'Link para o estatuto em PDF',
    example: 'https://example.com/estatutos/republica-estudantes.pdf',
    required: false
  })
  @IsUrl()
  @IsOptional()
  linkEstatutoPdf?: string;

  @ApiProperty({
    description: 'ID do usuário responsável Rumon',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  usuario_rumon_id?: string;

  @ApiProperty({
    description: 'ID da casa da república',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  casa_id?: string;
} 