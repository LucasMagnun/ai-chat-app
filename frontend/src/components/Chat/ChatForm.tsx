"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message, Sender } from "@/types/message";

type ChatFormProps = {
  chatId: string;
  onMessageSent?: () => Promise<void>;
  startStream?: (content: string) => void;
  addMessage?: (message: Message) => void;
};

export default function ChatForm({
  chatId,
  onMessageSent,
  startStream,
  addMessage,
}: ChatFormProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ estado de carregamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || loading) return; // evita múltiplos envios

    try {
      setLoading(true); // ativa loading

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const userMessage: Message = {
        id: String(Date.now()),
        content: message,
        sender: Sender.USER,
        createdAt: new Date().toISOString(), // obrigatório
      };

      // Adiciona mensagem localmente
      addMessage?.(userMessage);

      // Envia mensagem para backend
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

      // Inicia SSE para receber resposta da IA
      if (startStream) {
        startStream(message);
      }

      setMessage("");

      if (onMessageSent) {
        await onMessageSent();
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoading(false); // desativa loading
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
        disabled={loading} // bloqueia input enquanto envia
      />
      <Button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
        disabled={loading} // bloqueia botão enquanto envia
      >
        {loading ? "Enviando..." : "Enviar"} {/* feedback visual */}
      </Button>
    </form>
  );
}
