export default function ChatForm({ chatId }: { chatId: string }) {
  return (
    <form className="flex gap-2">
      <input
        type="text"
        placeholder={`Mensagem para chat ${chatId}`}
        className="flex-1 border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded">
        Enviar
      </button>
    </form>
  );
}