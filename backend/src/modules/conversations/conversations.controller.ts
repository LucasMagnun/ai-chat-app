import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Headers,
  UseGuards,
  Sse,
  Query,
} from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { Message } from '@prisma/client';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';
import { Observable } from 'rxjs';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * Cria uma nova conversa para o usuário autenticado
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createConversation(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.conversationService.startConversation(token);
  }

  @Post(':id/messages')
  @UseGuards(FirebaseAuthGuard)
  async sendMessage(
    @Param('id') conversationId: string,
    @Headers('authorization') authHeader: string,
    @Body('content') content: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.conversationService.handleMessage(
      conversationId,
      content,
      token,
    );
  }

  /**
   * Retorna o histórico de mensagens de uma conversa
   */
  @Get(':id/messages')
  @UseGuards(FirebaseAuthGuard)
  async getMessages(@Param('id') conversationId: string): Promise<Message[]> {
    return this.conversationService.getMessages(conversationId);
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async getConversation(
    @Param('id') conversationId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.conversationService.getConversation(conversationId, token);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getAllConversations(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.conversationService.findAllUserConversations(token);
  }

  @Sse(':id/stream')
  @UseGuards(FirebaseAuthGuard)
  streamMessages(
    @Param('id') conversationId: string,
    @Query('content') content: string,
    @Query('token') token: string, // pegar token direto da query
  ): Observable<MessageEvent> {
    return this.conversationService.streamMessage(
      conversationId,
      content,
      token,
    );
  }
}
