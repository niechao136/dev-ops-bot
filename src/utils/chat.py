import uuid
from fastapi import HTTPException

from src.dev_ops_agent.graph import create_dev_ops_graph
from src.schemas.auth import TokenDict
from src.schemas.chat import ChatRequest


async def check_chat_access(conversation_id: str, user: TokenDict, pool):
    user_identifier = f"user_{user.id}"
    async with pool.connection() as conn:
        cur = await conn.execute(
            "SELECT 1 FROM chat_thread_users WHERE thread_id = %s AND user_identifier = %s",
            (conversation_id, user_identifier)
        )
        row = await cur.fetchone()

    if row is None:
        raise HTTPException(status_code=403, detail="Access denied")


async def get_chat_config(body: ChatRequest, user: TokenDict, pool):
    agent = await create_dev_ops_graph()
    conversation_id = body.conversation_id or uuid.uuid4().__str__()
    user_identifier = f"user_{user.id}"
    async with pool.connection() as conn:
        if not body.conversation_id:
            await conn.execute(
                "INSERT INTO chat_thread_users (thread_id, user_identifier) VALUES (%s, %s)",
                (conversation_id, user_identifier)
            )
        else:
            await check_chat_access(conversation_id, user, pool)

    config = {
        "configurable": {
            "thread_id": conversation_id
        }
    }

    return agent, conversation_id, config


def get_content(content: str | list[str | dict]):
    if isinstance(content, list):
        first_item = content[0] or ""
        if isinstance(first_item, dict):
            return str(first_item.get("text", ""))
        else:
            return str(first_item)
    else:
        return str(content) if content else ""
