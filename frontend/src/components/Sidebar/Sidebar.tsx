"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

type SidebarProps = {
  chats: { id: string; title: string }[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
};

export default function Sidebar({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "group relative flex flex-col bg-gray-900 text-white transition-all duration-300",
        "w-16 hover:w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <Button
            key={chat.id}
            variant={activeChat === chat.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 text-left truncate",
              "text-gray-300 hover:text-white"
            )}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden group-hover:inline">{chat.title}</span>
          </Button>
        ))}
      </div>

      <div className="p-2 border-t border-gray-700">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-300 hover:text-white"
          onClick={onNewChat}
        >
          + Novo Chat
        </Button>
      </div>
    </aside>
  );
}
