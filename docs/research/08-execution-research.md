# Research: Chapter 08 — Execution (AI PRDs, Lifecycle & Cross-Functional Delivery)

> Status: Research complete, 2026-03-10
> Purpose: Factual basis for 5 lessons + 1 synthesis
> Quality: Sources ranked per quality plan. Uncertain items marked with [UNCERTAIN].
> Source hierarchy: Peer-reviewed/official docs > Established frameworks > Practitioner content

---

## Lesson 1: AI PRDs

### Core Concepts

#### How AI PRDs Differ from Traditional PRDs

A traditional PRD defines deterministic features: given input X, the system produces output Y. An AI PRD must define a quality range for probabilistic outputs: given input X, the system produces outputs that meet quality threshold Z at least P% of the time.

**Key structural differences:**

| Element | Traditional PRD | AI PRD |
|---------|----------------|--------|
| Requirements | Exact behavior specification | Quality thresholds + evaluation criteria |
| Success criteria | Feature works/doesn't work | Accuracy, latency, cost targets per use case |
| Edge cases | Enumerate and handle each | Define failure modes and graceful degradation |
| Testing | Pass/fail test cases | Eval datasets, benchmark suites, human judgment |
| Acceptance | QA sign-off | Eval metrics above threshold + human review |
| Iteration | Ship when done | Continuous improvement cycle |

#### The AI PRD Template

Based on patterns from Google, Anthropic, and practitioner frameworks, an AI PRD should contain these sections:

**1. Problem Statement & User Context**
- Same as traditional PRD, but emphasize the current user workflow and where AI can reduce friction
- Quantify the pain: how much time/effort does the manual process take?

**2. AI Approach & Rationale**
- Why AI is the right solution (vs. rules, heuristics, or traditional code)
- Which AI approach: LLM API call, RAG, fine-tuned model, agent workflow
- Build vs. buy decision for the AI component

**3. Evaluation Criteria (the most important new section)**
- Golden dataset: what does "correct" output look like for representative inputs?
- Metrics: accuracy, hallucination rate, latency, cost-per-query
- Minimum quality thresholds for launch (e.g., "greater than 85% accuracy on eval set, less than 3% hallucination rate, P95 latency under 4s")
- Human evaluation protocol: who reviews, how often, what scoring rubric

**4. Model & Infrastructure Requirements**
- Model selection rationale (capability vs. cost vs. latency)
- Expected volume and scaling needs
- Infrastructure: hosted API vs. self-hosted, GPU requirements
- Cost projections: cost-per-query at expected volume

**5. User Experience Specification**
- How the AI output is presented to users
- Confidence indicators (if applicable)
- Fallback behavior when AI fails or confidence is low
- User feedback mechanism (thumbs up/down, corrections, regenerate)
- Human-in-the-loop escalation path

**6. Risk & Mitigation**
- Failure modes and their user impact
- Guardrails: input validation, output filtering, safety checks
- Bias considerations for the specific use case
- Privacy implications of the data flowing through the model

**7. Success Metrics & Iteration Plan**
- Launch metrics (quality gates)
- Post-launch monitoring plan
- Iteration cadence: how often will the system be re-evaluated and improved?

#### Prompts as Product Specifications

In AI products built on foundation models, the system prompt is effectively a product specification. This is a paradigm shift:

- The prompt defines the product's behavior, tone, capabilities, and constraints
- Prompt changes are product changes — they should go through review, testing, and versioning
- A/B testing prompts is equivalent to A/B testing product features
- Prompt regression testing (running evals after prompt changes) replaces traditional regression testing for the AI behavior

**Google's approach (from engineering blogs):** Treat prompts as code artifacts. Store in version control, require review, run eval suites on changes, monitor production metrics after deployment. [Source: B — Google Cloud engineering blog]

**Anthropic's guidance:** System prompts should clearly define the assistant's role, constraints, and output format. Ambiguity in prompts leads to inconsistent user experiences. [Source: A — Anthropic documentation]

### Real-World Examples

**Linear's AI PRD approach:**
Linear (project management tool) published their approach to building AI features. They use structured eval datasets before any AI feature ships. Each AI feature has a "quality bar" document that defines minimum accuracy on a golden dataset. Features that fall below the bar do not ship, regardless of timeline pressure. [Source: C — Linear engineering blog]

**Notion AI — iterative PRD process:**
Notion's AI features (summarization, Q&A, writing assistance) went through multiple rounds where the eval criteria in the PRD were updated based on beta feedback. The initial PRDs were "wrong" about what users considered good quality — real usage revealed different quality expectations than internal testing predicted. [Source: C — practitioner talks]

