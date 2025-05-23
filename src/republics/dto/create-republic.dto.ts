import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRepublicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  description?: string;
} 