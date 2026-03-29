import * as z from "zod";
import { API_BASE_URL } from "./api";

export function create(): WebSocket {
  const wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
  return new WebSocket(`${wsBaseUrl}/chat`);
}

export type ChatUpdate = z.infer<typeof ChatUpdateSchema>;

export type Message = z.infer<typeof MessageSchema>;

export type BotThinking = z.infer<typeof BotThinkingSchema>;

export type ChatError = z.infer<typeof ChatErrorSchema>;

const MessageSchema = z.object({
  type: z.literal('message'),
  id: z.string(),
  user_id: z.string(),
  role: z.enum(['user', 'bot']),
  content: z.string(),
  created_at: z.string(),
});

const BotThinkingSchema = z.object({
  type: z.literal('typing'),
});

const ChatErrorSchema = z.object({
  type: z.literal('error'),
  reason: z.string(),
});

const ChatUpdateSchema = z.discriminatedUnion('type', [
  MessageSchema,
  BotThinkingSchema,
  ChatErrorSchema,
]);


export function sendMessage(ws: WebSocket, content: string) {
  ws.send(JSON.stringify({
    type: 'message',
    content,
  }));
}

export function safeParseChatUpdate(data: unknown): ChatUpdate | null {
  const parsed = ChatUpdateSchema.safeParse(data);
  if (parsed.success) return parsed.data;
  console.error('Error parsing chat update:', parsed.error);
  return null;
}
