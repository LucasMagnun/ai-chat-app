export enum Sender {
  USER = "USER",
  AI = "AI",
}

export type Message = {
  id: string;
  content: string;
  sender: "USER" | "AI";
  createdAt: string;
};
