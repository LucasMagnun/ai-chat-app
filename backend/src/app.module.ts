import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ConversationModule } from './modules/conversations/conversations.module';
import { MessageModule } from './modules/messages/messages.module';

@Module({
  imports: [PrismaModule, UsersModule, ConversationModule, MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
