# AccessSpeak: Language-Doc-Assistant
---

### Agents:
| Agents | Usecase | mobile specific function | implemented by |
| ------ | ------- | ------------------------ | -------------- |
| Chatbot | With the chatbot agent one is able to ask general questions or questions related to the uploaded or scanned documents. He is also able to give recommendations on how to proceed with the topic of a question or a document. | wip | Florian Hans |
| Translator | TODO | ? | Oliver Schlieper |
| Simplifier | TODO | ? | Oliver Schlieper |
| Scanner | TODO | ? | Vincent Nier |

Figma:
https://www.figma.com/design/R6o2Ub8vWAbZk5jRNuZTh6/Mobile-Anwendungen-Thema-DokuHelfer?node-id=0-1&p=f&t=CnHn1nP5R2toZOPL-0


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
