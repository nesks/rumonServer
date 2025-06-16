import { IsEnum, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { PostType, PostVisibility } from '../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    enum: PostType,
    description: 'Tipo da postagem (texto, imagem ou vídeo)',
    example: PostType.TEXT
  })
  @IsEnum(PostType)
  type: PostType;

  @ApiProperty({
    description: 'Conteúdo da postagem (texto)',
    required: false,
    example: 'Olá, mundo!'
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'URL da mídia (imagem ou vídeo)',
    required: false,
    example: 'https://exemplo.com/imagem.jpg'
  })
  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @ApiProperty({
    enum: PostVisibility,
    description: 'Visibilidade da postagem',
    example: PostVisibility.ALL
  })
  @IsEnum(PostVisibility)
  visibility: PostVisibility;

  @ApiProperty({
    description: 'IDs das repúblicas que podem ver a postagem',
    required: false,
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000']
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  visibleRepublicIds?: string[];

  @ApiProperty({
    description: 'IDs dos usuários que podem ver a postagem',
    required: false,
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000']
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  visibleUserIds?: string[];
} 