import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2"


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translates text from source_lang to target_lang using a local Ollama model.
    """

    prompt = (
        f"Translate the following text from {source_lang} to {target_lang}. "
        f"Reply with ONLY the translated text, no explanations, no quotes, no extra formatting.\n\n"
        f"Text: {text}"
    )

    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=60)
    response.raise_for_status()

    data = response.json()
    return data["response"].strip()
