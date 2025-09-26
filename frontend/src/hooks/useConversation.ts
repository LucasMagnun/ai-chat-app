import { useState, useEffect } from "react";
import * as ConversationService from "../services/conversationService";
import { useAuth } from "./useAuth";
import { Message } from "../types/message";

export function useConversation(conversationId?: string) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      ConversationService.getMessages(conversationId)
        .then((msgs) => setMessages(msgs))
        .finally(() => setLoading(false));
    }
  }, [conversationId]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !token) return;
    const newMessage = await ConversationService.sendMessage(
      conversationId,
      content,
      token
    );
    setMessages((prev: Message[]) => [...prev, newMessage]);
  };

  const startNewConversation = async () => {
    if (!token) return;
    const conv = await ConversationService.startConversation(token);
    return conv.id;
  };

  return { messages, loading, sendMessage, startNewConversation };
}
