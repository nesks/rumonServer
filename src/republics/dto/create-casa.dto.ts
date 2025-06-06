import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCasaDto {
  @ApiProperty({
    description: 'Cidade onde está localizada a casa',
    example: 'Ouro Preto'
  })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({
    description: 'Sigla do estado (UF)',
    example: 'MG'
  })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({
    description: 'Endereço completo da casa',
    example: 'Rua das Flores, 123, Centro',
    required: false
  })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({
    description: 'Valor do aluguel da casa',
    example: 1500.00,
    required: false
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  valorAluguel?: number;

  @ApiProperty({
    description: 'Média total de gastos mensais',
    example: 2500.00,
    required: false
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  valorTotal?: number;

  @ApiProperty({
    description: 'Quantidade de vagas disponíveis na casa',
    example: 8
  })
  @IsInt()
  @IsPositive()
  quantidadeVagas: number;
} 