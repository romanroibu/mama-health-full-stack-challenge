from uuid import UUID
from typing import Annotated, Literal

from fastapi import WebSocket
from pydantic import BaseModel, Field, TypeAdapter, ValidationError

from .db import db, Message, Role
from .bot import generate_response


class MessageEvent(BaseModel):
    type: Literal["message"]
    content: str


ChatEvent = Annotated[MessageEvent, Field(discriminator="type")]
chat_event_adapter = TypeAdapter(ChatEvent)


async def chat_handler(ws: WebSocket, user_id: UUID):
    payload = await ws.receive_json()
    try:
        event = chat_event_adapter.validate_python(payload)
    except ValidationError:
        await chat_send_error(ws, "Received invalid payload")
        return

    if isinstance(event, MessageEvent):
        user_content = event.content

        # Step 1: Persist user's message
        user_message = await db.message.create(
            data={
                "user_id": str(user_id),
                "content": user_content,
                "role": Role.user,
            }
        )

        # Step 2: Acknowledge receipt of user's message
        await chat_send_message(ws, user_message)

        # Step 3: Signal that the bot is "typing" while we generate a response
        await chat_send_typing(ws)

        # Step 4: Generate bot response
        bot_content = await generate_response(user_content)

        # Step 5: Persist bot's message
        bot_message = await db.message.create(
            data={
                "user_id": str(user_id),
                "content": bot_content,
                "role": Role.bot,
            }
        )

        # Step 6: Respond with bot's message
        await chat_send_message(ws, bot_message)

        return


async def chat_send_error(ws: WebSocket, reason: str):
    await ws.send_json({"type": "error", "reason": reason})


async def chat_send_typing(ws: WebSocket):
    await ws.send_json({"type": "typing"})


async def chat_send_message(ws: WebSocket, message: Message):
    await ws.send_json(
        {
            "type": "message",
            "id": str(message.id),
            "user_id": message.user_id,
            "content": message.content,
            "created_at": message.created_at.isoformat(),
        }
    )
