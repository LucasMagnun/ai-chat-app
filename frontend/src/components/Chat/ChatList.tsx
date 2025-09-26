"use client";

import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getConversation } from "@/services/conversationService";
import { Message, Sender } from "@/types/message";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";

type ChatListProps = {
  chatId: string;
};

export type ChatListHandle = {
  startStream: (content: string) => void;
  addMessage: (message: Message) => void;
};

const ChatList = forwardRef<ChatListHandle, ChatListProps>(
  ({ chatId }, ref) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    useImperativeHandle(ref, () => ({
      startStream,
      addMessage,
    }));

    useEffect(() => {
      const fetchMessages = async () => {
        const conversation = await getConversation(
          chatId,
          localStorage.getItem("token") || ""
        );
        setMessages(conversation.messages || []);
      };

      if (chatId) fetchMessages();

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };
    }, [chatId]);

    const addMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const startStream = (content: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          content,
          sender: Sender.USER,
          createdAt: new Date().toISOString(),
        },
      ]);

      const token = localStorage.getItem("token") || "";

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/conversations/${chatId}/stream?content=${encodeURIComponent(
        content
      )}&token=${encodeURIComponent(token)}`;

      eventSourceRef.current = new EventSource(url);

      const aiMessageId = `ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          content: "",
          sender: Sender.AI,
          createdAt: new Date().toISOString(),
        },
      ]);

      eventSourceRef.current.onmessage = (event) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: msg.content + event.data }
              : msg
          )
        );
      };

      eventSourceRef.current.onerror = () => {
        eventSourceRef.current?.close();
      };
    };

    return (
      <div className="flex flex-col gap-3 overflow-y-auto p-4 h-full scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`max-w-[70%] p-3 break-words ${
              msg.sender === Sender.USER
                ? "self-end bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl rounded-br-none"
                : "self-start bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none"
            }`}
          >
            <CardContent className="p-2">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
);

ChatList.displayName = "ChatList";
export default ChatList;
