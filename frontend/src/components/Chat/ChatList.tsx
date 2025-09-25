"use client";

import ChatMessage from "./ChatMessage";

export default function ChatList() {
  const messages = [
    { id: 1, sender: "IA", text: "Olá, como posso ajudar?" },
    { id: 2, sender: "Você", text: "Quero saber mais sobre Firebase." },
  ];

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
      ))}
    </div>
  );
}
