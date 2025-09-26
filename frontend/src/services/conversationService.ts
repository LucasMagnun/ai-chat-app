const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function startConversation(token: string) {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao criar conversa");
  return res.json();
}

export async function getConversations(token: string) {
  const res = await fetch(`${API_URL}/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar conversas");
  return res.json();
}

export async function getConversation(conversationId: string, token: string) {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar conversa");
  return res.json();
}

export async function getMessages(conversationId: string) {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error("Erro ao buscar mensagens");
  return res.json();
}

export async function sendMessage(conversationId: string, content: string, token: string) {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Erro ao enviar mensagem");
  return res.json();
}
