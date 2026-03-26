import { API_BASE_URL } from "./api";

export function createWS(): WebSocket {
  const wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
  return new WebSocket(`${wsBaseUrl}/chat`);
}

export function sendMessage(ws: WebSocket, content: string) {
  ws.send(JSON.stringify({
    type: 'message',
    content,
  }));
}
