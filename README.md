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
  - [3.4 ...](#34)
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

- Ein oder mehrere `UML Use Case Diagramme` (=> siehe https://hoelzel.at/flip/160775/280/index.html S. 280 - 282) visualisieren das gesamte geplante Featureset im Groben
- Basis dafür ist die Mindmap aus dem Projektantrag => Ergänzen Sie relevante Rollen (für welche User-Gruppe ist ein Feature wichtig?)
- Mit kurzen verbalen Beschreibungen der Diagramme

<img src="img/UCD.png">

### 3.2. Use Case A

Nun folgen Detailbeschreibungen für alle Use Cases aus dem Use Case Diagramm. Für jeden Use Case sind folgende Details notwendig:

#### 3.2.1 GUI-Design

- Zeigen Sie hier den GUI-Mockup, den Sie für diesen Use Case designed haben (mit Figma oder einem anderen GUI-Mockup-Tool Ihrer Wahl)
- Ergänzen Sie das Bild mit verbalen Beschreibungen, wenn nötig.

#### 3.2.2 Workflow

- Erklären Sie hier die internen Abläufe, die für die Umsetzung des Use Cases notwendig sind
- Verwenden Sie dazu - wenn der Ablauf komplex genug ist - ein `UML Activity Diagram`

### 3.3 Use Case B

#### 3.3.1 GUI Design
#### 3.3.2 Workflow

### 3.4 ...

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
