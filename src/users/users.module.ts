import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserSocialMedia } from './entities/user-social-media.entity';
import { RepublicsModule } from '../republics/republics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSocialMedia]),
    RepublicsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 