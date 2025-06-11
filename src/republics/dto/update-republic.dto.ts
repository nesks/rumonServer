import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { RepublicTipo, RepublicStatus } from '../entities/republic.entity';

export class UpdateRepublicDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  linkFoto?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tipo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  fundada_em?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  foto_capa?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  instagram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hino?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  linkEstatutoPdf?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  usuario_rumon_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  casa_id?: string;
} 