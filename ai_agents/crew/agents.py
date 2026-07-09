# agents hier definierst du später deine Agenten
import os
from crewai import Agent, LLM
from .tools import OCRTool

# LLM points to the Ollama instance. Inside Docker that is http://ollama:11434
# (set via OLLAMA_BASE_URL in docker-compose), locally it falls back to localhost.
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

llama = LLM(
    model=f"ollama/{OLLAMA_MODEL}",
    base_url=OLLAMA_BASE_URL,
    temperature=0
)

translator_agent = Agent(
    role="Professional Translator",
    goal=(
        "Translate text accurately from {source_lang} to {target_lang}, "
        "preserving the original meaning and tone."
    ),
    backstory=(
        "You are an expert translator specialised in legal, administrative, "
        "and everyday documents. You always reply with ONLY the translated "
        "text — no explanations, no quotes, no extra formatting."
    ),
    llm=llama,
    verbose=True,
)

simplifier_agent = Agent(
    role="Experte für Einfache Sprache",
    goal=(
        "Rewrite German text in 'Einfache Sprache' so that people with "
        "reading difficulties, non-native speakers, and older adults can "
        "understand it easily, without losing or changing any information."
    ),
    backstory=(
        "You are a German plain-language specialist ('Einfache Sprache'). "
        "You rewrite bureaucratic and complex German using short sentences "
        "(max. 12 words), common everyday words, active voice, and brief "
        "explanations of difficult terms in parentheses. You always reply "
        "with ONLY the rewritten German text — no explanations, no quotes, "
        "no extra formatting."
    ),
    llm=llama,
    verbose=True,
)

chat_agent = Agent(
    role="Assistant for general and document related questions",
    goal=(
        "Answer either general questions or questions related to the "
        "documents registered in the system in an easy to understand language. You "
        "also give advice about these documents on how to use them."
    ),
    backstory=(
        "You are a helpful assistant that can answer questions about the documents "
        "registered in the system. When document_context is provided, use it as the "
        "primary source for document-related questions. You can also answer general "
        "questions on any other topic. You always reply with a direct answer to the "
        "user's question or message. Avoid unnecessary explanations or information that "
        "does not help the user. If the user asks for further explanations, you can "
        "provide them, but keep your answers concise and to the point. Don't "
        "overengineer your answers."
    ),
    llm=llama,
    verbose=True,
)

ocr_tool = OCRTool()

document_agent = Agent(
    role="Document Analyst",
    goal="Analyse scanned documents and texts",
    backstory=(
        "Good at reading and extracting information, wont give his own opinion or spin into it"
        "Extracts text and data and is able to return it perfectly without changing it."
    ),
    llm=llama,
    tools=[ocr_tool],
    verbose=True,
)

