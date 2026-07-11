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



## Local repository setup

### Pre-requisites:
- Node (^24.0.0)
- Python (~3.9.0)
- uv
- Docker (Desktop)
```
Version differences may lead to unexpected behavior.
```

### Setup and run the project:

1. Install all node module by running 
    ```
    npm install
    ```
2. Build and serve all Docker-Images by running 
    ```
    docker compose up --build
    ```
3. Start the application by running 
    ```
    npm run start
    ```
4. Scan QR-Code with phone (in same network) or press ```a``` to launch in emulator
