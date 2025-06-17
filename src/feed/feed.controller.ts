import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { Comment as CommentEntity } from './entities/comment.entity';
import { FeedResponseDto } from './dto/feed-response.dto';

@ApiTags('feed')
@ApiBearerAuth()
@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova postagem' })
  @ApiResponse({ status: 201, description: 'Postagem criada com sucesso', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.feedService.createPost(req.user, createPostDto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Excluir uma postagem' })
  @ApiResponse({ status: 200, description: 'Postagem excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para excluir' })
  @ApiResponse({ status: 404, description: 'Postagem não encontrada' })
  deletePost(@Request() req, @Param('id') id: string) {
    return this.feedService.deletePost(req.user, id);
  }

  @Post('posts/:id/comments')
  @ApiOperation({ summary: 'Criar um comentário em uma postagem' })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso', type: CommentEntity })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Postagem não encontrada' })
  createComment(
    @Request() req,
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.feedService.createComment(req.user, postId, createCommentDto);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Excluir um comentário' })
  @ApiResponse({ status: 200, description: 'Comentário excluído com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para excluir' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado' })
  deleteComment(@Request() req, @Param('id') id: string) {
    return this.feedService.deleteComment(req.user, id);
  }

  @Post('posts/:id/like')
  @ApiOperation({ summary: 'Curtir/descurtir uma postagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Operação realizada com sucesso',
    schema: {
      type: 'object',
      properties: {
        liked: {
          type: 'boolean',
          description: 'Indica se o post está curtido após a operação'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Postagem não encontrada' })
  async togglePostLike(@Request() req, @Param('id') id: string) {
    return this.feedService.togglePostLike(req.user, id);
  }

  @Post('comments/:id/like')
  @ApiOperation({ summary: 'Curtir/descurtir um comentário' })
  @ApiResponse({ status: 200, description: 'Operação realizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado' })
  toggleCommentLike(@Request() req, @Param('id') id: string) {
    return this.feedService.toggleCommentLike(req.user, id);
  }

  @Get()
  @ApiOperation({ summary: 'Obter o feed do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Feed retornado com sucesso', 
    type: [FeedResponseDto],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          content: { type: 'string' },
          mediaUrl: { type: 'string', nullable: true },
          visibility: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          author: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              linkfotoPerfil: { type: 'string', nullable: true }
            }
          },
          likesCount: { type: 'number' },
          userLiked: { type: 'boolean' },
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                content: { type: 'string' },
                emoticons: { 
                  type: 'object',
                  additionalProperties: { type: 'number' }
                },
                createdAt: { type: 'string', format: 'date-time' },
                author: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    linkfotoPerfil: { type: 'string', nullable: true },
                    republic: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      }
                    },
                    periodoIngresso: { 
                      type: 'string',
                      description: 'Período de ingresso no formato ano.semestre (ex: 2023.1)'
                    },
                    hierarquia: { 
                      type: 'string',
                      description: 'Hierarquia do usuário na república'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getFeed(@Request() req) {
    return this.feedService.getFeed(req.user);
  }
} 