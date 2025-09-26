"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { SidebarProps } from "@/types/sidebarProps";

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
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-left truncate transition-all",
              activeChat === chat.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
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
          variant="default"
          className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
          onClick={onNewChat}
        >
          <Plus className="h-5 w-5" />
          <span className="hidden group-hover:inline">Nova Conversa</span>
        </Button>
      </div>
    </aside>
  );
}
