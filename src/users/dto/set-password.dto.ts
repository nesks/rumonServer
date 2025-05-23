import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPasswordDto {
  @ApiProperty({
    description: 'Nova senha do usuário',
    example: '123456',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
} 