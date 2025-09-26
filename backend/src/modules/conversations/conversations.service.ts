import { Injectable,  } from '@nestjs/common';
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
    // 1. Validar usuário
    const user = await this.authService.validateUser(token);

    // 2. Salvar mensagem USER
    await this.messageRepository.createMessage(
      content,
      MessageSender.USER,
      conversationId,
      user.id,
    );

    // 3. Buscar histórico da conversa
    const messages = await this.getMessages(conversationId);

    // 4. Montar prompt para Gemini
    const prompt = messages.map((m) => `${m.sender}: ${m.content}`).join('\n');

    // 5. Chamar Gemini
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // 6. Salvar resposta AI
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
        // cria uma função async auxiliar
        const run = async () => {
          try {
            // 1. Validar usuário
            const user = await this.authService.validateUser(token);

            // 2. Salvar mensagem USER
            await this.messageRepository.createMessage(
              content,
              MessageSender.USER,
              conversationId,
              user.id,
            );

            // 3. Buscar histórico
            const messages = await this.getMessages(conversationId);
            const prompt = messages
              .map((m) => `${m.sender}: ${m.content}`)
              .join('\n');

            // 4. Chamar Gemini em stream
            const model = this.genAI.getGenerativeModel({
              model: 'gemini-2.5-flash',
            });
            const result = await model.generateContentStream(prompt);

            let fullResponse = '';

            for await (const chunk of result.stream) {
              const text = chunk.text();
              fullResponse += text;

              // envia cada pedaço via SSE
              subscriber.next({
                data: text,
              } as MessageEvent);
            }

            // 5. Salvar resposta AI completa
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

        // executa a função
        run();

        // retorno opcional de cleanup (quando o cliente fecha a conexão)
        return () => {
          console.log('SSE connection closed by client');
        };
      },
    );
  }
}
