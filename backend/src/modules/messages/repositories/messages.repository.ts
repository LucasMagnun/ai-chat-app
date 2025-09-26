import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { Message, MessageSender } from '@prisma/client';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(
    content: string,
    sender: MessageSender,
    conversationId: string,
    userId?: string
  ): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        sender,
        conversationId,
        userId,
      },
    });
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
