import { Module } from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { MessageModule } from '../messages/messages.module';
import { AuthModule } from '../auth/auth.module';
import { ConversationController } from './conversations.controller';
import { ConversationRepository } from './repositories/conversations.repository';
import { PrismaService } from 'src/config/prisma.service';

@Module({
  imports: [MessageModule, AuthModule],
  providers: [ConversationService, ConversationRepository, PrismaService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}