export type ChatUpdate =
  | Message
  | BotThinking
  | ChatError;

export type Message = {
  type: "message";
  id: string;
  user_id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
};

export type BotThinking = {
  type: "typing";
};

export type ChatError = {
  type: "error";
  reason: string;
};
