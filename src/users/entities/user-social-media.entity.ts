import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_social_medias')
export class UserSocialMedia {
  @ApiProperty({
    description: 'ID único da rede social',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+5511999999999',
    required: false
  })
  @Column({ nullable: true })
  telefone: string;

  @ApiProperty({
    description: 'WhatsApp do usuário',
    example: '+5511999999999',
    required: false
  })
  @Column({ nullable: true })
  whatsapp: string;

  @ApiProperty({
    description: 'Instagram do usuário',
    example: '@joaosilva',
    required: false
  })
  @Column({ nullable: true })
  instagram: string;

  @ApiProperty({
    description: 'LinkedIn do usuário',
    example: 'joao-silva-123',
    required: false
  })
  @Column({ nullable: true })
  linkedin: string;

  @ApiProperty({
    description: 'Usuário dono das redes sociais',
    type: () => User
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-03-20T10:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 