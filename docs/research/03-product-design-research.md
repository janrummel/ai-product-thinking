# Research: Chapter 03 — Product Design (AI Design & UX)

> Status: Research complete, 2026-03-10
> Purpose: Factual basis for 4 lessons + 1 synthesis
> Quality: Sources ranked per quality plan. Uncertain items marked with [UNCERTAIN].

---

## Lesson 1: AI-Native UX Patterns

### Core Concepts

**Non-Deterministic Interfaces**

Traditional UX assumes deterministic systems — input X always produces output Y. AI systems are probabilistic: they output distributions, sometimes make confident mistakes, and produce different results for the same input. Without patterns for uncertainty, explanation, and recovery, users either overtrust (and get burned) or undertrust (and ignore) AI features.

Key design implication: Every AI output needs to communicate its nature — suggestion, not fact. Interfaces must accommodate variability rather than hide it.

**Chat vs. Structured Output**

Chat interfaces work best when the user's goal is exploratory, ambiguous, or requires natural language reasoning. Structured interfaces (forms, buttons, sliders, tables) are better when input requirements are known, validation matters, or high-volume repetitive tasks are involved.

The emerging consensus (Smashing Magazine, Vitaly Friedman 2025; Adopt AI 2025):
- Chat is being complemented with task-oriented UIs — temperature controls, knobs, sliders, buttons, semantic spreadsheets, infinite canvases
- "If it's a form, it should stay a form" (UX Planet)
- Match modality to task: forms for known fields, chat for guidance and orchestration
- The best hybrid approach: every form should be triggerable conversationally, and every agent should hand off to a form when structure matters
- Results should be presentable as data tables, dashboards, visualizations, or structured files — not only chat text

When agents can use multiple tools and run in the background, users orchestrate AI work more — there's less chatting back and forth. The pure chat paradigm is slowly becoming dated for complex workflows.

**Progressive Disclosure for AI**

Progressive disclosure in AI means revealing complexity gradually rather than all at once. Layers:
1. Surface level: essential output, key result
2. On-demand detail: confidence scores, sources, reasoning
3. Deep dive: full chain of thought, raw data, alternative results

Example from Claude Skills architecture: metadata loading (~100 tokens) first, full instructions (<5k tokens) on demand, bundled resources only as needed.

Microsoft Copilot applies this through its Dynamic Action Button (DAB) — an interface that reshapes itself in response to user behavior, guided by four principles: coherency across content, minimal cognitive load, contextual intelligence, and progressive disclosure.

**Loading States for AI**

AI operations are inherently slower than traditional CRUD. Loading states must:
- Signal that something is happening (spinners, skeleton screens)
- Set expectations about duration
- Allow cancellation for long-running operations
- Provide partial results when available

**Streaming UX**

Streaming delivers AI responses word-by-word as content is generated. Studies show users perceive streaming responses as 40-60% faster than equivalent non-streaming responses [source: makeaihq.com]. The continuous feedback signals progress, maintains engagement, and allows users to start reading before generation completes.

Critical accessibility concern: AI UIs have critical accessibility challenges — noisy, polluting streaming can be problematic for screen readers and users who need stable content (Smashing Magazine, Friedman 2025).

### Real-World Examples

| Product | Pattern | Implementation |
|---------|---------|----------------|
| **ChatGPT** | Streaming + Canvas | Token-by-token rendering; Canvas panel for side-by-side editing of generated text/code with inline suggestions |
| **Claude** | Streaming + Artifacts | Clean utilitarian design (black/white with purple accents); Artifacts render standalone content (code, documents, interactive elements) alongside conversation |
| **GitHub Copilot** | Ghost text (inline suggestions) | Dimmed "ghost text" at cursor position; Tab to accept, Escape to reject, Cmd+Right for partial accept (next word). Natural evolution: now also handles inline edits, not just completions |
| **Notion AI** | Slash-command integration | Forward slash or spacebar triggers AI commands (purple-highlighted); AI edits shown as grayed-out deletions + blue new text; context-aware suggestions based on document type |
| **v0 by Vercel** | Chat-to-code with live preview | Text prompt produces production-ready React/Next.js code with Tailwind + shadcn/ui; live preview; conversational iteration without regenerating from scratch |
| **Linear** | Background AI (no chat) | Triage Intelligence runs silently — suggests assignees, teams, labels, projects based on historical patterns. No chat interface; AI integrated into existing workflow. Can auto-apply trusted suggestions |
| **Midjourney** | Grid + variation buttons | Generates 4-image grid; V1-V4 for variations (subtle or strong); U1-U4 for upscaling (subtle or creative); Remix mode for prompt modification on iterations |

### Design Principles

