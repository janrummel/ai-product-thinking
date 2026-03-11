# Design-Doc: Case Studies Integration

> Status: Draft
> Datum: 2026-03-11
> Scope: 4 Case Studies in bestehende Lektionen integrieren

## Ziel

Vier fiktive Szenarien durch reale Case Studies ersetzen. Gleiche Lernziele, mehr Glaubwuerdigkeit und Praxisnaehe.

## Integrations-Ansatz

### Was sich aendert

Die Sektionen **Scenario** und **Decide** werden umgeschrieben. Context, Concept, Framework und Reflect bleiben im Kern erhalten — Reflect wird angepasst, um die Case Study zu referenzieren.

### Neues Scenario-Pattern

```
## Scenario: [Company] — [Product/Feature]

Faktenblock mit realen Zahlen, Entscheidungssituation.
Endet mit: "Wie wuerdest Du entscheiden?" (gleiche Entscheidungsaufforderung wie bisher)

## Decide

<details>
Erst: Was der Learner bedenken sollte (Framework anwenden)
Dann: Was tatsaechlich passiert ist (reale Outcome-Daten)
Dann: Analyse — warum das Ergebnis so war
</details>
```

**Wichtig:** Der Learner soll erst selbst nachdenken, dann das reale Ergebnis erfahren. Das ist staerker als fiktive "richtige Antworten".

## Die 4 Case Studies

### 1. Notion AI → AI-native UX

**Lektion:** `03-product-design/01-ai-native-ux`
**Lernziel:** Interface muss zur Aufgabe passen, nicht zur Technologie

**Kern-Fakten:**
- Notion hatte 2023 eine strategische Entscheidung: standalone AI-Chat vs. Inline-Integration
- Entschied sich fuer Inline AI: Slash-Command `/ai`, lila Markierung, direkt im Editor
- Default-on: AI fuer alle User verfuegbar, kein separates Onboarding
- 2M+ Waitlist vor Launch (Feb 2023)
- ~50% der aktiven User nutzten AI-Features innerhalb 6 Monaten
- "Write with AI" und "Edit with AI" statt separater Chat-Ansicht
- Progressive Disclosure: Kernergebnis inline, Optionen bei Hover/Klick
- Kein reines Chat-Interface — AI arbeitet IM bestehenden Workflow

**Scenario-Framing:** Du bist PM bei einem Productivity-Tool. AI-Feature steht an. Drei UX-Optionen. Dann: Wie Notion es geloest hat.

**Was sich in Decide aendert:** Statt fiktiver "bester Entscheidung" → Notions reale Entscheidung + Outcome-Daten. Analyse warum Inline > Chat fuer diesen Use Case.

---

### 2. GitHub Copilot → Ship/No-Ship Decisions

**Lektion:** `05-evaluation/04-ship-no-ship`
**Lernziel:** Quality Gates und Staged Rollouts fuer AI Features

**Kern-Fakten:**
- Technical Preview (Juni 2021) → General Availability (Juni 2022): 12 Monate staged Rollout
- SPACE Framework: Satisfaction, Performance, Activity, Communication, Efficiency
- Suggestion Acceptance Rate: ~30% initial → ~34% nach Optimierung
- Controlled Study: 55% schnellerer Task Completion mit Copilot
- ~46% des Codes in enabled Repos von Copilot vorgeschlagen
- Quality Gates: Acceptance Rate, User Satisfaction (Survey), Code Quality Metrics
- Canary-Ansatz: erst intern, dann eingeladene Tester, dann Public Preview, dann GA
- Rollback: Feature Flags pro User/Org, sofort deaktivierbar

**Scenario-Framing:** GitHub 2021 — Copilot funktioniert im Lab, aber wann ist es "gut genug" fuer Millionen Entwickler? Quality Gates + Staged Rollout durchgehen.

**Was sich in Decide aendert:** GitHubs realer Rollout-Plan mit Phasen, die konkreten Schwellenwerte, warum 12 Monate zwischen Preview und GA.

---

### 3. Clearview AI → Responsible AI

**Lektion:** `07-ethics-governance/01-responsible-ai`
**Lernziel:** Was passiert, wenn Responsible AI ignoriert wird

**Kern-Fakten:**
- 20+ Mrd. Gesichtsbilder aus oeffentlichen Quellen gescraped (Social Media, News)
- Ohne Zustimmung der Betroffenen, ohne Transparenz
- Kunden: primaer Law Enforcement (USA), aber auch private Unternehmen
- DSGVO-Strafen: Frankreich 20M EUR, Italien 20M EUR, Griechenland 20M EUR, UK 7.5M GBP, Australien: Nutzung fuer illegal erklaert
- ACLU-Vergleich 2022: Clearview darf nicht an private Unternehmen in den USA verkaufen
- Niederlande: 30.5M EUR Strafe (2024)
- Geschaetztes Gesamt-Strafvolumen: >100M EUR
- Kernversagen: Kein Ethics Board, keine Einwilligungsmechanismen, kein Opt-out, keine Transparenz
- EU AI Act: Biometrische Echtzeit-Identifikation = "Unakzeptables Risiko" (verboten)
- Clearview argumentiert: "Oeffentlich verfuegbare Daten" — Behoerden sagen: irrelevant, Consent fehlt

