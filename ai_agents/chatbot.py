import requests


def ask_chatbot(message: str) -> str:
    url = "http://localhost:11434/api/generate"

    payload = {
        "model": "llama3",
        "prompt": message,
        "stream": False
    }

    response = requests.post(url, json=payload)

    response.raise_for_status()

    data = response.json()

    return data["response"]