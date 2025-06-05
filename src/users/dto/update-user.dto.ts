import { IsString, IsEmail, IsPhoneNumber, MinLength, IsOptional, IsEnum, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserHierarchy, Faculdade } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    minLength: 3,
    required: false
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Apelido do usuário',
    example: 'Joãozinho',
    required: false
  })
  @IsString()
  @IsOptional()
  apelido?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário no formato brasileiro',
    example: '+5511999999999',
    required: false
  })
  @IsPhoneNumber('BR')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Período de ingresso no formato ano.semestre',
    example: '24.1',
    required: false
  })
  @IsString()
  @IsOptional()
  periodoIngresso?: string;

  @ApiProperty({
    description: 'Cidade e estado de origem',
    example: 'Belo Horizonte, MG',
    required: false
  })
  @IsString()
  @IsOptional()
  origem?: string;

  @ApiProperty({
    description: 'Faculdade do usuário',
    enum: Faculdade,
    example: 'ufop',
    required: false
  })
  @IsEnum(Faculdade)
  @IsOptional()
  faculdade?: Faculdade;

  @ApiProperty({
    description: 'Curso do usuário',
    example: 'Engenharia de Computação',
    required: false
  })
  @IsString()
  @IsOptional()
  curso?: string;

  @ApiProperty({
    description: 'Hierarquia do usuário na república',
    enum: UserHierarchy,
    example: 'morador',
    required: false
  })
  @IsEnum(UserHierarchy)
  @IsOptional()
  hierarquia?: UserHierarchy;

  @ApiProperty({
    description: 'Descrição/bio do usuário',
    example: 'Estudante de engenharia, ama música e esportes',
    required: false
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Link da foto de perfil do usuário',
    example: 'https://example.com/profile-pictures/joao.jpg',
    required: false
  })
  @ValidateIf((o) => o.linkfotoPerfil !== '' && o.linkfotoPerfil !== null && o.linkfotoPerfil !== undefined)
  @IsUrl({}, { message: 'Link da foto deve ser uma URL válida' })
  @IsOptional()
  linkfotoPerfil?: string;
} 