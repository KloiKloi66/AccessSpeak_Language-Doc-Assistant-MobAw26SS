# AccessSpeak: Language-Doc-Assistant


### Agents:
1. Agent
- scannen
2. Agent
- übersetzen
- vereinfachen
3. Agent
- weitere Schritte beschreiben lassen
- (autofill)
4. Agent
- chatbot für fragen zum dokument
5. Agent?
- vorlesen

Figma:
https://www.figma.com/design/R6o2Ub8vWAbZk5jRNuZTh6/Mobile-Anwendungen-Thema-DokuHelfer?node-id=0-1&p=f&t=CnHn1nP5R2toZOPL-0

AKTUELL NOCH ERFORDERLICH: Nach klonen die lokale Ip-Adresse in der chatBotPage.tsx einfügen und im terminal "uvicorn ai_agents.main:app --host 0.0.0.0 --port 8000 --reload" laufen lassen. Dann ist der Chatbot startbereit!


Potenzielle Features, die noch kommen könnten:
- transloco oder ähnliches zur übersetzung von ui

## Repository setup

#### Pre-requirements
- Node
- Python
- uv
- Docker (Desktop)

#### Setup and running the project

1. Run ```npm install```
2. Depending on where the app is launched:
    - change ```API_URL``` in ```\src\utils\Dataprovider.tsx```
3. Run ```docker compose up --build``` to start MongoDB
4. Run ```npm run start``` to start the project
5. Scan QR-Code with phone or press ```a``` to launch in emulator