"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ChatList from "@/components/Chat/ChatList";
import ChatForm from "@/components/Chat/ChatForm";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Chat IA</h1>
        <p>{user.email}</p>
      </header>

      <main className="flex flex-col flex-1 overflow-y-auto bg-gray-100 p-4">
        <ChatList />
      </main>

      <footer className="p-4 bg-white border-t">
        <ChatForm />
      </footer>
    </div>
  );
}
