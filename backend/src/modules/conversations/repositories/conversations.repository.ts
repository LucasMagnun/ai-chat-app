import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { Conversation, Message } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(
    userId: string,
    title?: string,
  ): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: title, 
      },
    });
  }

  async findConversationById(
    conversationId: string,
  ): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
  }

  async createMessage(data: {
    content: string;
    sender: 'USER' | 'AI';
    conversationId: string;
    userId?: string;
  }): Promise<Message> {
    return this.prisma.message.create({ data });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(conversationId: string, userId: string) {
    return this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      include: { messages: true },
    });
  }

  async findAllUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
