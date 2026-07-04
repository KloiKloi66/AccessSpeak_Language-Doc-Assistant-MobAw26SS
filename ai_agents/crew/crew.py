# crew baut alles zusammen, hat die run()-Funktion
import re

from crewai import Crew, Process
from .agents import translator_agent, simplifier_agent
from .tasks import translate_task, simplify_task

# Preamble lines the model sometimes adds despite instructions,
# e.g. "Hier ist die Übersetzung:" or "Sure! Here is the text:"
PREAMBLE_PATTERN = re.compile(
    r"^(hier ist|hier kommt|gerne|sicher|natürlich|klar|here is|here's|sure|certainly|of course)\b[^\n]{0,80}:\s*\n+",
    re.IGNORECASE,
)

def _strip_preamble(text: str) -> str:
    return PREAMBLE_PATTERN.sub("", text, count=1).strip()


def run_translation(text: str, source_lang: str, target_lang: str) -> str:
    crew = Crew(
        agents=[translator_agent],
        tasks=[translate_task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff(inputs={
        "text": text,
        "source_lang": source_lang,
        "target_lang": target_lang,
    })
    return _strip_preamble(str(result))


def run_simplification(text: str) -> str:
    crew = Crew(
        agents=[simplifier_agent],
        tasks=[simplify_task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff(inputs={"text": text})
    return _strip_preamble(str(result))
