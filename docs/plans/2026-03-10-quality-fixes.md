# Quality Fixes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all high-severity issues from expert review, plus critical medium-severity issues.

**Architecture:** Content fixes in DE + EN files (parallel edits). Build verification after each chunk.

**Tech Stack:** Astro Starlight, MDX content files

---

## Chunk 1: Factual Corrections (High Priority)

Fixes: #1 GPT-4 parameters, #2 pricing, #3 Cursor valuation, #4 DeepSeek medals, #5 MIT 5% claim, #7 RAG hallucination contradiction, #8 EU AI Act timeline, #10 KPI hallucination rate, #18 Synthese RAG claim

### Task 1: Fix GPT-4 parameter claim (DE + EN)
**Files:** `de/01-foundations/02-ml-landscape.mdx:26`, `en/01-foundations/02-ml-landscape.mdx:26`
- [ ] DE: Change "GPT-4 hat geschaetzt ~1,8 Billionen solcher Parameter" → "Grosse Frontier-Modelle haben hunderte Milliarden bis ueber eine Billion Parameter — genaue Zahlen werden selten offiziell bestaetigt."
- [ ] EN: Corresponding fix

### Task 2: Fix DeepSeek medals claim (DE + EN)
**Files:** `de/01-foundations/04-foundation-models.mdx:30`, `en/01-foundations/04-foundation-models.mdx:30`
- [ ] DE: "Gold-Medaillen bei IMO und IOI" → "Performance auf IMO- und IOI-Benchmark-Niveau"
- [ ] EN: Corresponding fix

### Task 3: Fix Cursor valuation (DE + EN)
**Files:** `de/02-strategy/02-build-vs-buy.mdx:10,105`, `en/02-strategy/02-build-vs-buy.mdx:10,105`
- [ ] DE: "$29B Bewertung, $2B ARR" → Conservative verified claim or remove specific numbers
- [ ] EN: Corresponding fix

### Task 4: Fix MIT 5% claim (DE + EN)
**Files:** `de/02-strategy/01-wann-ai.mdx:38`, `en/02-strategy/01-when-ai.mdx:38`
- [ ] DE: Qualify with broader range and better attribution
- [ ] EN: Corresponding fix

### Task 5: Fix UHC claim (DE + EN)
**Files:** `de/02-strategy/01-wann-ai.mdx:47`, `en/02-strategy/01-when-ai.mdx:47`
- [ ] DE: Add context "bei einem spezifischen Algorithmus fuer Post-Acute-Care"
- [ ] EN: Corresponding fix

### Task 6: Fix EU AI Act timeline (DE + EN)
**Files:** `de/07-ethics-governance/01-responsible-ai.mdx:43`, `en/07-ethics-governance/01-responsible-ai.mdx:43`
- [ ] DE: Add staggered timeline (Feb 2025, Aug 2025, Aug 2026)
- [ ] EN: Corresponding fix

### Task 7: Fix RAG hallucination contradiction (DE + EN)
**Files:** `de/07-ethics-governance/04-hallucination-management.mdx:40`, `en/07-ethics-governance/04-hallucination-management.mdx:40`
- [ ] Separate general benchmark claims from Stanford Legal study
- [ ] EN: Corresponding fix

### Task 8: Fix KPI hallucination target (DE + EN)
**Files:** `de/09-leadership/03-kpis.mdx:25`, `en/09-leadership/03-kpis.mdx:25`
- [ ] Differentiate by domain: general <5%, regulated <1% + Human Review
- [ ] EN: Corresponding fix

### Task 9: Fix Synthese RAG overclaim (DE + EN)
**Files:** `de/01-foundations/05-synthese.mdx:38`, `en/01-foundations/05-synthesis.mdx:38`
- [ ] "Die Loesung" → "eines der wirksamsten Werkzeuge — aber kein Allheilmittel"
- [ ] EN: Corresponding fix

### Task 10: Add Agentic Cost callout (DE + EN)
**Files:** `de/06-agentic-ai/05-synthese.mdx`, `en/06-agentic-ai/05-synthesis.mdx`
- [ ] Add cost economics paragraph to synthesis
- [ ] EN: Corresponding fix

- [ ] **Build verification after Chunk 1**
- [ ] **Git commit: "Fix factual accuracy issues from expert review"**

## Chunk 2: Structural Improvements

### Task 11: Add perishable-content disclaimer to model pricing (DE + EN)
**Files:** `de/04-technical-literacy/04-model-selection.mdx:20-28`, `en/04-technical-literacy/04-model-selection.mdx:20-28`
- [ ] Add "Stand: Maerz 2026" note + caveat that prices change quarterly

### Task 12: Fix Reforge scoring (DE + EN)
**Files:** `de/02-strategy/03-pmf-impact.mdx:22`, `en/02-strategy/03-pmf-impact.mdx:22`
- [ ] Remove "1-7 Score" or add brief scoring rubric

### Task 13: Add sidebar translations for DE
**Files:** `astro.config.mjs:30-64`
- [ ] Add `translations: { de: '...' }` for all 9 chapter groups

- [ ] **Build verification after Chunk 2**
- [ ] **Git commit: "Add structural improvements: date stamps, sidebar i18n, scoring rubric"**
