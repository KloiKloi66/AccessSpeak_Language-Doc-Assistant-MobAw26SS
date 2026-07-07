# tasks hier definierst du die Aufgaben der Agenten
from crewai import Task
from .agents import translator_agent, simplifier_agent, chat_agent, document_agent

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
        "If the user asks about documents or stored content, use the provided document_context as the primary source of information.\n"
        "Document context:\n{document_context}\n\n"
        "Message:\n{message}"
    ),
    expected_output=(
        "A helpful assistant response in the appropriate language. "
        "For document-related questions, use the provided document_context and clearly state when information is missing."
    ),
    agent=chat_agent,
)


scan_task = Task(
    description=(
        "Analyse the document at {image_path}.\n"
        "Use OCR tool to extract text and then analyse it. ONLY use the text returned by the OCR Tool. NEVER invent names, dates, addresses or amounts.If information is missing, write 'Not found'. If OCR is unreadable, say so."
    ),
    expected_output=(
        "Return structured info: type of text, key data, summary"
    ),
    agent=document_agent,
)
