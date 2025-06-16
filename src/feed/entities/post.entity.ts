import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Republic } from '../../republics/entities/republic.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum PostVisibility {
  ALL = 'all',
  REPUBLICS = 'republics',
  USERS = 'users',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.TEXT
  })
  type: PostType;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  mediaUrl: string;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.ALL
  })
  visibility: PostVisibility;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToMany(() => Republic)
  @JoinTable()
  visibleRepublics: Republic[];

  @ManyToMany(() => User)
  @JoinTable()
  visibleUsers: User[];

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @OneToMany(() => PostLike, like => like.post)
  likes: PostLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
} 