**Scenario-Framing:** Du bist PM bei einem AI-Startup. CEO will Facial Recognition Feature launchen. Dann: Was bei Clearview AI passiert ist.

**Was sich in Decide aendert:** Statt fiktivem HR-Tech-Szenario → Clearview als realer Negativ-Case. Durch den Reality Check Framework laufen: Wo hat Clearview versagt? An JEDEM Schritt.

---

### 4. Duolingo Max → AI PRDs schreiben

**Lektion:** `08-execution/01-ai-prds`
**Lernziel:** Warum AI PRDs Evaluation Criteria brauchen

**Kern-Fakten:**
- Duolingo Max: Premium-Tier ($30/Monat) mit zwei GPT-4-Features
  - "Roleplay": Konversationsuebungen mit AI-Partner
  - "Explain My Answer": AI erklaert, warum eine Antwort richtig/falsch war
- Tech: GPT-4 API + eigenes "Birdbrain" ML-Modell fuer Sprachkompetenz-Tracking
- ~5% der zahlenden User upgradeten auf Max
- Margin-Impact: ~120 Basispunkte durch hohe API-Kosten (GPT-4 Inference)
- Spaeter umbenannt: Max → "Duolingo Pro", AI-Features in alle Paid-Tiers integriert
- Herausforderung: Wie evaluiert man "gute Konversation"? Sprachlernerfolg ist langfristig, nicht sofort messbar
- Eval-Problem: Keine einfache Accuracy-Metrik — Engagement, Lernfortschritt, User Satisfaction als Proxies
- PRD-Challenge: Balance zwischen Innovation Speed ("GPT-4 ist verfuegbar, schnell launchen") und Quality Definition

**Scenario-Framing:** Du bist PM bei Duolingo 2023. GPT-4 API ist verfuegbar. Wie schreibst Du das PRD fuer ein LLM-basiertes Lernfeature? Welche Eval-Kriterien definierst Du?

**Was sich in Decide aendert:** Duolingos reale Entscheidungen + was sie (vermutlich) anders im PRD haetten definieren koennen. Fokus auf: fehlende Cost-Ceiling-Definition, schwierige Eval-Kriterien, Pricing-Fehler.

## Aenderungs-Umfang

| Datei | Aenderung |
|-------|-----------|
| `de/03-product-design/01-ai-native-ux.mdx` | Scenario + Decide + Reflect umschreiben |
| `en/03-product-design/01-ai-native-ux.mdx` | Scenario + Decide + Reflect umschreiben |
| `de/05-evaluation/04-ship-no-ship.mdx` | Scenario + Decide + Reflect umschreiben |
| `en/05-evaluation/04-ship-no-ship.mdx` | Scenario + Decide + Reflect umschreiben |
| `de/07-ethics-governance/01-responsible-ai.mdx` | Scenario + Decide + Reflect umschreiben |
| `en/07-ethics-governance/01-responsible-ai.mdx` | Scenario + Decide + Reflect umschreiben |
| `de/08-execution/01-ai-prds.mdx` | Scenario + Decide + Reflect umschreiben |
| `en/08-execution/01-ai-prds.mdx` | Scenario + Decide + Reflect umschreiben |

**Gesamt: 8 Dateien, jeweils 3 Sektionen (Scenario, Decide, Reflect)**

## Qualitaets-Checks

- [ ] Alle Fakten mit Quellen belegt
- [ ] Zahlen aktuell und korrekt
- [ ] DE und EN inhaltlich konsistent
- [ ] Lesson-Lernziel bleibt erhalten (Case Study dient dem Framework, nicht umgekehrt)
- [ ] "Decide" hat klaren Learner-Auftrag (erst selbst denken, dann Outcome sehen)
- [ ] Build laeuft durch (keine MDX-Syntax-Fehler)

## Quellen

### Notion AI
- Notion Blog: "Introducing Notion AI" (Feb 2023)
- TechCrunch: Notion AI launch coverage
- The Verge: Notion AI adoption metrics
- Ivan Zhao (CEO) Interviews zu AI-Integration-Strategie

### GitHub Copilot
- GitHub Blog: "GitHub Copilot is generally available" (Jun 2022)
- GitHub Research: "Productivity Assessment of Neural Code Completion" (2022)
- SPACE Framework Paper (Forsgren, Storey, et al.)
- GitHub Next: Copilot acceptance rate metrics

### Clearview AI
- CNIL (Frankreich): Entscheidung + Strafmass
- Garante (Italien): Entscheidung + Strafmass
- OAIC (Australien): Commissioner's findings
- ACLU Settlement 2022
- AP Autoriteit Persoonsgegevens (Niederlande): 30.5M EUR Strafe (2024)

### Duolingo Max
- Duolingo Blog: "Introducing Duolingo Max" (Mar 2023)
- Duolingo Earnings Calls Q1-Q4 2023, Q1-Q2 2024
- TechCrunch: Duolingo Max adoption analysis
- The Information: Duolingo AI cost analysis
