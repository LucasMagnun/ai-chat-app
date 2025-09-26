"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

import ChatList from "@/components/Chat/ChatList";
import ChatForm from "@/components/Chat/ChatForm";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar/Sidebar";

import {
  getConversations,
  startConversation,
  getConversation,
} from "@/services/conversationService";
import { Conversation } from "@/types/conversation";

export default function ChatPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Conversation[]>([]);

  // Buscar conversas ao carregar a página
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !token) return;

      try {
        const conversations = await getConversations(token);
        setChats(conversations);

        if (conversations.length) {
          setActiveChat(conversations[0].id);
        }
      } catch (err) {
        console.error("Erro ao buscar conversas:", err);
      }
    };

    if (!loading && user && token) {
      fetchConversations();
    }
  }, [user, token, loading]);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleNewChat = async () => {
    if (!token) return;

    try {
      const newConversation = await startConversation(token);
      setChats((prev) => [...prev, newConversation]);
      setActiveChat(newConversation.id);
    } catch (err) {
      console.error("Erro ao criar nova conversa:", err);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    if (!token) return;

    try {
      const conversation = await getConversation(chatId, token);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? conversation : c))
      );
      setActiveChat(chatId);
    } catch (err) {
      console.error("Erro ao selecionar conversa:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        chats={chats.map((chat) => ({
          id: chat.id,
          title: chat.title || "Nova conversa",
        }))}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Área principal */}
      <div className="flex flex-col flex-1">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">Chat IA</h1>

          <div className="flex items-center gap-4">
            <p>{user.email}</p>
            <Button variant="secondary" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>

        <main className="flex flex-1 justify-center bg-gray-100 p-6 overflow-y-auto">
          <div className="flex flex-col w-full max-w-3xl h-full">
            {activeChat ? (
              <ChatList chatId={activeChat} />
            ) : (
              <p className="text-center text-gray-500 mt-10">
                Selecione ou crie um chat para começar
              </p>
            )}
          </div>
        </main>

        <footer className="flex justify-center bg-white border-t p-4">
          <div className="w-full max-w-3xl">
            {activeChat && (
              <ChatForm
                chatId={activeChat}
                onMessageSent={async () => {
                  if (!token) return;

                  const updatedConversation = await getConversation(
                    activeChat,
                    token
                  );
                  setChats((prev) =>
                    prev.map((c) =>
                      c.id === activeChat ? updatedConversation : c
                    )
                  );
                }}
              />
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
