import { Controller, Post, Body, Param, Get, Headers } from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { Message } from '@prisma/client';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * Cria uma nova conversa para o usuário autenticado
   */
  @Post()
  async createConversation(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.conversationService.startConversation(token);
  }

  /**
   * Envia uma mensagem para a conversa e recebe resposta da IA
   */
  @Post(':id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @Body('content') content: string,
    @Headers('authorization') authHeader: string
  ): Promise<Message> {
    const token = authHeader?.replace('Bearer ', '');
    return this.conversationService.handleMessage(conversationId, content, token);
  }

  /**
   * Retorna o histórico de mensagens de uma conversa
   */
  @Get(':id/messages')
  async getMessages(@Param('id') conversationId: string): Promise<Message[]> {
    return this.conversationService.getMessages(conversationId);
  }
}
