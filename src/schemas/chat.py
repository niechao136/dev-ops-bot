from pydantic import BaseModel, Field
from typing import Literal, Optional


class ConversationItem(BaseModel):
    conversation_id: str = Field(description="会话 ID")
    last_message_id: str = Field(description="会话最新的消息 ID，用于排序")
    summary: str = Field(description="会话摘要，目前固定为会话的第一条消息")


class ChatRequest(BaseModel):
    conversation_id: Optional[str] = Field(default=None, description="会话 ID，新对话时为 None")
    query: str = Field(description="提问内容")


class MessageItem(BaseModel):
    message_id: str = Field(description="消息 ID")
    content: str = Field(description="消息内容")
    role: Literal["user", "ai"] = Field(description="消息发送者的角色，user - 用户，ai - AI")


class ChatResponse(BaseModel):
    conversation_id: str = Field(description="会话 ID")
    message: MessageItem = Field(description="AI 回复的消息")
