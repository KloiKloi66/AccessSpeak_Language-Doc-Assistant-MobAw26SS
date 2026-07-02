# agents hier definierst du später deine Agenten
from crewai import Agent, LLM

# LLM points to the local Ollama instance running llama3.2
llama = LLM(
    model="ollama/llama3.2",
    base_url="http://localhost:11434",
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
