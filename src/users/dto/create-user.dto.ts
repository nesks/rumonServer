import { IsString, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
} 