# AccessSpeak: Language-Doc-Assistant
---
AccessSpeak is a language doc assistant with the purpose of simplifying and translating documents that are either hard to read or written in a, to the user, foreign language. This application has been developed for mobile devices with the react-native and expo frameworks as part of a module assignment.

---
## Agents:
| Name | Usecase | mobile specific function | implemented by |
| ------ | ------- | ------------------------ | -------------- |
| Chatbot | With the chatbot agent one is able to ask general questions or questions related to the uploaded or scanned documents. He is also able to give recommendations on how to proceed with the topic of a question or a document. | The chatbot uses the phones *microphone* for **Speech To Text**. With which it can detect the user's voice and convert it into a prompt for the chatbot. | Florian Hans |
| Translator | With the Translation Agent the user is able to write or paste texts into a textbox and choose from a handful of languages to translate the text into. | **Text To Speech** enables the functionality of documents *being read out loud by the app* for the user to optionally receive translations in a potentially for the user more easily understandable way. | Oliver Schlieper |
| Simplifier | The Simplifier Agent allows the user to make complicated texts and documents simpler and more easily comprehendible, the user simply scans the document he wishes to simplify, selects the document in the document history and selects the simplify option. | - | Oliver Schlieper |
| Scanner | Originally used in tandem with tesseract to extract texts from documents, the Scanning Agent is now separate from the extraction of the text from documents. The agent now receives the extracted document text and chooses a fitting title for the extracted documents. | The Scanner makes use of the **camera** of the phone to extract the text and further process the data in the document. | Vincent Nier |

---
## Styling decisions:
Initially we decided on using a type of glass morphism style for the entire app. But after receiving feedback from not only our fellow students but also other app-testers, we decided to scrap this idea and try a more simple and minimalistic design.
The UX is intended to be as uncomplicated an easy-to-use as possible as to not unnecessarily confuse the user who is already having trouble with his documents.

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

## Project Structure
```text
ACCESSSPEAK_LANGUAGE-DOC-ASSISTANT-MOBAW26SS/
├── abgabe/                             # files related to pdf-submission
├── ai_agents/                          # crewAI-agents backend files
│   ├── crew/
│   │   ├── __init__.py                 # dummy to initialize python package
│   │   ├── agents.py                   # defines crewAI agents
│   │   ├── crew.py                     # defines agents-crew
│   │   ├── tasks.py                    # defines tasks for agents
│   │   └── tools.py                    # ocr tool for text extraction
│   ├── Dockerfile                      # defines agents-backend container setup
│   ├── main.py                         # crewAI agents API
│   ├── requirements.txt                # defines required python packages
│   └── whisper_speech_to_text.py       # whisper stt service
├── assets/                             # assets used in the project
├── backend/                            # database backend files
│   ├── app/
│   │   ├── __init__.py                 # dummy to initialize python package
│   │   ├── database.py                 # provides mongoDB client config and access
│   │   ├── difficulty.py               # automatically determines text difficulty
│   │   └── main.py                     # database API
│   ├── Dockerfile                      # defines database-backend container setup
│   └── requirements.txt                # defines required python packages
├── konzept/                            # files related to the concept phase
├── src/                                # contains main source code of app
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx             # tabs page-layout
│   │   │   ├── cameraPage.tsx          # screen to take photos of documents
│   │   │   ├── chatBotPage.tsx         # screen to talk to chatbot
│   │   │   ├── historyPage.tsx         # screen to view all your documents
│   │   │   └── index.tsx               # home screen
│   │   ├── pages/                      # additional screens
│   │   │   ├── documentPage/           
│   │   │   │   └── [id].tsx            # page of individual document entry
│   │   │   ├── instructionsPage.tsx    # explains how to use app
│   │   │   ├── scanningPage.tsx        # similar to cameraPage but to scan text 
│   │   │   └── translationPage.tsx     # screen to translate user-input
│   │   └── _layout.tsx                 # root page-layout
│   ├── components/                     # ui-components
│   ├── utils/                          # utility and service files
│   │   ├── audioService.ts             # provides start+stop audiorecording
│   │   ├── backendConfig.ts            # automatically sets backend address
│   │   ├── DataProvider.tsx            # provides functions to use API's
│   └── theme.ts                        # theme for entire app
├── .gitignore                          # folders marked as ignore
├── app.json                            # expo config
├── docker-compose.yml                  # docker project cofiguration
├── package-lock.json                   # stores dependency tree
├── package.json                        # used packages and scripts
├── README.md                           # documentation
└── tsconfig.json                       # ts-compiler config
```
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
```
Was wir dazu gemacht haben:
    - Texte aus Bildern können nun extrahiert und übersetzt werden
    - Übersetzer Agenten-Einstellungen angepasst 
        -> Verhalten nun konsistenter und zuverlässiger
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
```
Was wir dazu gemacht haben:
    - Hochlade-Icon geht nun in den File-Explorer anstatt zur Kamera
        -> Kamera hat gesonderte Seite
    - Tastatur lässt sich einklappen, wenn man außerhalb der Tastatur irgendwo hinklickt
