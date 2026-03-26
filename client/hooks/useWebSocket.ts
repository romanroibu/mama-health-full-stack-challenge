import { useCallback, useEffect, useRef, useState } from 'react';
import { createWS, sendMessage as sendWSMessage } from '../services/ws';
import { ChatUpdate, Message } from '../types/chat';

interface UseWebSocketParams {
  onNewMessage: ({ message }: { message: Message }) => void;
}

interface UseWebSocketReturn {
  isLoading: boolean;
  isConnected: boolean;
  isSending: boolean;
  isBotThinking: boolean;

  sendMessage: (content: string) => void;
}

export function useWebSocket({ onNewMessage }: UseWebSocketParams): UseWebSocketReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = createWS();
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsLoading(false);
    };

    ws.onerror = (event) => {
      console.error('WebSocket error', event);
      setIsLoading(false);
      setIsConnected(false);
      setIsSending(false);
      setIsBotThinking(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsLoading(false);
      setIsSending(false);
      setIsBotThinking(false);
    };

    ws.onmessage = (event) => {
      let payload: unknown;

      try {
        payload = JSON.parse(String(event.data));
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
        return;
      }

      if (!payload || typeof payload !== 'object') return;

      const data = payload as ChatUpdate & { created_at?: string };

      if (data.type === 'typing') {
        setIsBotThinking(true);
        return;
      }

      if (data.type === 'error') {
        setIsSending(false);
        setIsBotThinking(false);
        const reason = typeof data.reason === 'string' ? data.reason : 'Unknown error';
        console.error('WebSocket server error:', reason);
        return;
      }

      if (data.type === 'message') {
        const timestamp = data.created_at ?? data.timestamp;

        if (data.role === 'user') {
          setIsSending(false);
        }
        if (data.role === 'bot') {
          setIsBotThinking(false);
        }

        onNewMessage({
          message: {
            type: 'message',
            id: data.id,
            user_id: data.user_id,
            role: data.role,
            content: data.content,
            timestamp,
          },
        });
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [onNewMessage]);

  const sendMessage = useCallback(
    (content: string) => {
      const userMessage = content.trim();
      const ws = wsRef.current;

      if (!userMessage || !ws || ws.readyState !== WebSocket.OPEN || isSending) {
        return;
      }

      setIsSending(true);
      setIsBotThinking(false);
      sendWSMessage(ws, userMessage);
    },
    [isSending],
  );

  return {
    isLoading,
    isConnected,
    isSending,
    isBotThinking,
    sendMessage,
  };
}
