export type SidebarProps = {
  chats: { id: string; title: string }[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
};