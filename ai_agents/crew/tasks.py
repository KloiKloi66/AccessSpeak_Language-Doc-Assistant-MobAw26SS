# tasks hier definierst du die Aufgaben der Agenten
from crewai import Task
from .agents import translator_agent

translate_task = Task(
    description=(
        "Translate the following text from {source_lang} to {target_lang}.\n\n"
        "Text:\n{text}"
    ),
    expected_output=(
        "Only the translated text in {target_lang}. "
        "No extra words, no explanations, no quotes."
    ),
    agent=translator_agent,
)
