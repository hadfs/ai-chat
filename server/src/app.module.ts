import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './services/chat.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatService],
})
export class AppModule {}
