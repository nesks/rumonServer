import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Ótimo post!'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Emoticons do comentário',
    required: false,
    example: { '😊': 1, '👍': 2 }
  })
  @IsObject()
  @IsOptional()
  emoticons?: { [key: string]: number };
} 