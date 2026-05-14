## Beschreibung relevanter Drittsysteme, Tools, etc.

Frontend:
Als Grundgerüst für die App wird das *Expo* Framework verwendet, welches auf der Basis von *react-native* läuft. Diese Entscheidung wurde getroffen, um die App plattformübergreifend (iOS und Android) mit einer gemeinsamen Codebasis zu entwickeln.

Backend & API:
Die Kommunikation vom Frontend zum Backend geschieht über eine *Rest API-Schnittstelle*. Über diese werden Anfragen an beispielsweise die Datenbank oder die KI-Agenten geregelt.

Datenbank:
Zur Speicherung der Nutzerdaten und Dokumenteneinträge wird *MongoDB* verwendet. Wir haben uns für MongoDB entschieden, da die meisten aus unserer Gruppe bereits Erfahrung damit sammeln konnten.

KI-Agenten:
Für alle KI-gestützten Funktionen wird wie vorgeschlagen *Ollama* verwendet. Mit Verwendung dieses LLM lassen sich Funktionalitäten wie beispielsweise das Übersetzen, das Einscannen und der Chatbot umsetzen.

Sprachausgabe:
Zur Sprachausgabe benutzen wir eine *Text-to-Speech* Komponente, die von dem Expo Framework bereitgestellt wird.

Containerisierung & Deployment:
Die gesamte Backend-Infrastruktur wird mit *Docker* containerisiert. Dies ist Teil der Vorgabe und zielt darauf ab, die Entwicklungsumgebung stabil bzw. konsistent zu halten und den Deployment-Prozess zu erleichtern.

Fazit:
Mit diesen Drittsystemen und Tools, gehen wir davon aus, dass wir die App voll funktionsfähig auf die Beine stellen können. Hierbei betrachten wir Ollama, MongoDB und Docker als wichtigste Drittsysteme.