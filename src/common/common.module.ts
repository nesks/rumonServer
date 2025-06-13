import { Global, Module } from '@nestjs/common';
import { DiscordLoggerService } from './services/discord-logger.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DiscordLoggerService],
  exports: [DiscordLoggerService],
})
export class CommonModule {} 