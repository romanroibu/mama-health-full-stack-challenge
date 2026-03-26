from uuid import UUID
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect

from .db import db
from .ws import chat_handler


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.connect()
    try:
        yield
    finally:
        await db.disconnect()


app = FastAPI(lifespan=lifespan)

# In a real app, user_id would come from authentication context. For this demo, we'll use a fixed UUID.
demo_user_id = UUID("D251EF60-3A8B-415D-900D-CC7C4BF60121")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/messages")
async def get_messages():
    return await db.message.find_many(
        where={"user_id": str(demo_user_id)},
        order={"created_at": "asc"},
    )


@app.websocket("/chat")
async def chat_socket(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            await chat_handler(ws, demo_user_id)
    except WebSocketDisconnect:
        return
