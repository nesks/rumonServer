import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Pré-registrar um novo usuário' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário pré-registrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Pré-cadastro realizado com sucesso'
        },
        userId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      }
    }
  })
  @ApiResponse({ status: 409, description: 'Email ou telefone já cadastrado' })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @ApiBody({ type: CreateUserDto })
  @Post('pre-register')
  preRegister(@Body() createUserDto: CreateUserDto) {
    return this.usersService.preRegister(createUserDto);
  }

  @ApiOperation({ summary: 'Definir senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha definida com sucesso' })
  @ApiResponse({ status: 404, description: 'Token inválido' })
  @ApiBody({ type: SetPasswordDto })
  @Post('set-password/:token')
  setPassword(
    @Param('token') token: string,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.usersService.setPassword(token, setPasswordDto.password);
  }
}