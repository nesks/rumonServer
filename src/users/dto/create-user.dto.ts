import { IsString, IsEmail, IsPhoneNumber, MinLength, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserHierarchy, Faculdade } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    minLength: 3
  })
  @IsString()
  @MinLength(3)
  name: string;

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
    example: 'joao@email.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telefone do usuário no formato brasileiro',
    example: '+5511999999999'
  })
  @IsPhoneNumber('BR')
  phone: string;

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
    example: 'UFOP',
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
    description: 'ID da república que o usuário pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  republic_id?: string;
} 