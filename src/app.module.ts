import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RepublicsModule } from './republics/republics.module';
import { EventsModule } from './events/events.module';
import { User } from './users/entities/user.entity';
import { Republic } from './republics/entities/republic.entity';
import { Casa } from './republics/entities/casa.entity';
import { UserSocialMedia } from './users/entities/user-social-media.entity';
import { Event } from './events/entities/event.entity';
import { EventType } from './events/entities/event-type.entity';
import { EventRepublic } from './events/entities/event-republic.entity';
import { EventInvite } from './events/entities/event-invite.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { FeedModule } from './feed/feed.module';
import { Post } from './feed/entities/post.entity';
import { Comment } from './feed/entities/comment.entity';
import { PostLike } from './feed/entities/post-like.entity';
import { CommentLike } from './feed/entities/comment-like.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Configuração para usar DATABASE_URL (Neon/Vercel)
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [
              User, 
              Republic, 
              Casa, 
              UserSocialMedia, 
              Event, 
              EventType, 
              EventRepublic, 
              EventInvite,
              Post,
              Comment,
              PostLike,
              CommentLike
            ],
            migrations: ['dist/migrations/*.js'],
            migrationsRun: false,
            synchronize: configService.get('NODE_ENV') !== 'production',
            ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          };
        }
        
        // Configuração fallback para desenvolvimento local
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'rumon'),
          entities: [
            User, 
            Republic, 
            Casa, 
            UserSocialMedia, 
            Event, 
            EventType, 
            EventRepublic, 
            EventInvite,
            Post,
            Comment,
            PostLike,
            CommentLike
          ],
          migrations: ['dist/migrations/*.js'],
          migrationsRun: false,
          synchronize: configService.get('NODE_ENV') !== 'production',
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RepublicsModule,
    EventsModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
