import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

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