1. **Match modality to task** — Don't force chat when a button click suffices. Don't force forms when the user needs to think out loud.
2. **Show AI is working, not just loading** — Streaming, partial results, and status messages > generic spinners.
3. **Layer information** — Surface level for most users, progressive disclosure for power users.
4. **Accommodate variability** — "Generate Again" buttons, variation modes, and preference controls let users work with non-deterministic outputs.
5. **Respect existing workflows** — Linear's approach: AI enhances existing UI rather than adding a chatbot. The best AI is invisible when it should be.

### Anti-Patterns

- **Chat-for-everything**: Forcing conversational interaction for tasks that are better served by structured UI (filing claims, data entry, compliance forms)
- **Hiding non-determinism**: Presenting AI outputs as if they were database lookups — fixed, singular, definitive
- **No "Generate Again"**: Users appreciated the ability to regenerate results (Google UX research on generative AI). Removing this removes agency
- **Ignoring accessibility**: Streaming text that constantly changes is problematic for screen readers; auto-scrolling chat disrupts keyboard navigation (inverted navigation problem)
- **Bolt-on chat**: Adding a chatbot to an existing product without rethinking the UX. As Lenny's Newsletter found: "It takes time to think AI-native. The first-pass product is often a bolt-on or simple chat experience. The high-value experience is a deeper rethink."

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [Apple HIG: Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning) | Input/output patterns, corrections, feedback types |
| 1 | [Google PAIR Guidebook](https://pair.withgoogle.com/guidebook/) | Mental models, explainability, errors, feedback |
| 2 | [Smashing Magazine: Design Patterns for AI Interfaces (2025)](https://www.smashingmagazine.com/2025/07/design-patterns-ai-interfaces/) | Chat vs structured, streaming concerns, accessibility |
| 2 | [Microsoft: UX Guidance for Generative AI Applications](https://learn.microsoft.com/en-us/microsoft-cloud/dev/copilot/isv/ux-guidance) | Dynamic UX, progressive disclosure, correction support |
| 2 | [Lenny's Newsletter: Counterintuitive Advice for Building AI Products](https://www.lennysnewsletter.com/p/counterintuitive-advice-for-building) | AI-native rethink, bolt-on trap |
| 3 | [Shape of AI](https://www.shapeof.ai/) | Pattern library: Wayfinders, Inputs, Tuners, Governors |
| 3 | [AIUX Design Guide](https://www.aiuxdesign.guide/) | 36 patterns from 50+ shipped products |
| 3 | [UX Planet: If It's a Form, It Should Stay a Form](https://uxplanet.org/ai-chat-or-not-if-its-a-form-it-should-stay-a-form-0294c59332d6) | Chat vs structured UI decision framework |
| 3 | [Adopt AI: From Chatbots to Agent UX](https://www.adopt.ai/blog/from-chatbots-to-agent-ux-why-structured-inputs-and-outputs-matter) | Structured inputs/outputs for agents |

---

## Lesson 2: Trust & Explainability

### Core Concepts

**The Psychology of Trust in AI**

Trust in AI can be understood as a four-legged stool (Smashing Magazine, 2025), adapted from classic psychological models:

1. **Ability** — Does the AI have the skills to perform its function accurately? This is the foundational layer.
2. **Integrity** — Does it operate on predictable and ethical principles? Transparency, fairness, honesty. An AI that clearly states how it uses data demonstrates integrity.
3. **Predictability** — Can users form a stable mental model of how it will behave? Unpredictability — even with occasionally good outcomes — creates anxiety.
4. **Benevolence** — Does the system act in the user's interest? [UNCERTAIN: Fourth pillar mentioned in the trust framework but less detailed in source material]

Key statistics (Nielsen Norman Group, 2024):
- 72% of users say the language used by an AI (tone, clarity, transparency) directly impacts their trust level
- 63% of users are more likely to rely on AI systems that display confidence levels or explain their reasoning than on black-box answers

**Confidence Indicators**

Visual indicators that communicate how certain the AI is about its outputs:

| Method | Example | When to Use |
|--------|---------|-------------|
| Percentage/score | "85% confident" | Technical audiences, precision matters |
| Color coding | Green (>=85%), Yellow (60-84%), Red (<60%) | Quick scanning, dashboards |
| Human-readable buckets | "Confident", "Unsure", "Needs review" | Non-technical users |
| Inline hedging language | "This likely means..." vs "This means..." | Conversational AI outputs |
| Visual emphasis | Bold for high-confidence, lighter for low-confidence text | Document/text outputs |

Design best practice: Use color PLUS text — never color alone (accessibility). Add detailed tooltips on hover (probabilities, sources) for progressive disclosure.

**Source Attribution / Citations**

Citations turn AI from a black box into a transparent, verifiable system where users can check sources and build confidence.

Three main citation patterns observed across products:
1. **Inline numbered footnotes** (Perplexity) — Numeric references like academic papers. More explicit about which claim maps to which source. Visually heavier but verification is unambiguous.
2. **Hyperlink-first** (ChatGPT) — Links blend into prose, feel natural. But users may not know exactly which claim a link supports.
3. **Expandable source panels** (Claude, Perplexity) — Hover for preview snippet, click for full source. Balances speed with thoroughness.

Design guidance (Google PAIR): Cite sources "in-the-moment" by placing the source reference next to the response. Users appreciate links to sources in various formats.

**"Show Your Work" Patterns**

A three-level transparency framework using progressive disclosure — trust through understanding rather than blind faith:
1. **What** — The result ("Here is your recommendation")
2. **How** — The reasoning ("Because you frequently read articles about UX research methods, I'm recommending this...")
3. **Why** — The evidence ("Based on 47 articles in your reading history, matching patterns from 3 verified sources")

Instead of just giving an answer, AI can signal its own uncertainty through confidence levels: "I'm 85% confident in this summary" or highlighting sentences it's less sure about.

**When to Show Uncertainty**

Show uncertainty when:
- The AI's confidence is below a meaningful threshold
- The output involves health, financial, legal, or safety decisions
- Sources conflict or are limited
- The user is making an irreversible decision based on the output
- The AI is extrapolating beyond its training data

Don't show uncertainty when:
- It would create decision paralysis for trivial outputs
- The confidence level is consistently high and the task is low-stakes
- Too much uncertainty signaling erodes the product value [UNCERTAIN: balance point is product-specific]

The goal should NOT be to maximize trust at all costs (Smashing Magazine) — appropriate calibration of trust is healthier than blind trust.

### Real-World Examples

| Product | Trust Pattern | Implementation |
|---------|--------------|----------------|
| **Perplexity** | Citation-first design | Entire UX built around showing sources. Inline numbered footnotes link to expandable snippets. Metadata (title, favicon) for scanning relevance. Cites by default because live retrieval is core to the product |
| **ChatGPT** | Hyperlinked sources + reasoning | Web-browsed answers include inline hyperlinks. "Thought for X seconds" disclosure for reasoning models. Canvas shows edit rationale |
| **Claude** | Hedging language + artifacts | Uses natural language uncertainty ("I think...", "This likely..."). Artifacts separate verifiable output (code, documents) from conversational explanation |
| **GitHub Copilot** | No explicit confidence (implicit via context) | Suggestions appear only when the model has sufficient context. Quality of ghost text serves as implicit confidence signal. Failed suggestions → agent proposes refined alternative with explanation |
| **Notion AI** | Visual diff for trust | Grayed-out text for deletions + blue text for AI additions. Users can visually verify every change before accepting. Contextual — AI explains what it changed |
| **Linear** | Reasoning + configurability | Triage Intelligence explains its suggestions ("similar to issue #X, previously handled by team Y"). Users can configure which suggestion types to auto-apply vs. review |
| **Google Search (SGE)** | Source cards | AI-generated summaries include source cards with site favicons, titles. Expandable for more context. Clear visual separation between AI summary and organic results |

### Design Principles

1. **Explain for understanding, not completeness** (Google PAIR) — Share information users need to make decisions, not technical implementation details.
2. **Calibrate trust appropriately** — Over-trust is as dangerous as under-trust. Signal uncertainty when it matters.
3. **Make verification effortless** — Sources should be one click/hover away, not buried.
4. **Use layered transparency** — Surface: badges, tone. Detail: tooltips with probabilities and sources. Deep: full reasoning chain.
5. **Language matters** — Tone, clarity, and hedging language directly impact trust (72% of users, NNG 2024).
6. **Avoid the "magic" trap** — Some teams hide how the AI works to preserve a sense of magic. This backfires when errors occur and users have no mental model for why.

### Anti-Patterns

- **Black-box outputs**: Presenting AI results with zero explanation, no sources, no confidence signal
- **Hiding the AI**: Not clearly communicating when AI is active or which content is AI-generated. Users can't calibrate trust if they don't know AI is involved
- **False precision**: Showing "92.7% confident" when the underlying model doesn't meaningfully distinguish between 90% and 95%. Creates false sense of exactness
- **Source theater**: Adding citations that don't actually support the claim, or citing so many sources that verification becomes impractical
- **Overclaiming**: AI outputs formatted as if they are factual, final, or precise when they are probabilistic estimates
- **Uncertainty overload**: Marking everything as uncertain, making the product feel unreliable for even trivial tasks

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [Nielsen Norman Group: AI UX Research](https://www.nngroup.com/topic/ai/) | Trust statistics (72%, 63%), research agenda |
| 1 | [Google PAIR Guidebook: Explainability + Trust](https://pair.withgoogle.com/guidebook/patterns) | "Explain for understanding, not completeness" |
| 1 | [Apple HIG: Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning) | Implicit/explicit feedback, corrections |
| 2 | [Smashing Magazine: Psychology of Trust in AI (2025)](https://www.smashingmagazine.com/2025/09/psychology-trust-ai-guide-measuring-designing-user-confidence/) | Four pillars of trust, design strategies, calibrated trust |
| 2 | [Shape of AI: Citations Pattern](https://www.shapeof.ai/patterns/citations) | Citation UX comparison across products |
| 2 | [Smashing Magazine: Designing for Agentic AI (2026)](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/) | Intent Preview, Confidence Signal, Escalation Pathway |
| 3 | [AIUX Design Guide: Confidence Visualization](https://www.aiuxdesign.guide/patterns/confidence-visualization) | Visual patterns for confidence display |
| 3 | [Agentic Design Patterns: Trust & Transparency](https://agentic-design.ai/patterns/ui-ux-patterns/trust-transparency-patterns) | Multi-layered trust signals |
| 3 | [Unusual AI: Perplexity Platform Guide](https://www.unusual.ai/blog/perplexity-platform-guide-design-for-citation-forward-answers) | Citation-forward design analysis |

---

## Lesson 3: Interaction Patterns

### Core Concepts

**Human-in-the-Loop (HITL)**

HITL means humans remain part of the AI decision loop — reviewing, approving, correcting, or redirecting AI actions. Three fundamental modes:

1. **Human-in-the-loop** — Human must approve before AI acts. AI suggests, human decides. Highest safety, lowest speed.
2. **Human-on-the-loop** — AI acts autonomously but human monitors and can intervene. Moderate safety, moderate speed.
3. **Human-out-of-the-loop** — AI acts fully autonomously. Lowest safety, highest speed. Appropriate only for low-risk, well-validated tasks.

Stanford HAI research emphasizes that the design of interactive AI systems must account for how humans and AI complement each other, not just how to automate human tasks.

**AI Suggestions vs. AI Actions**

The critical UX distinction: does the AI suggest something for the user to approve, or does the AI take action directly?

| Mode | Description | Risk Level | Example |
|------|-------------|------------|---------|
| **Suggestion** | AI proposes, user decides | Low | Copilot ghost text, Linear triage suggestions |
| **Auto-complete** | AI fills in, user can override | Medium | Gmail Smart Compose, phone keyboard predictions |
| **Action with preview** | AI acts, shows preview before commit | Medium | Notion AI edit preview (gray/blue diff) |
| **Autonomous action** | AI acts without approval | High | Linear auto-apply labels, email auto-categorization |
| **Autonomous with undo** | AI acts, user can reverse | Medium-High | Gmail auto-categorization with manual override |

The Smashing Magazine article on agentic AI (2026) defines three interaction phases:
- **Pre-Action**: Intent Preview ("Here's what I'm about to do. Are you okay with that?") + Autonomy Dial (user controls how much independence the agent has)
- **In-Action**: Explainable Rationale + Confidence Signal
- **Post-Action**: Action Audit & Undo + Escalation Pathway

**Escalation Patterns**

When AI fails, lacks permissions, or encounters uncertainty, it must escalate to humans. Design patterns:

1. **Confidence-based escalation** — AI self-assesses; below threshold, it flags for human review
2. **Risk-based escalation** — High-stakes decisions always require human approval regardless of AI confidence
3. **Expertise routing** — AI dynamically learns which humans are best suited for specific question types
4. **Channel-based escalation** — Escalation via Slack, email, or dashboard depending on urgency and context

Key principle: Agent behavior must define its role, scope, how it communicates, and how it escalates when unsure.

**Feedback Loops**

For AI to improve meaningfully over time, user feedback needs to be deliberate, structured, and frictionless. Two modes:

1. **Blocking feedback** — AI pauses and waits for human input before continuing. More control, slower.
2. **Parallel/non-blocking feedback** — AI continues execution while collecting and incorporating feedback asynchronously. Faster, but requires good undo/rollback.

Apple HIG distinguishes:
- **Implicit feedback** — Information from user behavior (what they click, accept, ignore, modify). Wide-ranging but ambiguous.
- **Explicit feedback** — Information users provide in response to a specific request (thumbs up/down, star ratings, correction inputs). Specific but requires effort.
- **Corrections** — A type of implicit feedback when users fix AI mistakes. "Never rely on corrections to make up for low-quality results" — depending on corrections erodes trust.

Design principle for corrections (Apple HIG): Use guided corrections (suggest specific alternatives, less effort) over freeform corrections (require more user input) whenever possible.

**Corrections UX**

Best practices:
- Make corrections inline and low-friction (one-click where possible)
- Show the correction was received and will improve future results
- Don't require users to explain why the AI was wrong (but offer the option)
- Treat corrections as learning signals, not failure states

### Real-World Examples

| Product | Interaction Pattern | Implementation |
|---------|--------------------|----------------|
| **GitHub Copilot** | Suggestion mode | Ghost text appears; Tab to accept, Escape to reject, Cmd+Right for partial accept. When a suggestion fails tests, agent proposes a refined alternative with explanation. Pure suggestion — never acts autonomously on code |
| **Linear** | Configurable autonomy | Triage Intelligence: suggestions shown by default. Users can configure auto-apply for trusted categories (e.g., always apply team routing, but review label suggestions). Granular control over AI independence |
| **Notion AI** | Action with preview | Grayed-out deletions + blue additions shown before user accepts. Users explicitly approve or reject each AI edit. Slash-command triggers keep AI subordinate to user intent |
| **ChatGPT** | Suggestion + Canvas editing | Chat responses are suggestions. Canvas allows direct editing of AI output — the user is always the final editor. "Highlight + instruct" pattern for targeted modifications |
| **Claude** | Suggestion + Artifacts | Responses are suggestions. Artifacts are rendered outputs that users can copy, modify, or iterate on. Human always controls what to do with the output |
| **Gmail Smart Compose** | Auto-complete | Predictive text appears inline while typing. Tab to accept, keep typing to ignore. No explicit rejection needed — minimal friction |
| **Midjourney** | Variation + selection | AI generates 4 options (grid). User selects which to upscale or vary. Remix mode lets user modify the prompt for iterations. The human curates from AI-generated options |
| **Microsoft Copilot** | Dynamic Action Button | Interface reshapes based on user context. Suggests next actions dynamically. Side-by-side chat beside documents for collaborative editing |

### Design Principles

1. **Default to suggestion, not action** — AI should propose, not impose. Users should feel in control.
2. **Make the autonomy level explicit and configurable** — Let users decide how much independence the AI has (Autonomy Dial pattern).
3. **Design for the recovery path** — Service Recovery Paradox (Smashing Magazine 2026): a successful recovery after a failure can create more loyalty than if no failure occurred. Invest heavily in undo, rollback, and error recovery.
4. **Feedback should be in-the-moment** (Google PAIR) — Place feedback requests next to the response. Don't interrupt workflow with separate feedback screens.
5. **Guided corrections over freeform** (Apple HIG) — Suggest specific alternatives rather than asking users to write what went wrong.
6. **Escalation is not failure** — Design escalation as a feature, not a bug. Users should feel confident that the AI knows its limits.

### Anti-Patterns

- **No undo/rollback**: AI takes actions that users cannot reverse. Critical failure for trust
- **Silent autonomous actions**: AI acts in the background without notification. Users discover changes they didn't authorize
- **Correction fatigue**: Requiring too many corrections or making the correction process too effortful. If users must constantly fix the AI, the feature is broken
- **Binary feedback only**: Only offering thumbs up/down when more nuanced feedback would improve the system (e.g., "partially correct", "right answer wrong format")
- **No escalation path**: AI that never says "I'm not sure" or "this needs a human." Overconfident AI that acts on uncertain information
- **Feedback theater**: Collecting feedback (thumbs up/down) but never using it to improve the system. Users learn their feedback is ignored and stop providing it

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [Stanford HAI: Humans in the Loop](https://hai.stanford.edu/news/humans-loop-design-interactive-ai-systems) | Foundational HITL design principles |
| 1 | [Apple HIG: Implicit Feedback](https://developers.apple.com/design/human-interface-guidelines/technologies/machine-learning/implicit-feedback) | Implicit vs explicit feedback, corrections |
| 1 | [Apple HIG: Corrections](https://developer-mdn.apple.com/design/human-interface-guidelines/technologies/machine-learning/corrections) | Guided vs freeform corrections, never rely on corrections for quality |
| 1 | [Google PAIR: Feedback + Control](https://pair.withgoogle.com/chapter/People%20+%20AI%20Guidebook%20-%20Feedback%20+%20Control.pdf) | In-the-moment feedback, control mechanisms |
| 2 | [Smashing Magazine: Designing for Agentic AI (2026)](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/) | Pre/In/Post-Action patterns, Intent Preview, Autonomy Dial, Service Recovery Paradox |
| 2 | [Microsoft: UX Guidance for Generative AI](https://learn.microsoft.com/en-us/microsoft-cloud/dev/copilot/isv/ux-guidance) | DAB, correction support, collaborative UX |
| 2 | [Microsoft: Best Practices for Collaborative UX with Human-AI Partnership](https://learn.microsoft.com/en-us/community/content/best-practices-ai-ux) | Guidance-based interaction |
| 3 | [Ideafloats: Human-in-the-Loop AI 2025](https://blog.ideafloats.com/human-in-the-loop-ai-in-2025/) | HITL design patterns, escalation |
| 3 | [Medium/Bootcamp: UX of AI Feedback Loops](https://medium.com/design-bootcamp/the-ux-of-ai-feedback-loops-6f585ec57706) | Feedback loop design, frictionless collection |
| 3 | [VS Code: Inline Suggestions from Copilot](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions) | Ghost text implementation, partial accept |

---

## Lesson 4: Generative Features

### Core Concepts

**Designing Features That Use AI Generation**

Generative AI features produce novel content — text, images, code, designs — from user prompts. The UX challenge is fundamentally different from traditional features because:
1. Output quality varies per request (non-deterministic)
2. Users need to evaluate quality themselves (no objective "correct" answer in many cases)
3. The gap between "first draft" and "final output" requires edit/refine workflows
4. User expectations are often misaligned with model capabilities

**Text Generation UX**

Core workflow: Prompt → Generate → Review → Edit/Refine → Accept

Key patterns observed across products:
- **Inline generation** (Notion AI): AI writes within the document context. Slash-command or spacebar to trigger. Output appears in-place.
- **Side-panel generation** (ChatGPT Canvas, Claude Artifacts): AI generates in a separate panel. User edits directly or instructs changes via chat.
- **Highlight-and-instruct** (ChatGPT Canvas): Select text, give targeted instructions to modify only that section. Reduces "regeneration hallucination" and token waste.
- **Visual diff** (Notion AI): Gray for deletions, blue for additions. Users visually verify every change.

**Image Generation UX**

Core workflow: Prompt → Generate Grid → Select → Vary/Upscale → Refine → Export

Midjourney's UX established the dominant paradigm:
- Generate 4 options in a grid (reduces commitment to single output)
- Variation controls: Subtle (minor tweaks) vs Strong (significant changes, same theme)
- Upscale controls: Subtle (preserve original) vs Creative (add new detail)
- Remix mode: Modify prompt text while keeping the base image structure
- Vary Region: Paint over specific areas to regenerate only those parts

Design principle: Never force commitment to a single generation. Always provide branching paths.

**Code Generation UX**

Two dominant paradigms:
1. **Inline completion** (GitHub Copilot): Ghost text at cursor, Tab to accept. Minimal disruption to coding flow. Works within existing tools (VS Code, JetBrains).
2. **Prompt-to-code** (v0 by Vercel): Chat prompt produces complete components. Live preview. Iterative refinement through conversation. Works best with design system context (shadcn/ui + Tailwind).

v0's key UX insight: Don't accept the first generation — plan for 3-5 iterations. Provide design system specifications (color palette, spacing, typography) in prompts for higher quality output.

**Edit/Refine Workflows**

The first AI generation is rarely the final product. Products must design for iterative refinement:

| Pattern | Product | How It Works |
|---------|---------|-------------|
| **Conversational refinement** | ChatGPT, Claude, v0 | "Make it more concise" / "Change the color to blue" — natural language instructions |
| **Direct editing** | ChatGPT Canvas | User types directly in the AI output panel, co-editing with AI |
| **Highlight + instruct** | ChatGPT Canvas | Select specific text/code, instruct changes only for that selection |
| **Variation branching** | Midjourney | Generate multiple alternatives from a base, pick the best |
| **Region editing** | Midjourney (Vary Region) | Paint over areas to regenerate only those parts |
| **Slot-based editing** | Figma Make | AI generates layout, user modifies specific slots/components |

Emerging pattern: "Behavioral contracts" — designers define what AI is allowed to do, what it must never do, what it should ask before doing, and how it should explain itself. These become first-class design artifacts alongside mockups and specifications.

**Quality Guardrails in UX**

Guardrails filter harmful, biased, or low-quality AI output. UX implications:

- **Input guardrails**: Filter content that violates policies before it reaches the model
- **Output guardrails**: Catch generated content that violates safety policies
- **Fallback UX**: When guardrails block output, the application needs graceful handling (not just an error). Provide canned/alternative responses
- **False positive tension**: Safe, useful prompts incorrectly flagged as unsafe frustrate users (e.g., a legal assistant refusing to summarize a court ruling due to overzealous content filters)
- **Latency impact**: Real-time guardrails must process in milliseconds to avoid degrading UX

Product guardrail approaches:
- Claude: System-level safety with natural language refusals that explain why
- ChatGPT: Content policy filters with category-specific messaging
- Midjourney: Prompt filters + output classifiers; banned terms list; NSFW content blocked with explanation

**User Expectations Management**

The fundamental challenge: AI is probabilistic by nature, but stakeholders expect deterministic, 100% consistent results (Towards Data Science).

Strategies:
1. **Onboarding honesty**: "I'm still learning about [topic X], so please double-check my answers" (Smashing Magazine trust article)
2. **Progressive capability disclosure**: Introduce features gradually, don't overwhelm with all capabilities at once
3. **Manage the expectations gap**: When expectations are unmet (Penn State research), "users may think they've done something wrong" — transparency about limitations prevents this
4. **Under-promise, over-deliver**: Start with modest claims; let users discover capabilities through use
5. **Segment by AI attitude**: The most meaningful user segmentation is often "AI embracers" vs "AI skeptics" (Lenny's Newsletter). They need different onboarding, different guardrails, different trust-building

According to Figma's 2025 AI report: 78% of designers/developers believe AI boosts efficiency, but fewer than half felt it makes them better at their jobs. Efficiency is useful, but quality still relies on human judgment, taste, and context.

### Real-World Examples

| Product | Feature Type | Implementation |
|---------|-------------|----------------|
| **Notion AI** | Text generation | Write, summarize, translate, brainstorm, adjust length. Accessible via slash-command (purple-highlighted options). Post-selection options: improve writing, translate, adjust length. Powered by GPT-4 + Claude with workspace context |
| **ChatGPT Canvas** | Text + code editing | Side-by-side panel for editing. Highlight function for targeted AI changes. Inline suggestions + formatting tools. Designed like a collaborative editor (Google Docs + LLM) |
| **Claude Artifacts** | Code + documents + interactive | Generates standalone content rendered alongside conversation. Real-time rendering for code and visuals. Users can build and use things, not just look at them |
| **Midjourney** | Image generation | 4-image grid → select → vary (subtle/strong) → upscale (subtle/creative) → remix. Vary Region for inpainting. Entire workflow is iterative by design |
| **v0 by Vercel** | UI/code generation | Prompt → production-ready React/Next.js + Tailwind + shadcn/ui. Live preview. Conversational iteration. Design system integration for brand consistency. "Like a frontend engineer" via chat |
| **Figma Make** | UI/prototype generation | Prompt-to-app / prompt-to-prototype. Embeddable in Figma Design, FigJam, Slides. New editing tools for refinement (2026). 33% of designers use AI to generate assets, 22% for interface drafts |
| **GitHub Copilot** | Code completion + editing | Ghost text for new code. Now also handles inline edits of existing code. Agent mode: proposes refined alternatives when suggestions fail tests/linting, with explanation |

### Design Principles

1. **First generation is a starting point, not the destination** — Design the entire flow around iteration, not single-shot generation.
2. **Provide multiple outputs** — Grids, variations, alternatives. Reduce commitment to single generation. Let users curate.
3. **Make refinement conversational AND direct** — Some users want to type instructions; others want to click and edit directly. Support both.
4. **Guardrails are design artifacts** — Define what AI can do, must never do, should ask before doing, and how it explains itself. These are behavioral contracts.
5. **Set expectations before generation** — Honest onboarding about capabilities and limitations. Different messaging for different user segments.
6. **Keep human judgment in the loop** — AI generates, human evaluates and decides. The "78% efficiency, <50% quality" gap (Figma 2025) is real.

### Anti-Patterns

- **Single-shot generation**: Generating one result with no way to request alternatives or variations. Removes user agency
- **No edit path**: Generating content that users cannot modify — only accept or reject entirely. Forces regeneration for small changes
- **Expectation inflation**: Marketing AI features as "magical" or "perfect," creating a gap between promise and reality that destroys trust
- **Guardrail opacity**: Blocking content without explanation. Users should understand why their request was filtered and how to rephrase
- **Over-blocking (false positives)**: Overzealous content filters that block legitimate use cases. A legal tool that won't summarize court rulings; a medical tool that won't discuss symptoms
- **Ignoring context**: Generating content without considering the user's workspace, brand, design system, or prior work. Generic output when contextual output is possible
- **No graceful degradation**: When the AI can't generate (model unavailable, content blocked, low confidence), showing a generic error instead of helpful alternatives or fallback content
- **Static UX for evolving AI**: The AI model improves but the interface doesn't adapt. New capabilities hidden behind the same old prompts

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [Apple HIG: Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning) | Correction patterns, feedback types |
| 1 | [Google PAIR Guidebook](https://pair.withgoogle.com/guidebook/) | Errors + graceful failure, generative variability |
| 1 | [Figma: 2025 AI Report](https://www.figma.com/reports/ai-2025/) | 78% efficiency stat, <50% quality perception, usage data |
| 2 | [Midjourney Docs: Variations](https://docs.midjourney.com/hc/en-us/articles/32692978437005-Variations) | Subtle/Strong variations, iteration workflow |
| 2 | [Midjourney Docs: Vary Region](https://docs.midjourney.com/hc/en-us/articles/32794723105549-Vary-Region) | Region-based refinement |
| 2 | [Midjourney Docs: Remix](https://docs.midjourney.com/hc/en-us/articles/32799074515213-Remix) | Prompt modification on iterations |
| 2 | [Vercel: Maximizing Outputs with v0](https://vercel.com/blog/maximizing-outputs-with-v0-from-ui-generation-to-code-creation) | Iterative refinement, design system integration |
| 2 | [VS Code: Copilot Inline Suggestions](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions) | Ghost text, partial accept, edit suggestions |
| 2 | [Lenny's Newsletter: Counterintuitive Advice](https://www.lennysnewsletter.com/p/counterintuitive-advice-for-building) | User segmentation (embracers vs skeptics), AI-native rethink |
| 2 | [Microsoft: UX Guidance for Generative AI](https://learn.microsoft.com/en-us/microsoft-cloud/dev/copilot/isv/ux-guidance) | Efficient correction, dynamic UX |
| 3 | [Notion: Everything You Can Do with Notion AI](https://www.notion.com/help/guides/everything-you-can-do-with-notion-ai) | Feature overview, slash-command UX |
| 3 | [Medium: ChatGPT Canvas vs Claude Artifacts](https://medium.com/@cognidownunder/chatgpt-4-0-canvas-vs-claude-3-5-artifacts-a-deep-dive-into-ai-workspaces-6afeecb1e093) | Comparative analysis of workspace patterns |
| 3 | [Medium/Bootcamp: How Notion Uses Visual Design Principles](https://medium.com/design-bootcamp/how-notion-utilize-visual-and-perceptual-design-principles-to-to-increase-new-ai-features-adoption-82e7f0dfcc4e) | Visual diff patterns (gray/blue) |

---

## Synthesis: Cross-Cutting Themes

### Theme 1: The Spectrum of AI Autonomy

All four lessons converge on a single spectrum: how much control does the user retain?

```
Full user control ←————————————————→ Full AI autonomy
Copilot ghost text    Notion AI edits    Linear auto-apply    Autonomous agents
(suggestion)          (preview+approve)  (configurable)       (act+report)
```

The design challenge is not picking a point on this spectrum, but making the spectrum itself visible and configurable by users (Autonomy Dial pattern).

### Theme 2: Trust Is Earned Through Recovery, Not Perfection

AI will make mistakes. The products that win are those that make mistakes recoverable, not those that promise perfection. The Service Recovery Paradox applies: successful recovery after failure builds more loyalty than flawless performance.

Practical implication: Invest more UX budget in error states, undo flows, and correction UX than in the "happy path."

### Theme 3: Progressive Disclosure as the Unifying Pattern

Every lesson uses progressive disclosure differently:
- **Lesson 1**: Surface result → detailed options → raw output
- **Lesson 2**: Result → confidence → sources → full reasoning
- **Lesson 3**: Suggestion → preview → action → audit trail
- **Lesson 4**: Generation → variations → refinement → final

The principle is the same: reveal complexity in proportion to user need.

### Theme 4: The AI-Native Rethink

"It takes time to think AI-native. The first-pass product is often a bolt-on or simple chat experience." (Lenny's Newsletter)

Products that succeed with AI go through three phases:
1. **Bolt-on**: Add AI chat/generation to existing product
2. **Integrated**: Redesign workflows to leverage AI strengths
3. **AI-native**: Product wouldn't exist without AI (Perplexity, Midjourney)

### Theme 5: The Judgment Gap

Figma's 2025 data crystallizes a truth across all four lessons: AI makes work faster (78% agree) but not necessarily better (<50% agree). The UX challenge is helping users apply judgment efficiently — not replacing judgment with automation.

---

## Key Frameworks Referenced (for lesson authoring)

| Framework | Source | Usage |
|-----------|--------|-------|
| Four Pillars of AI Trust | Smashing Magazine 2025 | Lesson 2 — Trust model |
| PAIR Guidebook Chapters | Google PAIR | All lessons — mental models, explainability, feedback, errors |
| Apple HIG ML Patterns | Apple | Lesson 3 — implicit/explicit feedback, corrections |
| Pre/In/Post-Action | Smashing Magazine 2026 (Agentic AI) | Lesson 3 — interaction phases |
| Shape of AI Taxonomy | shapeof.ai | Lesson 1 — Wayfinders, Tuners, Governors, Trust Indicators |
| AIUX 36 Patterns | aiuxdesign.guide | All lessons — pattern catalog |
| Autonomy Dial | Smashing Magazine 2026 | Lesson 3 + Synthesis — user control spectrum |

---

## Gaps and Open Questions

1. **Quantitative data on UX impact**: The NNG statistics (72%, 63%) are among the few hard numbers. Most guidance is qualitative. [Gap for Lesson 2]
2. **Accessibility standards for AI interfaces**: Mentioned as critical (Smashing Magazine) but no established WCAG-equivalent standard exists yet. [Gap for Lesson 1]
3. **Long-term trust dynamics**: Most research covers first impressions, not how trust evolves over months of use. [Gap for Lesson 2]
4. **Cultural differences in AI trust**: Trust patterns likely vary across cultures, but available research is predominantly US/Western-centric. [Gap for Lesson 2]
5. **Generative feature monetization UX**: How to design the boundary between free and paid AI features without breaking trust. Not covered in design literature. [Gap for Lesson 4]
