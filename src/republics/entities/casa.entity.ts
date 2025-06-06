import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Republic } from './republic.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('casas')
export class Casa {
  @ApiProperty({
    description: 'ID único da casa',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Cidade onde está localizada a casa',
    example: 'Ouro Preto'
  })
  @Column()
  cidade: string;

  @ApiProperty({
    description: 'Sigla do estado (UF)',
    example: 'MG'
  })
  @Column({ length: 2 })
  estado: string;

  @ApiProperty({
    description: 'Endereço completo da casa',
    example: 'Rua das Flores, 123, Centro',
    required: false
  })
  @Column({ nullable: true })
  endereco: string;

  @ApiProperty({
    description: 'Valor do aluguel da casa',
    example: 1500.00,
    required: false
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valorAluguel: number;

  @ApiProperty({
    description: 'Média total de gastos mensais',
    example: 2500.00,
    required: false
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valorTotal: number;

  @ApiProperty({
    description: 'Quantidade de vagas disponíveis na casa',
    example: 8
  })
  @Column({ type: 'int' })
  quantidadeVagas: number;

  @ApiProperty({
    description: 'República associada à casa',
    type: () => Republic,
    required: false
  })
  @OneToOne(() => Republic, republic => republic.casa)
  republic: Republic;

  @ApiProperty({
    description: 'Data de criação da casa',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização da casa',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updated_at: Date;
} 