```

### Personal reflection by team members:

### Florian Hans
Das Projekt startete mit der Konzeptionsphase, in der ich mich hauptsächlich mit der allgemeinen Produktbeschreibung und der Architektur der App beschäftigte. Dabei habe ich mir überlegt, welche Funktionalitäten die App für unsere Zielgruppe haben sollte und wie wir diese Funktionalitäten am besten umsetzen könnten.
Im Ganzen lief die Konzeptionsphase meines Erachtens sehr gut abgesehen von dem im Folgenden beschriebenen Punkt, da wir hier als Gruppe die Aufgaben fair verteilt haben, bei der jedes Gruppenmitglied seinen Teil zuverlässig bearbeitet hat und wir es am Ende gut zusammentragen konnten. Unsere Ergebnisse hatten wir dann besprochen und uns auf manche Änderungen zügig einigen können. Das einzig Negative in der Konzeptionsphase war, dass unser viertes Gruppenmitglied leider gar keinen Beitrag geleistet hat und sich von dem Projekt entfernt hat. Trotz der Umstände sind wir dennoch zu einem guten ersten Entwurf gekommen.

In der Entwicklungsphase des Projekts beschäftigte ich mich vorerst allein daran den Rahmen für die App zu entwickeln. Dabei entwarf ich als erstes eine Repository-Verzeichnisstruktur, die besagt, wo welche Dateien hingehören. Dafür habe ich unter anderem auch den Einstiegsort in die root-Seite der App per Konﬁguration angepasst, damit ich meine Struktur umsetzen konnte. Mit der nun fertig erstellten Ordner-Struktur für das Repository erstellte ich dann den Rohbau für einen Großteil aller Screens, die für unser frühes Design der App notwendig waren. Nachdem das Grundgerüst der App stand, habe ich mich um die MongoDB-Datenbank gekümmert, dafür die API erstellt und gleichzeitig diese in eine neu angelegte Docker-Konﬁguration eingepﬂegt. Der nächste große Teil, den ich bearbeitet hatte, war der Chatbot als Agent, der Zugriff auf die Dokument-Einträge in der Datenbank hat. Zusätzlich fügte ich noch die Funktionalität mit ein per Speech-to-Text Prompts für den Chatbot über eine Audioaufnahme zu erzeugen. Gegen Ende des Projekts beschäftigte ich mich dann hauptsächlich noch mit der Aufbereitung der Dokumentation und räumte den Code ein wenig auf.

Rückblickend würde ich sagen, dass diese Phase zwar etwas holprig begonnen hat, da ich zu Beginn eher das Gefühl hatte, einen Großteil der Projektarbeit allein zu übernehmen. Dies lag daran, dass teilweise Deadlines, die wir uns gesetzt hatten, nicht von allen Gruppenmitgliedern eingehalten wurden. Glücklicherweise besserte sich dies nach Rücksprache mit dem Team im Laufe der Bearbeitungszeit. Insgesamt bin ich mit dem Verlauf und Ergebnis des Projekts zufrieden.

Für die Zukunft nehme ich mir mit, dass ich bei einem ähnlichen Projekt frühzeitig fest deﬁnierte Deadlines setzen würde, um mögliche Verzögerungen früher zu erkennen und eine transparentere Arbeitsverteilung zu ermöglichen.

### Oliver Schlieper
Design-Phase:
Zu Beginn des Projekts habe ich mich vor allem im Bereich Design eingebracht. Da ich mit Figma bereits gut vertraut war, habe ich an den Wireframes mitgearbeitet und die High-Fidelity-Mockups eigenständig erstellt, ebenso stammte die grundsätzliche Designrichtung von mir. Eine wichtige Erkenntnis kam erst nach der Zwischenpräsentation: Mein persönlicher Geschmack, etwa eine moderne Liquid-Glass-Optik, war für unsere Zielgruppe nicht das Richtige. Menschen mit Leseschwäche oder geringen Deutschkenntnissen brauchen hohe Kontraste, große Bedienelemente und klare Strukturen und keine gestalterischen Spielereien. Diese Umstellung von dem, was mir persönlich gefällt, hin zu dem, was den Nutzern tatsächlich hilft, war für mich die wertvollste Lektion der Konzeptphase.

Implementierung:
In der Umsetzung habe ich unter anderem die App-Anleitung in Einfacher Sprache mit Vorlesefunktion, die Dokumentseite mit Vereinfachen- und Übersetzen-Ansicht sowie die automatische Schwierigkeitseinstufung entwickelt. Dabei habe ich viel gelernt, insbesondere den Umgang mit lokalen KI-Modellen und vor allem deren Grenzen: Unser kleines Modell erfand teilweise Ergebnisse oder ignorierte Tool-Aufrufe, weshalb wir die Texterkennung bewusst deterministisch im Code ausführen und die KI ausschließlich für Sprachaufgaben einsetzen. Außerdem habe ich Docker und seine Vorteile für einheitliche Teamumgebungen kennengelernt, meine FastAPI-Kenntnisse vertieft und ein deutlich besseres Verständnis von MongoDB entwickelt, etwa beim gezielten Aktualisieren einzelner Felder. Auch mein Umgang mit React Native ist spürbar sicherer geworden. Am meisten gelernt habe ich jedoch im Umgang mit GitHub: Branches, Merges und Rebases gezielt einzusetzen, um mit mehreren Entwicklern parallel an einem Projekt zu arbeiten, sowie Änderungen in kleine, nachvollziehbare Commits aufzuteilen.

Was nicht rundlief:
Nicht alles lief dabei reibungslos. Anfangs fiel es mir schwer, sinnvolle Issues zu formulieren und den Überblick zu behalten, was in welcher Reihenfolge erledigt werden musste, unser Taskboard wurde erst mit der Zeit wirklich hilfreich. Auch die KI-Agenten hatte ich zunächst so eingebunden, dass sie gar nicht über CrewAI liefen, das fiel erst durch Feedback aus dem Team auf und musste nachträglich umgebaut werden. Und als ich meine Änderungen in die von Florian aufgesetzte Datenbank integrieren wollte, hatte ich Mühe, seine Struktur vollständig nachzuvollziehen, hier hätte ich früher nachfragen sollen, anstatt lange allein zu suchen. Genau das nehme ich mit: früher kommunizieren, kleiner arbeiten und die Bedürfnisse der Nutzer konsequent über die eigenen Vorlieben stellen.

### Vincent Nier

Die Arbeit am Projekt startete mit der Planungsphase auf Figma. Dort arbeitete Ich an den Protopersonas, den Wireframes und dem Storyboard. Die Zielgruppen standen sehr schnell fest. Ältere Menschen und Menschen die die Dokumentensprache nicht gut verstehen, entweder weil jene eine andere Muttersprache sprechen oder die Dokumente zu kompliziert sind.

Dadurch stand auch fest, dass das Design möglichst simpel und unkompliziert sein muss um den Nutzern nicht weitere mentale Last aufzuhalsen.

Zur ersten Präsentation habe Ich noch rechtzeitig den Chatbot implementiert, welcher zu jener Zeit jedoch nur lokal lief und noch nicht als Agent implementiert war. Dies wurde dann später von Florian übernommen.

Nach der Präsentation wurde das leicht abgeänderte Designkonzept implementiert und Ich habe mit der Arbeit am Scanning Agent begonnen. Diesen habe Ich zuerst auch lokal als Agenten der das Tesseract Ocr als Tool verwendet aufgesetzt. Bei Screenshots hat dieser Aufbau nach einer Anpassung der Taskumschreibung ganz gut funktioniert, bei Aufnahmen mit der Kamera gab es jedoch für ocr große Probleme den Text zu erkennen, woraufhin der Agent sich den Text trotz expliziter Aufforderung dies zu unterlassen, halluziniert hatte. Tests mit dem Einstellen von Kontrast und anderen Nachbearbeitungsmethoden um die Fotos für den Agent lesbarer zu machen schlugen leider fehl.

Nachdem Docker und die Datenbank aufgesetzt wurden, habe Ich den Scanning Agent umgebaut, damit er Docker und die Datenbank nutzt. So habe Ich auch den Scanner und die Kamera umgebaut, damit die erstellten Dokumente das Difficulty-Bewertungsystem, welches Florian aufgebaut hat nutzen und sie in der History gespeichert werden. Daneben, habe Ich noch ein paar Button Functionalities für die Kamera und den Scanner hinzugefügt, so zum Beispiel, dass nicht nur direkt aufgenommene Fotos, sondern generell Bilder die auf dem Handy gespeichert wurden hochgeladen werden können und eine Verbindung zum Chatbot, so dass das gerade erstellte Dokument dem Chatbot direkt übergeben werden kann.

Der Scanning Agent schien zumindest bei der Nutzung von Screenshots und nicht zu komplizierten Fotos mit leichten durch den KI-Agenten hervorgerufenen Schönheitsfehlern, zu funktionieren. Da er jedoch nach ein paar Updates am Code am Tag vor der finalen Präsentation aufgehört hatte zu funktionieren und bei jedem Dokument einen Ocr-Fehler zurückgab, haben wir beschlossen, Tesseract getrennt vom Agenten auszuführen, und das Ergebnis von Tesseract dem Agenten einfach zu übergeben, woraufhin dieser einen passenden Titel für das Dokument erstellt.

Abschließend lässt sich sagen, dass Ich durch das Projekt im Umgang mit Git in einer Gruppe etwas gefestigter wurde und gelernt habe, wie man einen KI-Agenten aufsetzt und wann diese nützlich sind, oder vielleicht der Funktionalität eher schaden.
