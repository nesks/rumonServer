import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepublicsService } from './republics.service';
import { RepublicsController } from './republics.controller';
import { Republic } from './entities/republic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Republic])],
  controllers: [RepublicsController],
  providers: [RepublicsService],
  exports: [RepublicsService],
})
export class RepublicsModule {} 