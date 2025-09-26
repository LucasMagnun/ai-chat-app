"use client";

import { useEffect, useState } from "react";
import { getConversation } from "@/services/conversationService";
import { Message, Sender } from "@/types/message";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatList({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const conversation = await getConversation(
        chatId,
        localStorage.getItem("token") || ""
      );
      setMessages(conversation.messages || []);
    };

    if (chatId) fetchMessages();
  }, [chatId]);

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
