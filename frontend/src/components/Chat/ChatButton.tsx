import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
    >
      <Plus size={16} />
      Nova Conversa
    </Button>
  );
}
