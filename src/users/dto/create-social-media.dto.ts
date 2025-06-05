import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialMediaDto {
  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+5511999999999',
    required: false
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    description: 'WhatsApp do usuário',
    example: '+5511999999999',
    required: false
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({
    description: 'Instagram do usuário',
    example: '@joaosilva',
    required: false
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    description: 'LinkedIn do usuário',
    example: 'joao-silva-123',
    required: false
  })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    description: 'ID do usuário dono das redes sociais',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  user_id: string;
} 