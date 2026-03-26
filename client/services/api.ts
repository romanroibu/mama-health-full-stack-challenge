import { Message } from '../types/chat';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchMessages(): Promise<Message[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/messages`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.status}`);
  }
  const data: MessageEntity[] = await response.json();
  return data.map(toMessage);
}

type MessageEntity = {
  id: string;
  user_id: string;
  role: 'user' | 'bot';
  content: string;
  created_at: string;
};

function toMessage(entity: MessageEntity): Message {
  return {
    type: 'message',
    id: entity.id,
    user_id: entity.user_id,
    role: entity.role,
    content: entity.content,
    timestamp: entity.created_at,
  };
}
