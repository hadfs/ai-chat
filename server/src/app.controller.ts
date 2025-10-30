import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './services/chat.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly chatService: ChatService) {}

  @Get("/hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/chat")
  async chat(@Body() body: any) {
    return this.chatService.chat(body)
  }

  @Get('/models')
  async models() {
    const result = await  this.chatService.getModelList()
    if (result) {
      return {
        data: result
      }
    }
    return null
  }
}
