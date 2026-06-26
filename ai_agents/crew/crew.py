# crew baut alles zusammen, hat die run()-Funktion
from crewai import Crew, Process
from .agents import translator_agent
from .tasks import translate_task


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
    return str(result)
