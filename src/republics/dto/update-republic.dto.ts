import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsDateString, IsUrl, IsUUID, ValidateIf } from 'class-validator';
import { RepublicTipo, RepublicStatus } from '../entities/republic.entity';

export class UpdateRepublicDto {
  @ApiProperty({
    description: 'Nome da república',
    example: 'República dos Estudantes',
    minLength: 3,
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Endereço da república',
    example: 'Rua das Flores, 123',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Descrição da república',
    example: 'República para estudantes universitários',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Link da foto da bandeira da república',
    example: 'https://example.com/republic-flags/republica-estudantes.jpg',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @ValidateIf((o) => o.linkFoto !== null && o.linkFoto !== undefined)
  @IsUrl({}, { message: 'linkFoto deve ser uma URL válida' })
  linkFoto?: string;

  @ApiProperty({
    description: 'Tipo da república',
    enum: RepublicTipo,
    example: 'mista',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  @IsEnum(RepublicTipo, { message: 'tipo deve ser masculina, feminina ou mista' })
  tipo?: RepublicTipo;

  @ApiProperty({
    description: 'Data de fundação da república',
    example: '1995-03-15',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @ValidateIf((o) => o.fundada_em !== null && o.fundada_em !== undefined)
  @IsDateString({}, { message: 'fundada_em deve ser uma data válida no formato YYYY-MM-DD' })
  fundada_em?: Date;

  @ApiProperty({
    description: 'Status atual da república',
    enum: RepublicStatus,
    example: 'ativa',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  @IsEnum(RepublicStatus, { message: 'status deve ser ativa, inativa, reformando ou suspended' })
  status?: RepublicStatus;

  @ApiProperty({
    description: 'Foto de capa da república',
    example: 'https://example.com/covers/republica-estudantes.jpg',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @ValidateIf((o) => o.foto_capa !== null && o.foto_capa !== undefined)
  @IsUrl({}, { message: 'foto_capa deve ser uma URL válida' })
  foto_capa?: string;

  @ApiProperty({
    description: 'Link do Instagram da república',
    example: 'https://instagram.com/republicaestudantes',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @ValidateIf((o) => o.instagram !== null && o.instagram !== undefined)
  @IsUrl({}, { message: 'instagram deve ser uma URL válida' })
  instagram?: string;

  @ApiProperty({
    description: 'Hino da república',
    example: 'Letra do hino da república...',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @IsString()
  hino?: string;

  @ApiProperty({
    description: 'Link para o estatuto em PDF',
    example: 'https://example.com/estatutos/republica-estudantes.pdf',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @ValidateIf((o) => o.linkEstatutoPdf !== null && o.linkEstatutoPdf !== undefined)
  @IsUrl({}, { message: 'linkEstatutoPdf deve ser uma URL válida' })
  linkEstatutoPdf?: string;

  @ApiProperty({
    description: 'ID do usuário responsável Rumon',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID(4, { message: 'usuario_rumon_id deve ser um UUID válido' })
  usuario_rumon_id?: string;

  @ApiProperty({
    description: 'ID da casa da república',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID(4, { message: 'casa_id deve ser um UUID válido' })
  casa_id?: string;
} 