**GitHub Copilot — acceptance rate as a PRD metric:**
GitHub Copilot's PRD equivalent uses "acceptance rate" (percentage of suggestions users accept) as a core product metric. This is a proxy for quality that directly maps to user value. The team discovered that acceptance rate correlated more strongly with developer satisfaction than traditional accuracy metrics. [Source: B — GitHub blog]

### Common PM Misconceptions

1. **"An AI PRD is just a regular PRD with 'AI' added."** — The evaluation section alone changes the entire document structure. Without defined quality thresholds, you have no way to know if the feature is ready to ship.
2. **"We can define exact acceptance criteria."** — AI products have quality distributions, not binary pass/fail. The PRD must define acceptable ranges and failure rates.
3. **"The prompt is an implementation detail."** — The prompt IS the specification for LLM-based features. PMs should own or co-own prompt design with engineering.
4. **"Ship it and improve later."** — Without pre-launch eval criteria, you have no baseline to improve against. "Improve" requires knowing where you started.

### Decision Framework: When to Write an AI PRD vs. Traditional PRD

```
IF feature output is deterministic → Traditional PRD
IF feature uses AI but output is binary (classification, yes/no) → Hybrid PRD (traditional + eval section)
IF feature generates text, images, or complex outputs → Full AI PRD
IF feature involves an agent workflow → Full AI PRD + agent architecture section
ALWAYS: include evaluation criteria if any AI component is involved
```

---

## Lesson 2: AI Product Lifecycle Management

### Core Concepts

#### The AI Product Lifecycle is Not Linear

Traditional product lifecycle: Discovery → Design → Build → Launch → Maintain
AI product lifecycle: Discovery → Prototype → Evaluate → Build → Launch → Monitor → Re-evaluate → Improve → (repeat)

The key difference: **AI products never reach a stable "maintenance" phase.** Models drift, user behavior changes, the world changes (data distribution shifts), and competitors improve. An AI product that is not actively being improved is actively degrading.

#### The Four Phases of AI Product Lifecycle

**Phase 1: Exploration & Prototyping (weeks)**
- Goal: validate that AI can solve the problem at acceptable quality
- Activities: prompt experimentation, model comparison, quick prototypes
- Key output: proof-of-concept that demonstrates feasibility
- PM role: define the problem clearly enough that a prototype can be evaluated
- Common mistake: skipping this phase and committing to a full build based on a demo

**Phase 2: Evaluation & Hardening (weeks to months)**
- Goal: build robust evaluation infrastructure and set quality baselines
- Activities: create eval datasets, build automated eval pipelines, run human evaluations, define quality thresholds
- Key output: eval suite that can reliably measure quality, baseline metrics
- PM role: define what "good enough" looks like for users, own quality thresholds
- Common mistake: rushing to launch without eval infrastructure — "we'll measure quality later"

**Phase 3: Production & Scaling (months)**
- Goal: ship to users and handle real-world traffic
- Activities: production deployment, monitoring, incident response, cost optimization
- Key output: live product with real user metrics
- PM role: monitor quality metrics, manage user feedback, prioritize improvements
- Common mistake: treating launch as the finish line instead of the starting line

**Phase 4: Continuous Improvement (ongoing)**
- Goal: maintain and improve quality as the world changes
- Activities: model updates, prompt refinement, eval dataset expansion, feature iteration
- Key output: improving metrics over time
- PM role: prioritize improvement work against new features, manage model migration
- Common mistake: stopping investment after launch, letting quality degrade

#### Model Versioning & Migration

AI products face a unique lifecycle challenge: the underlying model changes. When OpenAI releases a new GPT version, when Anthropic updates Claude, or when Google updates Gemini, the product's behavior changes — sometimes dramatically.

**Model migration best practices:**
1. **Never auto-upgrade production models.** Pin to specific model versions.
2. **Run eval suite on new model before migration.** Compare metrics side by side.
3. **Expect prompt adjustments.** Prompts optimized for Model A may perform differently on Model B.
4. **Plan for cost changes.** Newer models may be cheaper or more expensive.
5. **Allow rollback.** Keep the old model configuration deployable for at least 2 weeks after migration.

**The model upgrade trap:** A new model may score higher on general benchmarks but perform worse on your specific use case. Always evaluate on YOUR eval dataset, not on the model provider's benchmarks.

#### Monitoring in Production

AI products require three layers of monitoring:

**Layer 1: Infrastructure Monitoring (standard)**
- Uptime, error rates, latency, throughput
- Same as any production service

