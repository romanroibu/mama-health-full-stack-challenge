import { Message } from '../services/ws';
import { useChatHistory } from './useChatHistory';
import { useWebSocket } from './useWebSocket';

type SendMessage = ReturnType<typeof useWebSocket>['sendMessage'];

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
  isBotThinking: boolean;
  sendMessage: SendMessage;
}

export function useChat(): UseChatReturn {
  const historyState = useChatHistory();
  const socketState = useWebSocket({ onNewMessage: historyState.appendMessage });

  const { messages, isLoading: isLoadingHistory } = historyState;
  const { isLoading: isLoadingSocket, isConnected: isConnectedSocket, isBotThinking, sendMessage } = socketState;

  const isLoading = isLoadingHistory || isLoadingSocket;
  const isConnected = isConnectedSocket;

  return {
    messages,
    isLoading,
    isConnected,
    isBotThinking,
    sendMessage,
  };
}
