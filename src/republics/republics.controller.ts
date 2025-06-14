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
        linkFoto: { type: 'string', example: 'https://example.com/republic-flags/republica-estudantes.jpg' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido ou ausente' })
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
          description: { type: 'string', example: 'República para estudantes universitários' },
          linkFoto: { type: 'string', example: 'https://example.com/republic-flags/republica-estudantes.jpg' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido ou ausente' })
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
        linkFoto: { type: 'string', example: 'https://example.com/republic-flags/republica-estudantes.jpg' },
        tipo: { type: 'string', enum: ['masculina', 'feminina', 'mista'], example: 'mista' },
        fundada_em: { type: 'string', format: 'date', example: '1995-03-15' },
        status: { type: 'string', enum: ['ativa', 'inativa', 'reformando', 'suspended'], example: 'ativa' },
        foto_capa: { type: 'string', example: 'https://example.com/covers/republica-estudantes.jpg' },
        instagram: { type: 'string', example: 'https://instagram.com/republicaestudantes' },
        hino: { type: 'string', example: 'Letra do hino da república...' },
        linkEstatutoPdf: { type: 'string', example: 'https://example.com/estatutos/republica-estudantes.pdf' },
        usuarioRumon: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        casa: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            cidade: { type: 'string', example: 'Ouro Preto' },
            estado: { type: 'string', example: 'MG' },
            endereco: { type: 'string', example: 'Rua das Flores, 123, Centro' },
            valorAluguel: { type: 'number', example: 1500.00 },
            valorTotal: { type: 'number', example: 2500.00 },
            quantidadeVagas: { type: 'number', example: 8 }
          }
        },
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
  @ApiResponse({ status: 401, description: 'Token de acesso inválido ou ausente' })
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
        name: { type: 'string', example: 'Alcatraz' },
        address: { type: 'string', example: 'Rua das Flores, 123' },
        description: { type: 'string', example: 'República para estudantes universitários' },
        tipo: { type: 'string', enum: ['masculina', 'feminina', 'mista'], example: 'mista' },
        fundada_em: { type: 'string', format: 'date', example: '1995-03-15' },
        status: { type: 'string', enum: ['ativa', 'inativa', 'reformando', 'suspended'], example: 'ativa' },
        linkFoto: { type: 'string', example: 'https://mhbddklqdbkyqqsluhxz.supabase.co/storage/v1/object/public/rumon-files/republics/ac6ca29b-5906-4b9d-857a-14b84ec599a5/profile-ac6ca29b-5906-4b9d-857a-14b84ec599a5-1749673027661.jpg' },
        foto_capa: { type: 'string', example: 'https://example.com/covers/republica-estudantes.jpg' },
        instagram: { type: 'string', example: 'https://instagram.com/republicaestudantes' },
        hino: { type: 'string', example: 'Letra do hino da república...' },
        linkEstatutoPdf: { type: 'string', example: 'https://example.com/estatutos/republica-estudantes.pdf' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido ou ausente' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepublicDto: UpdateRepublicDto) {
    return this.republicsService.update(id, updateRepublicDto);
  }

  @ApiOperation({ summary: 'Remover uma república' })
  @ApiResponse({ status: 200, description: 'República removida com sucesso' })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido ou ausente' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.republicsService.remove(id);
  }

  @ApiOperation({ summary: 'Listar todos os usuários de uma república' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários da república retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          name: { type: 'string', example: 'João Silva' },
          linkfotoPerfil: { type: 'string', example: 'https://example.com/profile-pictures/joao.jpg' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'República não encontrada' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido ou ausente' })
  @Get(':id/users')
  getRepublicUsers(@Param('id') id: string) {
    return this.republicsService.getRepublicUsers(id);
  }
} 