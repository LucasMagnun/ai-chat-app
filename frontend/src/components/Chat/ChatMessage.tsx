type ChatMessageProps = {
  sender: string;
  text: string;
};

export default function ChatMessage({ sender, text }: ChatMessageProps) {
  const isUser = sender === "Você";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`p-3 rounded-lg max-w-xs ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <p className="text-sm font-medium">{sender}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
