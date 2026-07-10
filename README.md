# AccessSpeak: Language-Doc-Assistant
---
AccessSpeak is a language doc assistant with the purpose of simplifying and translating documents that are either hard to read or written in a, to the user, foreign language. This application has been developed for mobile devices with the react-native and expo frameworks as part of a module assignment.

## Agents:
| Name | Usecase | mobile specific function | implemented by |
| ------ | ------- | ------------------------ | -------------- |
| Chatbot | With the chatbot agent one is able to ask general questions or questions related to the uploaded or scanned documents. He is also able to give recommendations on how to proceed with the topic of a question or a document. | wip | Florian Hans |
| Translator | TODO | ? | Oliver Schlieper |
| Simplifier | TODO | ? | Oliver Schlieper |
| Scanner | TODO | ? | Vincent Nier |

## Styling decisions:
Initially we decided on using a type of glass morphism style for the entire app. But after receiving feedback from not only our fellow students but also other app-testers, we decided to scrap this idea and try a more simple and minimalistic design.

Initial styling and design planning was developed on this [Figma page](https://www.figma.com/design/R6o2Ub8vWAbZk5jRNuZTh6/Mobile-Anwendungen-Thema-DokuHelfer?node-id=0-1&p=f&t=CnHn1nP5R2toZOPL-0).



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
