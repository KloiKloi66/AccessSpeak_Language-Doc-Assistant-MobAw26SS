# AccessSpeak: Language-Doc-Assistant
---
AccessSpeak is a language doc assistant with the purpose of simplifying and translating documents that are either hard to read or written in a, to the user, foreign language. This application has been developed for mobile devices with the react-native and expo frameworks as part of a module assignment.

---
## Agents:
| Name | Usecase | mobile specific function | implemented by |
| ------ | ------- | ------------------------ | -------------- |
| Chatbot | With the chatbot agent one is able to ask general questions or questions related to the uploaded or scanned documents. He is also able to give recommendations on how to proceed with the topic of a question or a document. | The chatbot uses the phones *microphone* for **Speech To Text**. With which it can detect the user's voice and convert it into a prompt for the chatbot. | Florian Hans |
| Translator | With the Translation Agent the user is able to write or paste texts into a textbox and choose from a handful of languages to translate the text into. | **Text To Speech** enables the functionality of documents *beeing read out loud by the app* for the user to optionally receive translations in a potentially for the user more easily understandable way. | Oliver Schlieper |
| Simplifier | The Simplifier Agent allows the user to make complicated texts and documents simpler and more easily comprehendible, the user simply scans the document he wishes to simplify, selects the document in the document history and selects the simpify option. | ? | Oliver Schlieper |
| Scanner | Originally used in tandem with tesseract to extract texts from documents, the Scanning Agent is now seperate from the extraction of the text from documents. The agent now receives the extracted document text and chosses a fitting title for the extracted documents. | The Scanner makes use of the **camera** of the phone to extract the text and further process the data in the document. | Vincent Nier |

---
## Styling decisions:
Initially we decided on using a type of glass morphism style for the entire app. But after receiving feedback from not only our fellow students but also other app-testers, we decided to scrap this idea and try a more simple and minimalistic design.
The UX is intended to be as uncomplicated an easy-to-use as possible as to not unesseccarily confuse the user who is already having trouble with his documents.

Initial styling and design planning was developed on this [Figma page](https://www.figma.com/design/R6o2Ub8vWAbZk5jRNuZTh6/Mobile-Anwendungen-Thema-DokuHelfer?node-id=0-1&p=f&t=CnHn1nP5R2toZOPL-0).

---
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

---
## Received Feedback 
### By Group *App_06_PetWatch / PawPilot*:
```
Positiv
- Gute Struktur
- Aufteilung und Ordnung sehr gut
- Kontrastreich, barrierefrei
- übersichtlich
- intuitiv
- Farblich angenehm
- Simples und benutzerfreundliches Design

Negativ
- Bei Kamerazugriff aktivieren ist der Text abgeschnitten
- Es gibt beim Scan Ergebnis keine Möglichkeit runterzuscrollen
- Beim Chatbot gibt es kein Symbol ob es lädt 
- Konnte das Bild nicht übersetzen, nur angegeben in welchem Ordner es ist (Deutsch-Türkisch)
- Kameraleuchte leuchtet auch außerhalb der nutzung grün auf
- Übersetzen ist fehlgeschlagen

Verbesserungsvorschläge
- Beim Scan wäre ein Symbol hilfreich um zu erkennen dass Text erkannt wird
- Sendebutton vielleicht nur aktiv lassen wenn man den button auch nutzen kann
- Beim Senden könnte das Textfeld von selber runtergehen beim Chatbot
- eine Message damit man versteht dass das Bild gespeichert wird
```

### By Group *App_09_01_AccessAway*
```
- icon zum hochladen springt grad zur kamera, grad unintuitiv aber ihr habt ja es ja schon auf nem branch geändert
- ⁠zurück button springt immer zum home -> bisschen unnötig, da man von der nav bar aus auch zu home kommen kann
- ⁠chatbot funktioniert gut
- ⁠UI auch gut
- ⁠beim chatbot wäre es cool wenn man die tastatur verstecken kann damit man den ganzen chat dann sieht
- ⁠anleitung super idee und auch easy gestaltet
```


### Personal reflection by team members:

### Florian Hans

### Oliver Schlieper

### Vincent Nier

Die Arbeit am Projekt startete mit der Planungsphase auf Figma. Dort arbeitete Ich an den Protopersonas, den Wireframes und dem Storyboard. Die Zielgruppen standen sehr schnell fest. Ältere Menschen und Menschen die die Dokumentensprache nicht gut verstehen, entweder weil jene eine andere Muttersprache sprechen oder die Dokumente zu kompliziert sind.

Dadurch stand auch fest, dass das Design möglichst simpel und unkompliziert sein muss um den Nutzern nicht weitere mentale Last aufzuhalsen.

Zur ersten Präsentation habe Ich noch rechtzeitig den Chatbot implementiert, welcher zu jener Zeit jedoch nur lokal lief und noch nicht als Agent implementiert war. Dies wurde dann später von Florian übernommen.

Nach der Präsentation wurde das leicht abgeänderte Designkonzept implementiert und Ich habe mit der Arbeit am Scanning Agent begonnen. Diesen habe Ich zuerst auch lokal als Agenten der das Tesseract Ocr als Tool verwendet aufgesetzt. Bei Screenshots hat dieser Aufbau nach einer Anpassung der Taskumschreibung ganz gut funktioniert, bei Aufnahmen mit der Kamera gab es jedoch für ocr große Probleme den Text zu erkennen, woraufhin der Agent sich den Text trotz expliziter Aufforderung dies zu unterlassen, halluziniert hatte. Tests mit dem Einstellen von Kontrast und anderen Nachbearbeitungsmethoden um die Fotos für den Agent lesbarer zu machen schlugen leider fehl.

Nachdem Docker und die Datenbank aufgesetzt wurden, habe Ich den Scanning Agent umgebaut, damit er Docker und die Datenbank nutzt. So habe Ich auch den Scanner und die Kamera umgebaut, damit die erstellten Dokumente das Difficulty-Bewertungsystem, welches Florian aufgebaut hat nutzen und sie in der History gespeichert werden. Daneben, habe Ich noch ein paar Button Functionalities für die Kamera und den Scanner hinzugefügt, so zum Beispiel, dass nicht nur direkt aufgenommene Fotos, sondern generell Bilder die auf dem Handy gespeichert wurden hochgeladen werden können und eine Verbindung zum Chatbot, so dass das gerade erstellte Dokument dem Chatbot direkt übergeben werden kann.

Der Scanning Agent schien zumindest bei der Nutzung von Screenshots und nicht zu komplizierten Fotos mit leichten durch den KI-Agenten hervorgerufenen Schönheitsfehlern, zu funktionieren. Da er jedoch nach ein paar Updates am Code am Tag vor der finalen Präsentation aufgehört hatte zu funktionieren und bei jedem Dokument einen Ocr-Fehler zurückgab, haben wir beschlossen, Tesseract getrennt vom Agenten auszuführen, und das Ergebnis von Tesseract dem Agenten einfach zu übergeben, woraufhin dieser einen passenden Titel für das Dokument erstellt.

Abschließend lässt sich sagen, dass Ich durch das Projekt im Umgang mit Git in einer Gruppe etwas gefestigter wurde und gelernt habe, wie man einen KI-Agenten aufsetzt und wann diese nützlich sind, oder vielleicht der Funktionalität eher schaden.