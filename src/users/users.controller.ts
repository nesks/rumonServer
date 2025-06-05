import { Controller, Post, Body, Param, UseGuards, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  @ApiOperation({ summary: 'Obter informações completas do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Informações do usuário obtidas com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000'
        },
        name: {
          type: 'string',
          example: 'João Silva'
        },
        apelido: {
          type: 'string',
          example: 'Joãozinho'
        },
        email: {
          type: 'string',
          example: 'joao@email.com'
        },
        phone: {
          type: 'string',
          example: '+5511999999999'
        },
        periodoIngresso: {
          type: 'string',
          example: '24.1'
        },
        origem: {
          type: 'string',
          example: 'Belo Horizonte, MG'
        },
        faculdade: {
          type: 'string',
          enum: ['UFOP', 'UEMG'],
          example: 'UFOP'
        },
        curso: {
          type: 'string',
          example: 'Engenharia de Computação'
        },
        hierarquia: {
          type: 'string',
          enum: ['calouro', 'morador', 'decano', 'ex-morador'],
          example: 'morador'
        },
                 descricao: {
           type: 'string',
           example: 'Estudante de engenharia, ama música e esportes'
         },
         linkfotoPerfil: {
           type: 'string',
           example: 'https://example.com/profile-pictures/joao.jpg'
         },
         isActive: {
           type: 'boolean',
           example: true
         },
        republicName: {
          type: 'string',
          example: 'República dos Estudantes'
        },
        socialMedias: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              telefone: { type: 'string', example: '+5511999999999' },
              whatsapp: { type: 'string', example: '+5511999999999' },
              instagram: { type: 'string', example: '@joaosilva' },
              linkedin: { type: 'string', example: 'joao-silva-123' }
            }
          }
        },
        createdAt: {
          type: 'string',
          example: '2024-03-20T10:00:00Z'
        },
        updatedAt: {
          type: 'string',
          example: '2024-03-20T10:00:00Z'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @Get(':id')
  getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  @ApiOperation({ summary: 'Atualizar informações do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000'
        },
        name: {
          type: 'string',
          example: 'João Silva'
        },
        apelido: {
          type: 'string',
          example: 'Joãozinho'
        },
        email: {
          type: 'string',
          example: 'joao@email.com'
        },
        phone: {
          type: 'string',
          example: '+5511999999999'
        },
        periodoIngresso: {
          type: 'string',
          example: '24.1'
        },
        origem: {
          type: 'string',
          example: 'Belo Horizonte, MG'
        },
        faculdade: {
          type: 'string',
          enum: ['UFOP', 'UEMG'],
          example: 'UFOP'
        },
        curso: {
          type: 'string',
          example: 'Engenharia de Computação'
        },
        hierarquia: {
          type: 'string',
          enum: ['calouro', 'morador', 'decano', 'ex-morador'],
          example: 'morador'
        },
        descricao: {
          type: 'string',
          example: 'Estudante de engenharia, ama música e esportes'
        },
        linkfotoPerfil: {
          type: 'string',
          example: 'https://example.com/profile-pictures/joao.jpg'
        },
        isActive: {
          type: 'boolean',
          example: true
        },
        updatedAt: {
          type: 'string',
          example: '2024-03-20T10:00:00Z'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email ou telefone já em uso por outro usuário' })
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}