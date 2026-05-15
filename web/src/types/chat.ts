

export interface ChatConversation {
  conversation_id: string
  last_message_id: string
  summary: string
}

export interface ChatReq {
  conversation_id: string | null
  query: string
}

export type MessageRole = 'user' | 'ai';

export interface ChatMessage {
  message_id: string;
  role: MessageRole;
  content: string;
}
