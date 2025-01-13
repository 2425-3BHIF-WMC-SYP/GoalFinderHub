# Pflichtenheft `GoalFinder Hub`

## Inhaltsverzeichnis

- [1. Ausgangslage](#1-ausgangslage)
  - [1.1. Ist-Situation](#11-ist-situation)
  - [1.2. Verbesserungspotenziale](#12-verbesserungspotenziale)
- [2. Zielsetzung](#2-zielsetzung)
- [3. Funktionale Anforderungen](#3-funktionale-anforderungen)
  - [3.1. Use Case Überblick](#31-use-case-%C3%BCberblick)
  - [3.2. Use Case A](#32-use-case-a)
    - [3.2.1 GUI-Design](#321-gui-design)
    - [3.2.2 Workflow](#322-workflow)
  - [3.3 Use Case B](#33-use-case-b)
    - [3.3.1 GUI Design](#331-gui-design)
    - [3.3.2 Workflow](#332-workflow)
  - [3.4. Use Case C](#34-use-case-a)
    - [3.4.1 GUI-Design](#341-gui-design)
    - [3.4.2 Workflow](#342-workflow)
  - [3.5 Use Case D](#35-use-case-b)
    - [3.5.1 GUI Design](#351-gui-design)
    - [3.5.2 Workflow](#352-workflow)
  
- [4. Nicht-funktionale Anforderungen](#4-nicht-funktionale-anforderungen)
  - [`Usability`: Benutzbarkeitsanforderung](#usability-benutzbarkeitsanforderung)
  - [`Efficiency`: Effizienzanforderung](#efficiency-effizienzanforderung)
  - [`Maintenance`: Wartbarkeits- und Portierbarkeitsanforderung](#maintenance-wartbarkeits--und-portierbarkeitsanforderung)
  - [`Security`: Sicherheitsanforderung](#security-sicherheitsanforderung)
  - [`Legal`: Gesetzliche Anforderung](#legal-gesetzliche-anforderung)
- [5. Mengengerüst](#5-mengenger%C3%BCst)
- [6. Systemarchitektur](#6-systemarchitektur)
  - [6.1 Deployment-Diagramm](#61-deployment-diagramm)
  - [6.2 Datenmodell](#62-datenmodell)

## 1. Ausgangslage

### 1.1. Ist-Situation

Ballsportarten wie Fußball und Basketball haben sich in den letzten Jahrzehnten zu den beliebtesten Sportarten der Welt entwickelt.
Jedoch können Personen mit Beeinträchtigungen nur schwer und nur mit vielen Einschränkungen an diesen Ballsportarten teilnehmen.

Da eine Basketballpartie mit zwei gegnerischen Teams mit sehbehinderten Personen derzeit nur schwer realisierbar ist, 
spielen betroffene Personen eine Vereinfachung von Basketball - ein Wurfspiel, 
wo die SpielerInnen nacheinander den Ball werfen und versuchen einen Korb zu erzielen. Bei einem erfolgreichen Treffer erhalten sie Punkte.

Dabei benötigen die sehbehinderten SpielerInnen eine akustische Unterstützung zur Ortung des Korbes und eine Rückmeldung, wenn der Korb getroffen wird. Diese Aufgaben erfüllt meistens eine Person.

![Aktuelle Situation](img/current_situation.png)

Um den sehbehinderten Spielern mehr Freiheit z.B. neue Spielmodi zusätzlich zum Wurfspiel, eine verbesserte Ortung (akustisch und visuell) und bessere Rückmeldung zu ermöglichen, wurde ein Gerät entwickelt, das alle zuvor genannten Funktionen erfüllen soll - der **GoalFinder**.

<img src="img/goalfinder_live.jpg" alt="GoalFinder" width="400">

GoalFinder umfasst derzeit folgendes Feature-Set:
- Ein LED-Streifen zur visuellen Ortung & ständige akustische Hinweise (Metronomsound) zur akustischen Ortung des Korbs 
- Erkennung eines Treffers bzw. Fehlschusses mithilfe von ToF- und Vibrationssensor
- Ausgabe eines "Win" bzw. "Lose" Sounds bei Treffer bzw. Fehlschuss
- Konfiguration des GoalFinders, wie Lautstärke, Empfindlichkeit der Sensoren, allgemeine Systemeinstellungen, usw. durch Webapp
- Erstellen und Spielen von Spielmodi (derzeit nur Wurfspiel (Trefferzähler)) mit Webapp
- Rangliste bei abgeschlossenem Spiel.
- Aktualisierung der Gerätesoftware „Over-the-Air“ (drahtlos)

### 1.2. Verbesserungspotenziale

Derzeit sind die GoalFinder nur einzeln konfigurierbar, was in einer Sporthalle, mit mehreren Körben, an denen ein GoalFinder montiert ist, ziemlich unübersichtlich werden kann. Wenn man z.B. die Lautstärke auf jedem GoalFinder ändern will, müsste man sich mit jedem einzeln verbinden, um dies zu tun. 

Zusätzlich werden keine Spieldaten gespeichert und man muss somit die Spieldaten händisch notieren.

Deswegen soll eine Zentrale geschaffen werden, die die Verwaltung aller GoalFinder ermöglicht und die einzelnen Spieldaten der GoalFinder speichern und weiterverarbeiten kann.

## 2. Zielsetzung

Der GoalFinder Hub soll es ermöglichen, mehrere GoalFinder zu verwalten und die Spieldaten an einem zentralen Ort zu speichern und diese weiter in Statistiken und Ranglisten zu verarbeiten. Zudem sollen die aktuell laufenden Spiele alle an einem zentralen Ort überwacht werden können (z.B. für Wettbewerbe).

## 3. Funktionale Anforderungen

Der GoalFinder Hub basiert auf einem Raspberry Pi und bietet die Funktionalität auf einer Webapp an.

- Konfiguration und Fernwartung von mehreren GoalFindern mit Persistenz in einer Datenbank
- Kommunikation mit GoalFinders
  - damit deren Korbtreffer und Korbrahmentreffer-Meldungen empfangen und ausgewertet werden
  - Ansteuern von GoalFindern (z.B. Lautstärke, Empfindlichkeit des Vibrationssensors, usw.)
  - Kommunikation der einzelnen GoalFinder über REST API
- Spiele-Verwaltung
  - Dashboard über Spiele
  - Spieler und Spieler-Teams hinzufügen/bearbeiten/löschen
  - Spiele anlegen/bearbeiten/löschen und Spieler dafür managen
  - Spiel starten und durchführen: Hub legt fest, welcher Spieler an der Reihe ist. Erkennung Treffer oder Fehlschuss etc.
  - Spiele Statistik, Ranglisten, Bonussystem
  - Regeln für Spiele konfigurieren
  - Daten der Spiele, wie Endergebnis und Teams in einer Datenbank speichern

### 3.1. Use Case Überblick
<img src="img/UCD.png">
<p> Auf diesem Diagramm sieht man den groben Featureset und, was der User auf der Webapp des GoalfinderHubs bedienen oder sehen kann. </p>

### 3.2. Use Case A: Übersicht der Goalfinder

#### 3.2.1 GUI-Design
<img src="img/a.png" width="700" height="400">

#### 3.2.2 Workflow
Hierfür wird man eine Sammlung an Goalfinders brauchen. Jeder Goalfinder muss aufgelistet werden, mit dem entsprechenden Status. Dazu wird man die Sammlung durchgehen müssen und auch schauen müssen, ob der Goalfinder ein- oder ausgeschaltet ist.
### 3.3 Use Case B: Hinzufügen eines Goalfinders

#### 3.3.1 GUI Design
<img src="img/b.png" width="700" height="400">

#### 3.3.2 Workflow
Hier braucht man erstmal ein Eingabefeld für den Namen und den Status, mit dem der Goalfinder initialisiert werden soll. Außerdem muss man überprüfen, ob der Name nicht leer ist und beim Status nur "online" oder "offline" (Groß- oder Kleinschreibung egal) eingegeben wird. Falls ein Fehler auftritt, muss der User darüber informiert werden, das Feld auszubessern. Danach braucht man einen Button fürs Hinzufügen oder Abbrechen. Falls der User auf Hinzufügen klickt, soll der neue Goalfinder der Sammlung hinzugefügt werden. Falls der User auf Abbrechen klickt, sollen die Daten aus den Eingabefeldern gelöscht werden.

### 3.4 Use Case C: Verwalten eines Goalfinders

#### 3.4.1 GUI Design
<img src="img/c1.png" width="700" height="150">
<img src="img/c2.png" width="600" height="150">

#### 3.4.2 Workflow
Wenn der User auf Einstellungen übernehmen klickt, muss erstmal in den Feldern, wo der User selbst etwas eintippt, überprüft werden, ob die Werte zur jeweiligen Einstellung passen und nicht leer sind. Bei den Feldern, wo der User die Einstellung auswählen kann, muss überprüft werden, ob er eh etwas ausgewählt hat.Falls ein Fehler auftritt, muss der User darüber informiert werden, das Feld auszubessern. Falls der User auf die Option "Software-Update durchführen" klickt, könnte man das mit einem SUOTA-Dienst lösen, der die Änderungen in den jeweiligen Dateien, die durch das Software-Update entstanden sind, in einem bin-Ordner sammelt und sie dann auf den ESP flasht. Um dann die Einstellungen zu übernehmen, braucht man einen Web-Server, um mit dem ESP zu kommunizieren.

### 3.5 Use Case D: Match verwalten

#### 3.5.1 GUI Design
<img src="img/d1.png" width="700" height="400">
<img src="img/d2.png" width="700" height="300">
<img src="img/d3.png" width="700" height="400">

#### 3.5.2 Workflow

Erstmal wählt der User den Spielmodus aus. Kann dann 1-beliebig viele Teams erstellen und in diese Teams 1-beliebig viele Spieler hinzufügen. Dabei muss überprüft werden,ob der User einen Modus ausgewählt hat, mindestens ein Team erstellt hat und jedem Team mindestens einen Sieler hinzugefügt hat. Außerdem muss man darauf achten, dass der User die Team- und Spielernamen nicht leer ausfüllt. Falls ein Fehler auftritt, soll der User darüber informiert werden, diesen zu korriegieren. Wenn dann alles passt und der User bereit ist, kann er das Match starten, mithilfe des "Match starten" Buttons. Nachdem soll sich eine Seite öffnen, wo alle laufenden Matches angezeigt werden. Dies könnte man mithilfe von Klassen abbilden. Falls der User dann das jeweilige Match beenden will, kann er auf den "Match beenden" Button klicken. Danach soll sich wieder eine neue Seite öffnen, wo dann die Rangliste des jeweiligen Spiels angezeigt wird. Die Rangliste bildet sich im Körbezähler-Modus aus der Differenz der Treffer und Fehltreffer, im Team vs Team Modus aus Treffern. Falls der User möchte, kann er die Rangliste speichern.

## 4. Nicht-funktionale Anforderungen

Nicht-funktionale Anforderungen beschreiben Anforderungen an das System, die nicht-fachlicher Natur sind, jedoch entscheidend zur Anwendbarkeit des Systems beitragen. Sie definieren beispielsweise Qualitätsanforderungen, Sicherheitsanforderungen oder Performanceanforderungen.

Nicht-funktionale Anforderungen definieren grundlegende Eigenschaften eines Systems, die im Architekturentwurf berücksichtigt werden müssen. Da diese Anforderungen auch die Entwicklungskosten beeinflussen (können), müssen sie messbar beschrieben werden.

- FALSCH: Das System muss schnell sein.
- RICHTIG: Daten müssen spätestens innerhalb von 500 ms zurückgegeben werden.

Zur einfachen Strukturierung der Anforderungen werden diejenigen Anforderungen, die nicht eindeutig zu den funktionalen Anforderungen gehören, den nicht-funktionalen Anforderungen zugeordnet.

Hier ein Überblick über mögliche nicht-funktionale Anforderungen:

### `Usability`: Benutzbarkeitsanforderung

- Wie muss die Software beschaffen sein, damit die Zielgruppe gerne damit arbeitet?
- Beispiel:
  - Die Software soll dem Erscheinungsbild anderer Produkte des Herstellers entsprechen.

### `Efficiency`: Effizienzanforderung

- Hier geht es sowohl um Laufzeit- als auch um Speichereffizienz. Was wird unter dem sparsamen Einsatz dieser Ressourcen verstanden?
- Beispiel:
  - Die Berechnung darf nicht länger als 0,25 Sekunden dauern.

### `Maintenance`: Wartbarkeits- und Portierbarkeitsanforderung

- Welcher Grad an Änderbarkeit wird gefordert? Hier werden, soweit wie möglich, kommende Anpassungen und Erweiterungen vorhergesehen.
- Beispiel:
  - Das Produkt soll später auch in englischer Sprache verfügbar sein.

### `Security`: Sicherheitsanforderung

- Zu den Sicherheitsanforderungen gehören die Aspekte Vertraulichkeit, Datenintegrität und Verfügbarkeit.
  - Wie sehr müssen die Daten vor dem Zugriff durch Dritte geschützt werden?
  - Ist es entscheidend, die Korrektheit der erfassten Daten und ihre Konsistenz zu gewährleisten?
  - Dürfen Systemausfälle vorkommen?
- Beispiel:
  - Das System muss gewährleisten, dass Daten nie verändert werden können.

### `Legal`: Gesetzliche Anforderung

- Welche Standards und Gesetze müssen beachtet werden?
- Beispiel:
  - Das Produkt muss die ISO 9000 Norm erfüllen.

## 5. Mengengerüst

Zur Abschätzung der aufkommenden Datenmengen und damit verbunden der notwendigen Infrastruktur, um die nötige Performance zu erzielen, ist ein Mengengerüst zu erstellen. Mögliche Fragestellungen:

- Wieviele User werden erwartet?
- Wieviele Daten pro User werden erwartet?
- Mit welcher Anfrage-Frequenz wird gerechnet?

## 6. Systemarchitektur

### 6.1 Deployment-Diagramm
- Auflistung der Softwarekomponenten in einem Verteilungsdiagramm (typisch: Client - Server - Datenbank).
- Beispiel:

<img src="./Architektur.jpg">

### 6.2 Datenmodell

- Wahlweise ER-Diagramm oder objekt-orientiertes Klassendiagramm
