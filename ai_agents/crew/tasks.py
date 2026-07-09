# tasks hier definierst du die Aufgaben der Agenten
from crewai import Task
from .agents import translator_agent, simplifier_agent, chat_agent, document_agent

translate_task = Task(
    description=(
        "Translate the following text from {source_lang} to {target_lang}.\n\n"
        "Return ONLY the translated text.\n"
        "Do not add explanations.\n"
        "Do not add notes.\n"
        "Do not use quotation marks.\n\n"
        "Text:\n{text}"
    ),
    expected_output="The translated text.",
    agent=translator_agent,
)

simplify_task = Task(
    description=(
        "You are NOT a translator. Rewrite the following German text in "
        "'Einfache Sprache' (German to simple German). "
        "Use short sentences (max. 12 words), common words, active voice. "
        "Explain difficult terms briefly in parentheses. "
        "Keep all information complete and correct. "
        "IMPORTANT: Your answer starts directly with the first word of the "
        "rewritten text. No introduction like 'Hier ist...', no explanations, "
        "no quotes, no formatting.\n\n"
        "Text:\n{text}"
    ),
    expected_output=(
        "Only the rewritten German text in Einfache Sprache, starting directly "
        "with the first word of the text. No extra words, no explanations, no quotes."
    ),
    agent=simplifier_agent,
)

chat_task = Task(
    description=(
        "Respond to the user message in a helpful and concise way.\n\n"
        "If the user asks about documents or stored content, use the provided document_context as the primary source of information. "
        "If the user asks about the scanned document, use the provided scan_context as the primary source of information. "
        "For your final answer, you can combine information from both contexts if necessary.\n"
        "Scan context:\n{scan_context}\n\n"
        "Document context:\n{document_context}\n\n"
        "Message:\n{message}"
    ),
    expected_output=(
        "A helpful assistant response in the appropriate language. "
        "For document-related questions, use the provided scan_context and/or document_context and clearly state when information is missing."
    ),
    agent=chat_agent,
)


scan_task = Task(
    description=(
        "The following text was extracted from a scanned document via OCR.\n"
        "Create a short, descriptive GERMAN title for this document, "
        "maximum 4 words (e.g. 'Brief vom Jobcenter', 'Rechnung Stadtwerke'). "
        "Base the title ONLY on the text, never invent information.\n\n"
        "TEXT START\n{ocr_text}\nTEXT END"
    ),
    expected_output=(
        "Only the short German title, maximum 4 words. "
        "No quotes, no punctuation, no explanations."
    ),
    agent=document_agent,
)
