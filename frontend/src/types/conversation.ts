import { Message } from "./message";

export type Conversation = {
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages?: Message[];
};