import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Republic } from '../../republics/entities/republic.entity';

import { ApiProperty } from '@nestjs/swagger';

export enum UserHierarchy {
  CALOURO = 'calouro',
  MORADOR = 'morador',
  DECANO = 'decano',
  EX_MORADOR = 'ex-morador'
}

export enum Faculdade {
  UFOP = 'ufop',
  UEMG = 'uemg'
}

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Apelido do usuário',
    example: 'Joãozinho',
    required: false
  })
  @Column({ nullable: true })
  apelido: string;

  @ApiProperty({
    description: 'Email único do usuário',
    example: 'joao@email.com'
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Telefone único do usuário',
    example: '+5511999999999'
  })
  @Column({ unique: true })
  phone: string;

  @ApiProperty({
    description: 'Período de ingresso no formato ano.semestre',
    example: '24.1',
    required: false
  })
  @Column({ nullable: true })
  periodoIngresso: string;

  @ApiProperty({
    description: 'Cidade e estado de origem',
    example: 'Belo Horizonte, MG',
    required: false
  })
  @Column({ nullable: true })
  origem: string;

  @ApiProperty({
    description: 'Faculdade do usuário',
    enum: Faculdade,
    example: 'ufop',
    required: false
  })
  @Column({ type: 'enum', enum: Faculdade, nullable: true })
  faculdade: Faculdade;

  @ApiProperty({
    description: 'Curso do usuário',
    example: 'Engenharia de Computação',
    required: false
  })
  @Column({ nullable: true })
  curso: string;

  @ApiProperty({
    description: 'Hierarquia do usuário na república',
    enum: UserHierarchy,
    example: 'morador',
    required: false
  })
  @Column({ type: 'enum', enum: UserHierarchy, nullable: true })
  hierarquia: UserHierarchy;

  @ApiProperty({
    description: 'Descrição/bio do usuário',
    example: 'Estudante de engenharia, ama música e esportes',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ApiProperty({
    description: 'Link da foto de perfil do usuário',
    example: 'https://example.com/profile-pictures/joao.jpg',
    required: false
  })
  @Column({ nullable: true })
  linkfotoPerfil: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Status de ativação do usuário',
    example: false
  })
  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  activationToken: string;

  @ApiProperty({
    description: 'República à qual o usuário pertence',
    type: () => Republic,
    required: false
  })
  @ManyToOne(() => Republic, republic => republic.users)
  @JoinColumn({ name: 'republic_id' })
  republic: Republic;

  @Column({ nullable: true })
  republic_id: string;

  // Relacionamento com redes sociais será definido após resolver importação circular

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do usuário',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 