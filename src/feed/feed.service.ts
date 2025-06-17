import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostVisibility } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { FeedResponseDto } from './dto/feed-response.dto';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
  ) {}

  async createPost(user: User, createPostDto: CreatePostDto): Promise<Post> {
    this.logger.debug(`Criando post para usuário ${user.id}`);
    const post = this.postRepository.create({
      ...createPostDto,
      author: user,
    });

    const savedPost = await this.postRepository.save(post);
    this.logger.debug(`Post criado com sucesso: ${savedPost.id}`);
    return savedPost;
  }

  async deletePost(user: User, postId: string): Promise<void> {
    this.logger.debug(`Tentando deletar post ${postId} do usuário ${user.id}`);
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      this.logger.warn(`Post ${postId} não encontrado`);
      throw new NotFoundException('Post não encontrado');
    }

    if (post.author.id !== user.id) {
      this.logger.warn(`Usuário ${user.id} tentou deletar post ${postId} sem permissão`);
      throw new ForbiddenException('Você não tem permissão para excluir este post');
    }

    await this.postRepository.softDelete(postId);
    this.logger.debug(`Post ${postId} deletado com sucesso`);
  }

  async createComment(user: User, postId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.debug(`Criando comentário para post ${postId} do usuário ${user.id}`);
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      this.logger.warn(`Post ${postId} não encontrado para comentário`);
      throw new NotFoundException('Post não encontrado');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      author: user,
      post,
    });

    const savedComment = await this.commentRepository.save(comment);
    
    // Carregar o comentário com as relações necessárias
    const commentWithRelations = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'post', 'post.author'],
      select: {
        id: true,
        content: true,
        emoticons: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          linkfotoPerfil: true
        },
        post: {
          id: true,
          type: true,
          content: true,
          mediaUrl: true,
          author: {
            id: true,
            name: true,
            email: true,
            linkfotoPerfil: true
          }
        }
      }
    });

    if (!commentWithRelations) {
      this.logger.error(`Erro ao criar comentário para post ${postId}`);
      throw new NotFoundException('Erro ao criar comentário');
    }

    this.logger.debug(`Comentário criado com sucesso para post ${postId}`);
    return commentWithRelations;
  }

  async deleteComment(user: User, commentId: string): Promise<void> {
    this.logger.debug(`Tentando deletar comentário ${commentId} do usuário ${user.id}`);
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      this.logger.warn(`Comentário ${commentId} não encontrado`);
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.author.id !== user.id) {
      this.logger.warn(`Usuário ${user.id} tentou deletar comentário ${commentId} sem permissão`);
      throw new ForbiddenException('Você não tem permissão para excluir este comentário');
    }

    await this.commentRepository.softDelete(commentId);
    this.logger.debug(`Comentário ${commentId} deletado com sucesso`);
  }

  async togglePostLike(user: User, postId: string): Promise<{ liked: boolean }> {
    this.logger.debug(`Tentando curtir/descurtir post ${postId} do usuário ${user.id}`);
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      this.logger.warn(`Post ${postId} não encontrado para like`);
      throw new NotFoundException('Post não encontrado');
    }

    // Verificar se já existe um like
    const existingLike = await this.postLikeRepository.findOne({
      where: {
        user: { id: user.id },
        post: { id: postId }
      }
    });

    if (existingLike) {
      // Se existir, remover o like
      await this.postLikeRepository.remove(existingLike);
      this.logger.debug(`Like removido do post ${postId} pelo usuário ${user.id}`);
      return { liked: false };
    } else {
      // Se não existir, criar novo like
      const like = this.postLikeRepository.create({
        user,
        post,
      });
      await this.postLikeRepository.save(like);
      this.logger.debug(`Like adicionado ao post ${postId} pelo usuário ${user.id}`);
      return { liked: true };
    }
  }

  async toggleCommentLike(user: User, commentId: string): Promise<void> {
    this.logger.debug(`Tentando curtir/descurtir comentário ${commentId} do usuário ${user.id}`);
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      this.logger.warn(`Comentário ${commentId} não encontrado para like`);
      throw new NotFoundException('Comentário não encontrado');
    }

    // Verificar se já existe um like
    const existingLike = await this.commentLikeRepository.findOne({
      where: {
        user: { id: user.id },
        comment: { id: commentId }
      }
    });

    if (existingLike) {
      // Se existir, deletar usando softDelete
      await this.commentLikeRepository.softDelete(existingLike.id);
      this.logger.debug(`Like removido do comentário ${commentId} pelo usuário ${user.id}`);
    } else {
      // Se não existir, criar novo like
      const like = this.commentLikeRepository.create({
        user,
        comment,
      });
      await this.commentLikeRepository.save(like);
      this.logger.debug(`Like adicionado ao comentário ${commentId} pelo usuário ${user.id}`);
    }
  }

  async getFeed(user: User): Promise<FeedResponseDto[]> {
    this.logger.debug(`Buscando feed para usuário ${user.id}`);
    const posts = await this.postRepository.find({
      where: [
        { visibility: PostVisibility.ALL },
        // { visibility: PostVisibility.USERS, visibleUsers: { id: user.id } },
        // { visibility: PostVisibility.REPUBLICS, visibleRepublics: { users: { id: user.id } } }
      ],
      relations: [
        'author', 
        'comments', 
        'comments.author', 
        'comments.author.republic',
        'likes', 
        'likes.user'
      ],
      order: {
        createdAt: 'DESC'
      }
    });

    const feedResponse = await Promise.all(posts.map(async (post) => {
      const likesCount = post.likes?.length || 0;
      const userLiked = post.likes?.some(like => like.user.id === user.id) || false;

      return {
        id: post.id,
        type: post.type,
        content: post.content,
        mediaUrl: post.mediaUrl,
        visibility: post.visibility,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          linkfotoPerfil: post.author.linkfotoPerfil
        },
        likesCount,
        userLiked,
        comments: post.comments?.map(comment => ({
          id: comment.id,
          content: comment.content,
          emoticons: comment.emoticons,
          createdAt: comment.createdAt,
          author: {
            id: comment.author.id,
            name: comment.author.name,
            email: comment.author.email,
            linkfotoPerfil: comment.author.linkfotoPerfil,
            republic: comment.author.republic ? {
              id: comment.author.republic.id,
              name: comment.author.republic.name
            } : null,
            periodoIngresso: comment.author.periodoIngresso,
            hierarquia: comment.author.hierarquia
          }
        })) || []
      };
    }));

    this.logger.debug(`Feed retornado com ${feedResponse.length} posts para usuário ${user.id}`);
    return feedResponse;
  }
} 