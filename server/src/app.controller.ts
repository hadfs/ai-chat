import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './services/chat.service';
import { getTokens } from './lib/token';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly chatService: ChatService) { }

  @Get("/hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/chat")
  async chat(@Body() body: any) {
    return this.chatService.chat(body)
  }
  @Get('/chatStream')
  async chatStream(@Res() res, @Query('prompt') prompt: string, @Query('model') model: string) {
    return this.chatService.chatStream(res, {
      message: prompt,
      model: model
    })
  }

  @Get('/models')
  async models() {
    const result = await this.chatService.getModelList()
    if (result) {
      return {
        data: result
      }
    }
    return null
  }
}
