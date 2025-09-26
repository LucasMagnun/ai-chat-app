import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageRepository } from '../messages/repositories/messages.repository';
import { Message, MessageSender } from '@prisma/client';
import { ConversationRepository } from './repositories/conversations.repository';
import * as moment from 'moment';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class ConversationService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  constructor(
    private readonly authService: AuthService,
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async handleMessage(
    conversationId: string,
    content: string,
    token: string,
  ): Promise<Message> {
    const user = await this.authService.validateUser(token);

    await this.messageRepository.createMessage(
      content,
      MessageSender.USER,
      conversationId,
      user.id,
    );

    const messages = await this.getMessages(conversationId);

    const prompt = messages.map((m) => `${m.sender}: ${m.content}`).join('\n');

    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    const savedAiMessage = await this.messageRepository.createMessage(
      aiResponse,
      MessageSender.AI,
      conversationId,
    );

    return savedAiMessage;
  }

  async startConversation(token: string) {
    const user = await this.authService.validateUser(token);
    const title = `Chat com IA - ${moment().format('DD/MM/YYYY HH:mm')}`;
    return this.conversationRepository.createConversation(user.id, title);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepository.getMessagesByConversationId(conversationId);
  }

  async getConversation(conversationId: string, token: string) {
    const user = await this.authService.validateUser(token);
    return this.conversationRepository.findById(conversationId, user.id);
  }

  async findAllUserConversations(token: string) {
    const user = await this.authService.validateUser(token); // verifica o usuário
    return this.conversationRepository.findAllUserConversations(user.id);
  }

  streamMessage(
    conversationId: string,
    content: string,
    token: string,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>(
      (subscriber: Subscriber<MessageEvent>) => {
        const run = async () => {
          try {
            const user = await this.authService.validateUser(token);
            await this.messageRepository.createMessage(
              content,
              MessageSender.USER,
              conversationId,
              user.id,
            );

            const messages = await this.getMessages(conversationId);
            const prompt = messages
              .map((m) => `${m.sender}: ${m.content}`)
              .join('\n');

            const model = this.genAI.getGenerativeModel({
              model: 'gemini-2.5-flash',
            });
            const result = await model.generateContentStream(prompt);

            let fullResponse = '';

            for await (const chunk of result.stream) {
              const text = chunk.text();
              fullResponse += text;

              subscriber.next({
                data: text,
              } as MessageEvent);
            }

            await this.messageRepository.createMessage(
              fullResponse,
              MessageSender.AI,
              conversationId,
            );

            subscriber.complete();
          } catch (err) {
            subscriber.error(err);
          }
        };

        run();

        return () => {
          console.log('SSE connection closed by client');
        };
      },
    );
  }
}
