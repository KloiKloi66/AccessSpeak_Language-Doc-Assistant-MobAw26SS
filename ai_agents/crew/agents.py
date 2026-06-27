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
