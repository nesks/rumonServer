import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Pré-registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário pré-registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email ou telefone já cadastrado' })
  @Post('pre-register')
  preRegister(@Body() createUserDto: CreateUserDto) {
    return this.usersService.preRegister(createUserDto);
  }

  @ApiOperation({ summary: 'Definir senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha definida com sucesso' })
  @ApiResponse({ status: 404, description: 'Token inválido' })
  @Post('set-password/:token')
  setPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    return this.usersService.setPassword(token, password);
  }
} 