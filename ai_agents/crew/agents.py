# agents hier definierst du später deine Agenten
import os
from crewai import Agent, LLM

# LLM points to the Ollama instance. Inside Docker that is http://ollama:11434
# (set via OLLAMA_BASE_URL in docker-compose), locally it falls back to localhost.
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

llama = LLM(
    model=f"ollama/{OLLAMA_MODEL}",
    base_url=OLLAMA_BASE_URL,
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
