import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostVisibility } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FeedService {
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
    const post = this.postRepository.create({
      ...createPostDto,
      author: user,
    });

    return this.postRepository.save(post);
  }

  async deletePost(user: User, postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.author.id !== user.id) {
      throw new ForbiddenException('Você não tem permissão para excluir este post');
    }

    await this.postRepository.softDelete(postId);
  }

  async createComment(user: User, postId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
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
      relations: ['author', 'post'],
    });

    if (!commentWithRelations) {
      throw new NotFoundException('Erro ao criar comentário');
    }

    return commentWithRelations;
  }

  async deleteComment(user: User, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('Você não tem permissão para excluir este comentário');
    }

    await this.commentRepository.softDelete(commentId);
  }

  async togglePostLike(user: User, postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    // Verificar se já existe um like
    const existingLike = await this.postLikeRepository
      .createQueryBuilder('like')
      .where('like.userId = :userId', { userId: user.id })
      .andWhere('like.postId = :postId', { postId })
      .getOne();

    if (existingLike) {
      // Se existir, deletar usando query builder
      await this.postLikeRepository
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId: user.id })
        .andWhere('postId = :postId', { postId })
        .execute();
    } else {
      // Se não existir, criar novo like
      const like = this.postLikeRepository.create({
        user,
        post,
      });
      await this.postLikeRepository.save(like);
    }
  }

  async toggleCommentLike(user: User, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    // Verificar se já existe um like
    const existingLike = await this.commentLikeRepository
      .createQueryBuilder('like')
      .where('like.userId = :userId', { userId: user.id })
      .andWhere('like.commentId = :commentId', { commentId })
      .getOne();

    if (existingLike) {
      // Se existir, deletar usando query builder
      await this.commentLikeRepository
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId: user.id })
        .andWhere('commentId = :commentId', { commentId })
        .execute();
    } else {
      // Se não existir, criar novo like
      const like = this.commentLikeRepository.create({
        user,
        comment,
      });
      await this.commentLikeRepository.save(like);
    }
  }

  async getFeed(user: User): Promise<Post[]> {
    return this.postRepository.find({
      where: [
        { visibility: PostVisibility.ALL },
        { visibleUsers: { id: user.id } },
        { visibleRepublics: { users: { id: user.id } } },
      ],
      relations: ['author', 'comments', 'comments.author', 'likes', 'likes.user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
} 