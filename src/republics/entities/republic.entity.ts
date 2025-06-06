import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Casa } from './casa.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum RepublicTipo {
  MASCULINA = 'masculina',
  FEMININA = 'feminina',
  MISTA = 'mista'
}

export enum RepublicStatus {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
  REFORMANDO = 'reformando',
  SUSPENDED = 'suspended'
}

@Entity('republics')
export class Republic {
  @ApiProperty({
    description: 'ID único da república',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome da república',
    example: 'República dos Estudantes'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Endereço da república',
    example: 'Rua das Flores, 123'
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Descrição da república',
    example: 'República para estudantes universitários',
    required: false
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Link da foto da bandeira da república',
    example: 'https://example.com/republic-flags/republica-estudantes.jpg',
    required: false
  })
  @Column({ nullable: true })
  linkFoto: string;

  @ApiProperty({
    description: 'Tipo da república',
    enum: RepublicTipo,
    example: 'mista',
    required: false
  })
  @Column({ type: 'enum', enum: RepublicTipo, nullable: true })
  tipo: RepublicTipo;

  @ApiProperty({
    description: 'Data de fundação da república',
    example: '1995-03-15',
    required: false
  })
  @Column({ type: 'date', nullable: true })
  fundada_em: Date;

  @ApiProperty({
    description: 'Status atual da república',
    enum: RepublicStatus,
    example: 'ativa',
    required: false
  })
  @Column({ type: 'enum', enum: RepublicStatus, nullable: true })
  status: RepublicStatus;

  @ApiProperty({
    description: 'Foto de capa da república',
    example: 'https://example.com/covers/republica-estudantes.jpg',
    required: false
  })
  @Column({ nullable: true })
  foto_capa: string;

  @ApiProperty({
    description: 'Link do Instagram da república',
    example: 'https://instagram.com/republicaestudantes',
    required: false
  })
  @Column({ nullable: true })
  instagram: string;

  @ApiProperty({
    description: 'Hino da república',
    example: 'Letra do hino da república...',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  hino: string;

  @ApiProperty({
    description: 'Link para o estatuto em PDF',
    example: 'https://example.com/estatutos/republica-estudantes.pdf',
    required: false
  })
  @Column({ nullable: true })
  linkEstatutoPdf: string;

  @ApiProperty({
    description: 'Usuário responsável Rumon',
    type: () => User,
    required: false
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usuario_rumon_id' })
  usuarioRumon: User;

  @Column({ nullable: true })
  usuario_rumon_id: string;

  @ApiProperty({
    description: 'Casa da república',
    type: () => Casa,
    required: false
  })
  @OneToOne(() => Casa, { nullable: true })
  @JoinColumn({ name: 'casa_id' })
  casa: Casa;

  @Column({ nullable: true })
  casa_id: string;

  @ApiProperty({
    description: 'Lista de usuários da república',
    type: () => [User],
    required: false
  })
  @OneToMany(() => User, user => user.republic)
  users: User[];

  @ApiProperty({
    description: 'Data de criação da república',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização da república',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updated_at: Date;
} 