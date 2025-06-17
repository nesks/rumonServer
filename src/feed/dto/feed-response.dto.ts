import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';
import { User } from '../../users/entities/user.entity';

export class FeedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ nullable: true })
  mediaUrl: string | null;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  author: {
    id: string;
    name: string;
    email: string;
    linkfotoPerfil: string | null;
  };

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  userLiked: boolean;

  @ApiProperty({ type: [Object] })
  comments: Array<{
    id: string;
    content: string;
    emoticons: { [key: string]: number };
    createdAt: Date;
    author: {
      id: string;
      name: string;
      email: string;
      linkfotoPerfil: string | null;
      republic: {
        id: string;
        name: string;
      } | null;
      periodoIngresso: string;
      hierarquia: string;
    };
  }>;
} 