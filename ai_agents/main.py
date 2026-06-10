from fastapi import FastAPI
from pydantic import BaseModel

from ai_agents.chatbot import ask_chatbot

app = FastAPI()


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(request: ChatRequest):

    print("REQUEST RECEIVED:", request.message)

    try:
        answer = ask_chatbot(request.message)

        print("ANSWER:", answer)

        return {
            "response": answer
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "response": "Fehler im Backend",
            "error": str(e)
        }