import { useCallback, useEffect, useState } from 'react';
import { fetchMessages } from '../services/api';
import { Message } from '../services/ws';

interface UseChatHistoryReturn {
  messages: Message[];
  isLoading: boolean;
  appendMessage({ message }: { message: Message }): void;
}

function sort(messages: Message[]): Message[] {
  console.log('Sorting messages', messages);
  return messages.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function useChatHistory(): UseChatHistoryReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateMessages = useCallback((newMessages: Message[]) => {
    setMessages((prev) => sort([...prev, ...newMessages]));
  }, []);

  const appendMessage = useCallback(({ message }: { message: Message }) => updateMessages([message]), [updateMessages]);

  useEffect(() => {
    if (isInitialized) return;
    (async () => {
      setIsLoading(true);
      let history = [];
      try {
        history = await fetchMessages();
        updateMessages(history);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch message history', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isInitialized, updateMessages]);

  return {
    messages,
    isLoading,
    appendMessage,
  };
}
