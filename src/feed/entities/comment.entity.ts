import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';
import { CommentLike } from './comment-like.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  emoticons: { [key: string]: number };

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @OneToMany(() => CommentLike, like => like.comment)
  likes: CommentLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
} 