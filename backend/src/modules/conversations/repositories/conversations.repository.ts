import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { Conversation, Message } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(userId: string): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: { userId },
    });
  }

  async findConversationById(conversationId: string): Promise<Conversation | null> {
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
}
