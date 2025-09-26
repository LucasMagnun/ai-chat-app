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

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeChat, setActiveChat] = useState<string | null>(null);

  // mock temporário (depois buscar do DB)
  const [chats, setChats] = useState([
    { id: "1", title: "Conversa sobre IA" },
    { id: "2", title: "Estudo de React" },
    { id: "3", title: "Plano de viagem" },
  ]);

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

  const handleNewChat = () => {
    const newChat = { id: Date.now().toString(), title: "Novo Chat" };
    setChats((prev) => [...prev, newChat]);
    setActiveChat(newChat.id);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onNewChat={handleNewChat}
      />

      {/* Área principal */}
      <div className="flex flex-col flex-1">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">Chat IA</h1>

          <div className="flex items-center gap-4">
            <p>{user.email}</p>
            <Button
              variant="secondary"
              onClick={handleLogout}
            >
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
            {activeChat && <ChatForm chatId={activeChat} />}
          </div>
        </footer>
      </div>
    </div>
  );
}
