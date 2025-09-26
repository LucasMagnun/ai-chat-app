import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MessageRepository } from './repositories/messages.repository';

@Module({
  providers: [MessageRepository, PrismaService],
  exports: [MessageRepository],
})
export class MessageModule {}
