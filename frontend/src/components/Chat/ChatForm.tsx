"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatFormProps = {
  chatId: string;
  onMessageSent?: () => Promise<void>;
};

export default function ChatForm({ chatId, onMessageSent }: ChatFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/${chatId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: message }),
        }
      );

      setMessage("");

      if (onMessageSent) {
        await onMessageSent();
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 w-full items-center p-2 bg-white border-t"
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 rounded-lg"
      />
      <Button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
      >
        Enviar
      </Button>
    </form>
  );
}
