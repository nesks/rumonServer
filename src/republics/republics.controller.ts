import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RepublicsService } from './republics.service';
import { CreateRepublicDto } from './dto/create-republic.dto';
import { UpdateRepublicDto } from './dto/update-republic.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('republics')
@ApiBearerAuth()
@Controller('republics')
@UseGuards(JwtAuthGuard)
export class RepublicsController {
  constructor(private readonly republicsService: RepublicsService) {}

  @ApiOperation({ summary: 'Criar uma nova república' })
  @ApiResponse({ 
    status: 201, 
    description: 'República criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'República dos Estudantes' },
        address: { type: 'string', example: 'Rua das Flores, 123' },
        description: { type: 'string', example: 'República para estudantes universitários' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @Post()
  create(@Body() createRepublicDto: CreateRepublicDto) {
    return this.republicsService.create(createRepublicDto);
  }

  @ApiOperation({ summary: 'Listar todas as repúblicas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de repúblicas retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          name: { type: 'string', example: 'República dos Estudantes' },
          address: { type: 'string', example: 'Rua das Flores, 123' },
          description: { type: 'string', example: 'República para estudantes universitários' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  @Get()
  findAll() {
    return this.republicsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar uma república específica' })
  @ApiResponse({ 
    status: 200, 
    description: 'República encontrada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'República dos Estudantes' },
        address: { type: 'string', example: 'Rua das Flores, 123' },
        description: { type: 'string', example: 'República para estudantes universitários' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.republicsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar uma república' })
  @ApiResponse({ 
    status: 200, 
    description: 'República atualizada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'República dos Estudantes' },
        address: { type: 'string', example: 'Rua das Flores, 123' },
        description: { type: 'string', example: 'República para estudantes universitários' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepublicDto: UpdateRepublicDto) {
    return this.republicsService.update(id, updateRepublicDto);
  }

  @ApiOperation({ summary: 'Remover uma república' })
  @ApiResponse({ status: 200, description: 'República removida com sucesso' })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.republicsService.remove(id);
  }
} 