**Layer 2: Quality Monitoring (AI-specific)**
- Sample-based evaluation: automatically evaluate a random sample of production outputs
- User signal monitoring: track thumbs up/down, regeneration rate, edit distance (how much users modify AI output)
- Drift detection: monitor whether input distributions are changing (users asking for things the model wasn't designed for)
- Hallucination monitoring: automated checks for factual claims, consistency

**Layer 3: Business Impact Monitoring (outcome-level)**
- Adoption trends, task completion rates, support ticket correlation
- Cost tracking: actual cost vs. projected cost per query
- Revenue attribution: is the AI feature driving conversions, retention, or upsells?

### Real-World Examples

**Anthropic's Model Release Cycle:**
Anthropic publishes model cards and system prompts updates with each Claude release. They recommend running evals before switching production traffic. The release of Claude 3.5 Sonnet included detailed capability comparisons to help customers decide whether to upgrade. [Source: A — Anthropic documentation]

**Airbnb AI Listing Descriptions:**
Airbnb introduced AI-generated listing descriptions. The lifecycle followed the pattern: internal prototype → host beta → A/B test against human descriptions → full rollout. Key learning: the team had to continuously update prompts as listing patterns changed with seasons and trends. [UNCERTAIN — reported in conference talks]

**Stripe's AI Fraud Detection Lifecycle:**
Stripe's fraud detection AI operates on a continuous improvement cycle. Models are retrained regularly as fraud patterns evolve. New model versions go through shadow deployment (running alongside production but not making decisions) before taking over. [Source: B — Stripe engineering blog]

### Common PM Misconceptions

1. **"We launched the AI feature, so it's done."** — AI features degrade without active maintenance. Model drift, data drift, and changing user expectations all require ongoing work.
2. **"We can upgrade to the latest model for free improvements."** — Model upgrades can break prompts, change behavior, and alter costs. Every upgrade needs testing.
3. **"Monitoring uptime is enough."** — A model can be online and responding within SLA while producing terrible outputs. Quality monitoring is separate from infrastructure monitoring.
4. **"The ML team handles post-launch."** — The PM must own the quality metrics and improvement prioritization. ML provides the tools; PM decides what to improve and when.

### Decision Framework: How to Prioritize Post-Launch Work

```
URGENT: Quality regression (metrics below launch thresholds) → Fix immediately
HIGH: Model provider deprecation notice → Plan migration with eval cycle
MEDIUM: Gradual quality drift (metrics declining slowly) → Schedule improvement sprint
LOW: New model available with better benchmarks → Evaluate when current model performance is insufficient
ALWAYS: maintain eval infrastructure as a first-class product concern
```

---

## Lesson 3: Cross-Functional Collaboration

### Core Concepts

#### The AI Product Squad

Building AI products requires collaboration between roles that traditionally had limited interaction. The core AI product squad typically includes:

| Role | Traditional Responsibility | AI-Specific Addition |
|------|---------------------------|---------------------|
| Product Manager | Defines what to build, prioritizes | Defines eval criteria, quality thresholds, owns prompts |
| Engineer | Builds the feature | Integrates AI APIs, builds eval pipelines, implements guardrails |
| Designer | Designs the interface | Designs for uncertainty, feedback mechanisms, trust indicators |
| Data Scientist / ML Engineer | (often not in squad) | Model selection, fine-tuning, evaluation methodology |
| QA / Test Engineer | Tests for correctness | Builds eval datasets, runs quality assessments, adversarial testing |

#### PM-Engineer Communication in AI Projects

The biggest communication gap in AI product development is between PMs and ML engineers. Common failure modes:

**Failure Mode 1: The "Make It Better" Problem**
PM says: "The AI responses need to be better."
ML engineer hears: meaningless feedback.
Fix: PMs must provide specific, measurable quality criteria. "Better" means: "The summarization should preserve all named entities from the source text. Currently it drops 23% of entity mentions."

**Failure Mode 2: The "Why Can't It Just..." Problem**
PM says: "Why can't the AI just get this right every time?"
ML engineer thinks: because that's not how probabilistic systems work.
Fix: PMs must internalize that AI systems have error distributions, not bugs. The question is "what error rate is acceptable?" not "why does it make errors?"

**Failure Mode 3: The Eval Gap**
PM writes a PRD with vague quality expectations. Engineering builds without clear eval criteria. At review, PM is unhappy with quality but cannot articulate why.
Fix: Build eval datasets together. PMs provide the "golden answers." Engineers build the scoring pipeline. Review eval results as a team.

#### The Eval Review Ritual

The most effective cross-functional practice for AI teams is a regular eval review meeting:

**Cadence:** Weekly during active development, biweekly post-launch
**Participants:** PM, engineering lead, ML/AI engineer, designer (optional), QA
**Agenda:**
1. Review current eval metrics vs. thresholds (5 min)
2. Review a sample of failures — what went wrong and why (15 min)
3. Discuss user feedback signals — regeneration rate, thumbs down patterns (5 min)
4. Prioritize improvement actions for next sprint (5 min)

**Why this works:** It creates shared understanding of quality. PMs see the technical constraints. Engineers see the user impact. The team aligns on what "good enough" means.

#### Working with Data Scientists and ML Engineers

Data scientists and ML engineers bring a different mental model to product development:

**Researcher mindset vs. product mindset:**

| Researcher (Data Scientist) | Product Builder (PM/Engineer) |
|-----------------------------|-------------------------------|
| Optimizes for accuracy on benchmarks | Optimizes for user experience |
| Values novelty and state-of-the-art | Values reliability and ship speed |
| Measures in F1 scores and perplexity | Measures in adoption and revenue |
| Wants to explore more approaches | Wants to ship what works |
| Timelines are estimates | Deadlines are commitments |

Neither mindset is wrong. The PM's job is to translate between them:
- Help data scientists understand user impact: "A 2% accuracy improvement on this use case prevents 500 user complaints per week."
- Help engineers understand exploration value: "Testing three approaches now saves us from rebuilding later."
- Create shared metrics everyone cares about: task completion rate bridges the gap between technical metrics and user outcomes.

#### Design for AI: The Designer's New Role

Designers working on AI products face unique challenges:

**1. Designing for uncertainty:**
- AI output quality varies. The design must handle both great and poor outputs gracefully.
- Confidence indicators: when should the UI show the AI's confidence level?
- Progressive disclosure: show AI suggestions tentatively, let users confirm/modify/reject.

**2. Designing feedback loops:**
- Thumbs up/down: simple but limited signal
- Edit tracking: how much did the user modify the AI output? (implicit quality signal)
- Regenerate button: gives users control and provides quality data
- "Report an issue" affordance: captures specific failure modes

**3. Designing for trust:**
- Transparency: explain what the AI did and why (where possible)
- Source attribution: for RAG systems, show where the information came from
- Limitations disclosure: clearly state what the AI cannot do
- Graceful degradation: when AI fails, the experience should not be broken

### Real-World Examples

**Spotify's Squad Model for ML Features:**
Spotify organizes ML features within existing squads rather than in a separate ML team. Each squad has access to a shared ML platform, but the product squad owns the feature end-to-end. The ML platform team provides tooling (feature stores, model serving, eval infrastructure) while product squads own the user experience. [Source: B — Spotify engineering blog]

**Vercel's AI SDK Approach:**
Vercel's v0 (AI code generation) team operates with tight PM-engineer-designer collaboration. The PM defines quality through example outputs (golden dataset approach). Engineers build the generation pipeline. Designers define how generated code is presented and how users iterate on it. [UNCERTAIN — reported in dev conferences]

**Microsoft Copilot Team Structure:**
Microsoft reportedly organized its Copilot work across existing Office product teams rather than creating a separate AI team. Each product team (Word, Excel, PowerPoint) integrated Copilot within their existing squad, with a shared Copilot platform layer providing common AI infrastructure. [Source: B — Microsoft engineering announcements]

### Common PM Misconceptions

1. **"The ML team will tell me what's possible."** — The PM needs to define the problem and quality bar. The ML team evaluates feasibility against those criteria. Problem definition is the PM's job, not ML's.
2. **"Designers don't need to be involved early for AI features."** — Design for AI is fundamentally different. Designers need to understand model limitations early to design appropriate interaction patterns.
3. **"Cross-functional alignment means more meetings."** — The eval review ritual replaces multiple ad-hoc check-ins. One structured meeting is more effective than five hallway conversations.
4. **"Data scientists and product engineers can figure it out."** — Without PM translation between research and product mindsets, teams talk past each other. The PM bridges the gap.

### Decision Framework: When to Involve Which Role

```
PROBLEM DEFINITION: PM leads, designer contributes (user context)
FEASIBILITY CHECK: ML engineer leads, PM provides quality targets
EVAL DATASET CREATION: PM provides golden answers, ML builds pipeline, QA validates
UX DESIGN: Designer leads, PM provides AI constraints, engineer reviews feasibility
PROMPT DEVELOPMENT: PM + engineer co-own, ML advises on model behavior
PRODUCTION MONITORING: Engineer leads infrastructure, PM leads quality metrics, ML leads model health
```

---

## Lesson 4: Data Quality & Governance

### Core Concepts

#### Why Data Quality is an AI Product Problem, Not Just an Engineering Problem

In traditional software, data quality affects reporting and analytics. In AI products, data quality directly affects product quality. Bad data in → bad AI output → bad user experience. This makes data quality a PM concern, not just a data engineering concern.

**Three types of data quality issues in AI products:**

**1. Training/Fine-Tuning Data Quality**
- Applies when you fine-tune models or train custom models
- Issues: mislabeled data, biased samples, outdated information, insufficient coverage
- Impact: model learns wrong patterns, performs poorly on underrepresented cases

**2. Context Data Quality (RAG/Knowledge Base)**
- Applies when your AI product retrieves information to augment responses
- Issues: stale documents, contradictory information, poor chunking, missing metadata
- Impact: AI gives outdated or wrong answers, cites irrelevant sources, hallucinations increase

**3. User Input Data Quality**
- Applies to all AI products
- Issues: ambiguous queries, adversarial inputs, out-of-scope requests
- Impact: poor responses, safety violations, wasted compute

#### The Data Quality Pyramid for AI Products

```
          /\
         /  \   Freshness: Is the data current?
        /    \
       /------\   Completeness: Does it cover all relevant cases?
      /        \
     /----------\   Consistency: Are there contradictions?
    /            \
   /--------------\   Accuracy: Is the data factually correct?
  /                \
 /------------------\   Availability: Can the AI access it at inference time?
```

Each layer depends on the ones below it. There is no point optimizing freshness if the data is inaccurate.

#### Data Governance for AI Products

Data governance defines who can use what data, how, and under what constraints. For AI products, this becomes critical because:

1. **Model training data has legal implications.** Copyright, privacy regulations (GDPR, CCPA), and licensing all constrain what data you can use.
2. **User data flowing through AI models raises privacy concerns.** User queries sent to third-party model APIs may be used for training (unless explicitly opted out).
3. **AI outputs can inadvertently leak training data.** Models can memorize and reproduce portions of training data, including PII.

**Key governance questions for PMs:**

| Question | Why It Matters |
|----------|---------------|
| Where does our training data come from? | Legal risk, bias risk |
| Is user data sent to third-party APIs? | Privacy, compliance |
| Does the model provider train on our data? | IP protection, competitive risk |
| How do we handle PII in AI contexts? | GDPR, CCPA compliance |
| Who approves changes to training data? | Quality control, accountability |
| How long do we retain AI interaction data? | Privacy, storage costs |

#### Practical Data Quality Practices

**For RAG-based products:**
1. **Document freshness policy:** Define how often knowledge base documents are reviewed and updated. Stale documents are the #1 cause of incorrect RAG responses.
2. **Chunking strategy matters:** How documents are split into chunks for retrieval directly affects answer quality. Poor chunking → poor retrieval → hallucinated answers.
3. **Metadata enrichment:** Adding metadata (date, author, topic, reliability rating) to documents helps retrieval quality and enables source attribution.
4. **Contradiction detection:** When multiple documents provide conflicting information, the AI product needs a policy for which source takes precedence.

**For products using third-party model APIs:**
1. **Data processing agreements (DPAs):** Ensure your model provider has appropriate DPAs in place. Most enterprise API agreements explicitly exclude customer data from training.
2. **Data residency:** Some regulations require data to stay within specific geographic regions. Verify your model provider's data processing locations.
3. **Opt-out of training:** Verify that your API agreement ensures your data is not used for model training. OpenAI, Anthropic, and Google all offer this for API customers by default. [Source: A — provider documentation]

#### The "Garbage In, Garbage Out" Problem at Scale

The traditional GIGO problem is amplified in AI products because:
- AI makes errors look authoritative (confident wrong answers)
- Users may not verify AI outputs, propagating errors downstream
- Scale means a small data quality issue affects thousands of users
- Feedback loops: if users accept wrong AI answers and those answers feed back into the system, quality degrades over time

### Real-World Examples

**Retrieval-Augmented Generation (RAG) Quality at Scale:**
Companies deploying RAG-based AI assistants (e.g., internal knowledge bots) consistently report that 60-80% of quality issues trace back to knowledge base data quality, not model capability. The model is only as good as what it can retrieve. [Source: C — multiple practitioner reports, LangChain community]

**Samsung Data Leak Incident (2023):**
Samsung engineers pasted proprietary source code into ChatGPT, which at the time could use chat data for training. Samsung subsequently banned employee use of external AI tools and began developing internal alternatives. This remains the most cited example of AI data governance failure. [Source: A — widely reported news]

**GDPR and AI: The Right to Erasure Challenge:**
Under GDPR, users can request deletion of their data. For AI products, this raises the question: if user data was used to fine-tune a model, can you "unlearn" it? Current consensus: this is technically extremely difficult. Best practice is to not use personal data for training, or to maintain clear data lineage so affected data can be excluded from future training runs. [Source: B — legal analyses, EU AI Act discussions]

**Stack Overflow Data Licensing:**
Stack Overflow's decision to license its data for AI training (and the community backlash) illustrates the complexity of data sourcing for AI. Even "public" data has licensing constraints. PMs must understand the provenance of any data used in their AI products. [Source: A — widely reported]

### Common PM Misconceptions

1. **"Data quality is the data team's problem."** — In AI products, data quality IS product quality. PMs must own data quality requirements even if they don't implement the solutions.
2. **"We use a third-party API, so data governance doesn't apply to us."** — You still send user data to the API. You still need governance around what data is sent, how it's handled, and how long it's retained.
3. **"Our knowledge base is fine — we built it once."** — Knowledge bases degrade over time. Documents become outdated, new information is missing, and contradictions accumulate. Regular maintenance is essential.
4. **"GDPR/privacy doesn't apply because we only use the API."** — Sending user data to any third party (including model APIs) has privacy implications. PII in prompts, user queries containing sensitive information, and output logging all require governance.

### Decision Framework: Data Quality Investment Priority

```
IF building RAG product → Knowledge base quality is your #1 investment (freshness, chunking, dedup)
IF fine-tuning models → Training data quality and bias auditing are critical
IF using API only (no RAG, no fine-tuning) → Focus on user input handling and output governance
ALWAYS: understand your data flows (what goes where), have DPAs with providers, log responsibly
```

---

## Lesson 5: Agile for AI

### Core Concepts

#### Why Traditional Agile Doesn't Work for AI

Agile methodologies (Scrum, Kanban) assume work is estimable and progress is roughly linear. AI development breaks these assumptions:

| Agile Assumption | AI Reality |
|-----------------|------------|
| Stories can be estimated | AI experiments have unpredictable outcomes |
| Progress is incremental | AI quality can plateau or regress suddenly |
| Definition of done is clear | "Good enough" quality is subjective and shifting |
| Sprints produce shippable increments | AI prototypes may prove the approach is infeasible |
| Velocity stabilizes over time | AI development velocity is inherently variable |

This does not mean Agile is useless for AI — it means it must be adapted.

#### Adapted Agile for AI Teams

**The Dual-Track Approach:**

Track 1: **Exploration (research/experimentation)**
- Timeboxed experiments: "Can we achieve X quality with approach Y in Z weeks?"
- Outcome: feasibility assessment, not shippable feature
- Not estimable in story points — use timebox budgets instead
- Kill criteria: define upfront when to abandon an approach

Track 2: **Production (building/shipping)**
- Traditional Agile works here: integration, UI, infrastructure, deployment
- Estimable, incremental, sprintable
- Standard velocity tracking applies

**Running both tracks in parallel** is the key. While Track 1 explores whether a new model can improve summarization quality, Track 2 builds the production infrastructure for the current approach.

#### Sprint Ceremonies Adapted for AI

**Sprint Planning:**
- Separate AI experiments from production work in the backlog
- Experiments get timeboxes, not story points: "2 days to test approach A, 3 days for approach B"
- Production work gets standard estimation
- Rule: no more than 30% of sprint capacity on experiments (unless early exploration phase)

**Daily Standup:**
- Add "experiment status" to standup format: "I ran experiment X, results show Y, next step is Z"
- Experiments that are not producing results after their timebox should be escalated, not extended silently

**Sprint Review / Demo:**
- Demo experiments with data, not opinions: "Approach A achieved 82% accuracy on eval set, Approach B achieved 71%. Approach A adds 200ms latency. Recommendation: Approach A with optimization."
- Show eval metrics alongside feature demos

**Retrospective:**
- Add: "What did we learn that we didn't expect?" — AI development frequently produces surprising results (positive and negative)
- Review experiment kill decisions: did we abandon approaches too early or too late?

#### Estimation Strategies for AI Work

**For exploration/experiment work:**
- Do NOT estimate in story points — this is misleading
- Use timeboxes: "We will spend 3 days investigating approach X"
- Define clear success/failure criteria before starting: "If accuracy is below 75% after 3 days, we pivot"
- Budget a percentage of team capacity for experiments (typically 20-30%)

**For production/integration work:**
- Standard story point estimation works
- Add "eval infrastructure" stories explicitly — teams chronically underestimate eval work
- Add "prompt engineering" stories explicitly — prompt optimization is real work, not "just tweaking text"

**For model migration work:**
- Size based on eval suite comprehensiveness: more eval coverage = more predictable migration
- Always budget for prompt adjustments after model migration
- Include rollback plan in the estimate

#### The "Experiment Spike" Pattern

Borrowed from XP/Agile "spike" concept, adapted for AI:

1. **Define the question:** "Can Model X achieve greater than 85% accuracy on our summarization task?"
2. **Set the timebox:** 2-5 days
3. **Define the eval:** use existing eval dataset or create a minimal one
4. **Run the experiment:** prototype, evaluate, document
5. **Report back:** metrics, learnings, recommendation (continue/pivot/abandon)
6. **Decision gate:** PM + tech lead decide next step based on results

This pattern prevents unbounded exploration ("let me just try one more thing") while ensuring adequate experimentation.

### Real-World Examples

**Spotify's ML Delivery Framework:**
Spotify developed an internal framework for managing ML projects alongside traditional product work. Key principles: separate experimentation from productionization, use timeboxed "bets" for ML experiments, and gate production investment on experiment results. Teams track "ML experiment velocity" (experiments completed per sprint) separately from "feature velocity." [Source: B — Spotify engineering blog]

**Google's AI Development Process:**
Google reportedly uses a stage-gate process for AI features: Feasibility → Prototype → Eval → Production. Each gate requires specific metrics to be met. The feasibility gate is particularly important — many AI feature ideas are killed at this stage because the quality bar cannot be met, saving months of wasted production work. [Source: C — engineering conference talks]

**The "Two-Week Rule" (practitioner pattern):**
Multiple AI product teams report using a "two-week rule": if two weeks of experimentation cannot achieve 70% of the target quality, the approach should be reconsidered. The rationale: the last 30% of quality improvement typically takes 10x the effort of the first 70%. If you can't reach 70% quickly, the approach may be fundamentally limited. [Source: C — practitioner blogs and talks]

### Common PM Misconceptions

1. **"We should estimate AI work like any other feature."** — AI experiments are research, not engineering. Forcing story points on research creates false precision and frustration.
2. **"Exploration means no deadlines."** — Timeboxes ARE the deadline. The outcome might be "we proved this won't work" — that's a valid and valuable result.
3. **"We need to finish research before starting production work."** — Dual-track means running both in parallel. While exploring better approaches, you can build production infrastructure for the current-best approach.
4. **"Velocity should be stable."** — AI development velocity naturally fluctuates. Sprints with experiments will look "slower" on feature delivery. This is expected, not a problem.
5. **"Agile doesn't work for AI, so we need a new methodology."** — Agile with adaptations works well. The core principles (iteration, transparency, feedback) are MORE important for AI, not less.

### Decision Framework: How to Structure AI Development

```
IF early stage (first AI feature) → 60% exploration, 40% production infrastructure
IF mid stage (AI feature validated) → 30% exploration/improvement, 70% production
IF mature (AI feature in production) → 20% improvement experiments, 80% production/optimization
ALWAYS: separate experiment work from production work in planning
ALWAYS: define kill criteria before starting experiments
ALWAYS: timebox experiments, never open-ended exploration
```

---

## Lesson 6: Synthesis Connectors

### How Chapter 08 Connects to All Previous Chapters

This chapter covers the execution mechanics of AI products. Here is how each previous chapter connects to the execution themes in Chapter 08.

#### Chapter 01: Foundations → AI PRDs
- **Connection:** Understanding AI capabilities and limitations (Ch01) is prerequisite for writing good AI PRDs (Ch08 Lesson 1). PMs who do not understand how LLMs work cannot write meaningful eval criteria.
- **Key link:** The PRD's evaluation section requires foundational understanding of what AI can and cannot do reliably.

#### Chapter 02: Strategy → Lifecycle Management
- **Connection:** The strategy decisions from Ch02 (when to use AI, build vs. buy) determine the lifecycle complexity in Ch08 Lesson 2. A "buy" decision (API integration) has a different lifecycle than a "build" decision (custom model).
- **Key link:** Strategy determines lifecycle shape. API-based products have model migration as a major lifecycle event. Custom model products have training data as a major lifecycle concern.

#### Chapter 03: Product Design → Cross-Functional Collaboration
- **Connection:** AI-native design patterns (Ch03) require close designer-PM-engineer collaboration (Ch08 Lesson 3). Designing for uncertainty requires all three roles to align on how AI limitations are presented to users.
- **Key link:** The "designing for uncertainty" challenge from Ch03 is executed through the cross-functional practices in Ch08. Good AI UX emerges from team collaboration, not from any single role.

#### Chapter 04: Technical Literacy → Data Quality
- **Connection:** Technical understanding of prompting, RAG, and fine-tuning (Ch04) directly informs data quality requirements (Ch08 Lesson 4). RAG quality depends on knowledge base quality. Fine-tuning quality depends on training data quality.
- **Key link:** The PM's technical literacy determines whether they can spot data quality issues before they become product quality issues.

#### Chapter 05: Evaluation → AI PRDs & Lifecycle
- **Connection:** The evaluation frameworks from Ch05 are the operational backbone of AI PRDs (Ch08 Lesson 1) and lifecycle monitoring (Ch08 Lesson 2). Without eval infrastructure, neither PRDs nor lifecycle management work.
- **Key link:** Eval criteria in the PRD come from Ch05's frameworks. Post-launch monitoring uses Ch05's metrics. Evaluation ties the entire execution process together.

#### Chapter 06: Agentic AI → Agile Adaptation
- **Connection:** Agentic AI systems (Ch06) add complexity to the execution process. Multi-agent systems have more failure modes, require more elaborate eval, and make Agile estimation even harder (Ch08 Lesson 5).
- **Key link:** Agent architectures require the dual-track approach from Ch08 Lesson 5 even more — agent behavior is less predictable than single-model features, so experimentation is critical.

#### Chapter 07: Ethics & Governance → Data Governance
- **Connection:** The ethical frameworks from Ch07 inform data governance practices in Ch08 Lesson 4. Privacy, bias, and safety concerns must be operationalized in data handling and model governance.
- **Key link:** Ethics is the "why" of governance. Ch08 Lesson 4 is the "how." Responsible AI requires both principled thinking (Ch07) and operational practices (Ch08).

### The Execution Metaframework

Across all five lessons, a coherent execution model emerges:

```
SPECIFY what good looks like with AI PRDs and eval criteria (Lesson 1)
    ↓
MANAGE the continuous lifecycle — build, ship, monitor, improve (Lesson 2)
    ↓
COLLABORATE across functions with shared eval rituals (Lesson 3)
    ↓
GOVERN data quality as a product quality concern (Lesson 4)
    ↓
ADAPT your development process to handle AI's uncertainty (Lesson 5)
    ↓
REPEAT: each cycle improves both the product and the team's AI capabilities
```

**The single most important execution insight:** AI product execution is fundamentally about managing uncertainty. Traditional product execution minimizes uncertainty through upfront specification. AI product execution embraces uncertainty through continuous evaluation and rapid iteration. The teams that build the best eval infrastructure ship the best AI products.

---

## Source Index

### Source Rating: A (Official / Verified)
- Anthropic documentation — [docs.anthropic.com](https://docs.anthropic.com)
- Samsung ChatGPT data leak — widely reported news (Bloomberg, Reuters, 2023)
- Stack Overflow data licensing controversy — widely reported news
- OpenAI, Anthropic, Google API data usage policies — verified from documentation

### Source Rating: B (Established Industry Publications)
- Google Cloud Blog: AI product development best practices — [cloud.google.com/blog](https://cloud.google.com/blog)
- GitHub Blog: Copilot product metrics — [github.blog](https://github.blog)
- Spotify Engineering Blog: ML delivery practices — [engineering.atspotify.com](https://engineering.atspotify.com)
- Stripe Engineering Blog: ML system lifecycle — [stripe.com/blog/engineering](https://stripe.com/blog/engineering)
- Microsoft Copilot engineering announcements — Microsoft Build, Ignite talks
- EU AI Act and GDPR intersection — legal analyses from established firms

### Source Rating: C (Practitioner / Newsletter)
- Linear engineering blog: AI feature quality approach
- LangChain community: RAG data quality reports
- Various AI PM practitioner talks at conferences (AI Engineer Summit, Product School events)
- "Two-week rule" practitioner pattern — multiple independent sources

### Source Rating: D (Opinion / Unverified)
- Various "Agile is dead for AI" hot takes — used only for counter-argument context

---

## Open Questions for Further Research

1. **AI PRD templates in the wild:** Few companies have published their actual AI PRD templates. Linear and Notion have shared fragments. A more comprehensive collection would strengthen Lesson 1.
2. **Model migration case studies:** Specific stories of companies migrating between model versions (e.g., GPT-3.5 → GPT-4 → GPT-4o) and the impact on product quality would add concrete examples to Lesson 2.
3. **Data quality metrics for RAG:** The "60-80% of quality issues trace to data quality" claim is frequently cited in practitioner circles but lacks a definitive source. Would benefit from structured survey data.
4. **Agile adaptation frameworks:** Some companies have published internal AI development frameworks. A systematic comparison would strengthen Lesson 5.
5. **Cross-functional friction data:** Surveys on PM-ML engineer communication challenges would add evidence to Lesson 3. Product School or Reforge may have relevant data.

---

## Document Metadata

- **Chapter:** 08 — Execution
- **Lessons covered:** 5 + synthesis connectors
- **Total lines:** ~550
- **Research date:** 2026-03-10
- **Uncertain claims marked:** Yes ([UNCERTAIN] notation)
- **Source ratings included:** Yes (A/B/C/D scale)
- **Next step:** Convert to MDX lesson files (DE + EN)
