# Research: Chapter 05 — Evaluation (AI Product Evaluation & Quality)

> Status: Research complete
> Date: 2026-03-10
> Purpose: Factual basis for 5 lessons + 1 synthesis
> Source hierarchy: Peer-reviewed/official docs > Established frameworks > Practitioner content
> Quality: Sources ranked per quality plan. Uncertain items marked with [UNCERTAIN].

---

## Lesson 1: Eval Frameworks

### Core Concepts

#### 1.1 Why Evals Are the PM's Core Responsibility

Traditional software testing checks deterministic behavior: input X must produce output Y. AI systems are probabilistic — the same input may yield different outputs across runs. This makes classical unit testing insufficient. Evaluation ("evals") is the discipline of systematically measuring AI output quality so that teams can iterate with confidence.

Hamel Husain and Shreya Shankar (creators of the #1 AI evals course, featured on Lenny's Podcast) frame evals as the single most important skill for AI product builders: "Your AI product needs evals" is not optional advice — it is the foundation of every improvement cycle. The PM owns the eval strategy because the PM defines what "good" means for the user.

**The eval ownership chain:**
- **PM** defines quality criteria (what matters to users and the business)
- **Domain expert** labels golden datasets and validates edge cases
- **Engineer** implements automated eval pipelines and CI integration
- **PM + domain expert** review results and make ship/no-ship calls

**Sources:**
- [Hamel Husain: Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/)
- [Hamel Husain: LLM Evals — Everything You Need to Know](https://hamel.dev/blog/posts/evals-faq/)
- [Lenny's Newsletter: Building Eval Systems That Improve Your AI Product](https://www.lennysnewsletter.com/p/building-eval-systems-that-improve)
- [Maven: AI Evals For Engineers & PMs (Husain & Shankar)](https://maven.com/parlance-labs/evals)

#### 1.2 Golden Datasets

A golden dataset is a curated set of input-output pairs where the expected output has been verified by a domain expert. It functions like a test suite — the AI system is evaluated against it to measure quality and catch regressions.

**How to build a golden dataset from scratch:**
1. **Collect real inputs** — Pull from production logs, support tickets, user sessions. Never rely solely on synthetic data for your first dataset.
2. **Sample for diversity** — Cover topics, intents, difficulty levels, languages, edge cases, and adversarial inputs. Aim for breadth over volume initially.
3. **Label with domain experts** — One expert who deeply understands user needs is worth ten casual annotators. Use PASS/FAIL judgments rather than 1-5 scales (Husain's recommendation).
4. **Include reasoning** — For each label, the expert writes a short critique explaining why the output passes or fails. This reasoning becomes the foundation for LLM-as-Judge prompts later.
5. **Start small, grow continuously** — Begin with 50-100 examples. Add production failures as regression tests. A golden dataset is a living artifact, not a one-time deliverable.
6. **Version and track** — Treat golden datasets like code: version-controlled, reviewed, updated as product requirements evolve.

**Size guidance:** Test datasets for CI are typically 100+ examples, purpose-built to cover core features, regression tests for past bugs, and known edge cases. Larger datasets (500-1000+) are used for periodic deep evaluations.

**Sources:**
- [Maxim AI: Building a Golden Dataset for AI Evaluation](https://www.getmaxim.ai/articles/building-a-golden-dataset-for-ai-evaluation-a-step-by-step-guide/)
- [Hamel Husain: A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/)
- [Pragmatic Engineer: A Pragmatic Guide to LLM Evals for Devs](https://newsletter.pragmaticengineer.com/p/evals)

#### 1.3 LLM-as-Judge

LLM-as-Judge uses a large language model to evaluate the outputs of another model, approximating human judgment at scale. It is the most important evaluation technique for generative AI products where outputs are subjective or open-ended.

**How it works:**
1. Define an evaluation prompt that instructs the judge LLM on criteria (accuracy, relevance, tone, completeness)
2. Provide the judge with the input, the system output, and optionally a reference answer from the golden dataset
3. The judge returns a score (PASS/FAIL or numeric) plus reasoning
4. Validate judge accuracy against human labels — target 80%+ agreement (matching human-to-human consistency levels)

**Best practices (2025 consensus):**
- Use PASS/FAIL over numeric scales — cleaner signal, easier to act on
- Always include chain-of-thought reasoning in the judge prompt — forces the judge to explain its decision before scoring
- Use a stronger model as judge than the model being evaluated (e.g., Claude Opus judging Sonnet outputs)
- Validate the judge against human labels using Cohen's Kappa or similar inter-rater reliability metrics
- Partition your golden dataset: use one portion to develop the judge prompt, another to validate generalization

**Cost and scale:** LLM-as-Judge offers 500x-5000x cost savings over human review while achieving approximately 80% agreement with human preferences.

**Sources:**
- [Evidently AI: LLM-as-a-Judge — A Complete Guide](https://www.evidentlyai.com/llm-guide/llm-as-a-judge)
- [Monte Carlo Data: LLM-As-Judge — 7 Best Practices](https://www.montecarlodata.com/blog-llm-as-judge/)
- [Arize AI: LLM as a Judge — Primer](https://arize.com/llm-as-a-judge/)
- [Comet: LLM-as-a-Judge — How to Build Reliable, Scalable Evaluation](https://www.comet.com/site/blog/llm-as-a-judge/)
- [Stack Overflow: Who Watches the Watchers? LLM on LLM Evaluations (Oct 2025)](https://stackoverflow.blog/2025/10/09/who-watches-the-watchers-llm-on-llm-evaluations/)

#### 1.4 Human Eval

Human evaluation remains the gold standard for subjective quality assessment. It is expensive and slow, but irreplaceable for calibrating automated systems.

**When human eval is essential:**
- Building the initial golden dataset (there is no shortcut here)
- Validating LLM-as-Judge accuracy against ground truth
- Evaluating new task types where no automated metrics exist yet
- Assessing tone, brand voice, cultural sensitivity, and nuanced quality dimensions
- Periodic audits of automated eval drift

**Husain's practical recommendation:** Spend 30 minutes manually reviewing 20-50 LLM outputs whenever making significant changes to prompts, models, or retrieval. This "error analysis" practice catches issues that no automated metric can see and should precede any investment in eval tooling.

**Sources:**
- [Hamel Husain: Selecting The Right AI Evals Tool](https://hamel.dev/blog/posts/eval-tools/)
- [Aakash Gupta: AI Evals — Everything You Need to Know to Start](https://www.news.aakashg.com/p/ai-evals)

#### 1.5 Automated Eval Pipelines

Mature AI products run evals in CI/CD, just like software tests. The pipeline catches regressions before they reach users.

**A typical eval pipeline:**
```
Code change → Build → Run golden dataset evals → LLM-as-Judge scoring →
Compare against baseline → Gate (pass/fail threshold) → Deploy or block
```

**Pipeline components:**
- **Dataset management** — Versioned golden datasets, production failure samples
- **Scoring** — Automated metrics + LLM-as-Judge + optional human review for borderline cases
- **Baseline comparison** — Every eval run is compared against the previous release's scores
- **Alerting** — Regression beyond a threshold triggers alerts and blocks deployment
- **Production monitoring** — Sample live traffic and score it asynchronously to detect drift

#### 1.6 Tool Landscape (as of early 2026)

| Tool | Best for | Key strength | License |
|------|----------|-------------|---------|
| **Promptfoo** | Red teaming + security testing | CLI-first, 60+ attack types, Node.js native | Open source (MIT) |
| **DeepEval** | Comprehensive LLM testing | 60+ metrics, pytest integration, Python native | Open source |
| **RAGAS** | RAG pipeline evaluation | Research-backed retrieval + generation metrics | Open source |
| **LangSmith** | LangChain/LangGraph teams | Framework-native tracing + evaluation | Commercial (free tier) |
| **Braintrust** | Release quality gates | End-to-end lifecycle: dataset → scoring → CI gates → monitoring | Commercial (free tier) |
| **Langfuse** | Self-hosted observability | Open-source tracing + evaluation, no vendor lock-in | Open source |
| **Arize Phoenix** | Production monitoring | Real-time drift detection, trace analysis | Open source |

**Tool selection guidance:**
- Start with manual review + a simple script before adopting any tool
- If Python team: DeepEval or RAGAS
- If Node.js team: Promptfoo
- If LangChain stack: LangSmith
- If release-gating is the priority: Braintrust
- If self-hosting matters: Langfuse

**Sources:**
- [Braintrust: DeepEval Alternatives (2026)](https://www.braintrust.dev/articles/deepeval-alternatives-2026)
- [Braintrust: Best Promptfoo Alternatives (2026)](https://www.braintrust.dev/articles/best-promptfoo-alternatives-2026)
- [AIMultiple: The LLM Evaluation Landscape with Frameworks in 2026](https://research.aimultiple.com/llm-eval-tools/)
- [Arize: Comparing LLM Evaluation Platforms (2025)](https://arize.com/llm-evaluation-platforms-top-frameworks/)
- [DEV Community: Top 5 Open-Source LLM Evaluation Frameworks in 2026](https://dev.to/guybuildingai/-top-5-open-source-llm-evaluation-frameworks-in-2024-98m)
- [DataTalks.Club: Open Source AI Agent Evaluation Tools](https://datatalks.club/blog/open-source-free-ai-agent-evaluation-tools.html)

### Real-World Examples

1. **GitHub Copilot:** Maintains extensive golden datasets of code completion scenarios. Uses both automated metrics (code compiles, tests pass) and human eval (developer satisfaction surveys). The eval suite is what allowed them to swap underlying models without degrading user experience.

2. **Airbnb (Husain's case study):** Used domain expert review of production traces to build a golden dataset, then calibrated an LLM-as-Judge against those labels. The judge prompt was iterated until it matched expert PASS/FAIL judgments at >80% agreement. This became the foundation for CI-gated evaluation.

3. **Braintrust customers:** Use release quality gates where every deployment must pass a defined quality threshold on the golden dataset before going live — connecting evaluation directly to deployment decisions.

### Common PM Misconceptions

1. **"We need a tool first."** Wrong order. Start with manual error analysis (20-50 outputs, 30 minutes). Understand failure modes before selecting any tool. Tools amplify a good eval strategy; they cannot substitute for one.

2. **"Generic benchmarks tell us if our product is good."** MMLU, HumanEval, and other public benchmarks measure model capability, not product quality. Your eval must reflect your specific users, tasks, and quality bar.

3. **"Evals are an engineering concern."** The PM defines what "good" looks like. Without PM ownership of eval criteria, engineering builds technically correct but product-irrelevant test suites.

4. **"More data = better evals."** 100 carefully curated, expert-labeled examples outperform 10,000 noisy, crowd-sourced ones. Quality of labels matters more than quantity.

5. **"Once we set up evals, we're done."** Eval datasets must evolve with the product. Every production failure should become a regression test. Static eval suites become stale within weeks.

### Decision Framework: Building Your First Eval Suite

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Manually review 50 production outputs with a domain expert | Day 1-2 |
| 2 | Categorize failure modes (wrong answer, hallucination, tone, format) | Day 2-3 |
| 3 | Build a golden dataset of 100 labeled examples covering each failure mode | Week 1-2 |
| 4 | Write a simple eval script (no fancy tools) that runs the golden dataset | Week 2 |
| 5 | Add LLM-as-Judge for subjective dimensions; validate against human labels | Week 3 |
| 6 | Integrate into CI/CD with pass/fail thresholds | Week 4 |
| 7 | Add production sampling: score a % of live traffic asynchronously | Month 2 |
| 8 | Adopt a platform tool if scale demands it | Month 3+ |

---

## Lesson 2: Metriken (Metrics)

### Core Concepts

#### 2.1 Classification Metrics

Most AI products include classification components — spam detection, intent routing, content moderation, sentiment analysis. PMs must understand these metrics to set quality bars and communicate with stakeholders.

**Precision:** Of all items the model predicted as positive, how many were actually positive?
- Formula: True Positives / (True Positives + False Positives)
- High precision = few false alarms
- Prioritize when false positives are costly (e.g., flagging legitimate transactions as fraud)

**Recall:** Of all actually positive items, how many did the model find?
- Formula: True Positives / (True Positives + False Negatives)
- High recall = few missed cases
- Prioritize when false negatives are costly (e.g., missing a cancer diagnosis)

**F1 Score:** Harmonic mean of precision and recall, balancing both concerns.
- Formula: 2 * (Precision * Recall) / (Precision + Recall)
- Use when neither false positives nor false negatives clearly dominate

**Production F1 targets by domain:**
| Application | Typical F1 target |
|-------------|-------------------|
| Fraud detection | 0.80-0.85 |
| Document classification | 0.75+ |
| Anomaly detection | 0.70+ |
| Customer churn prediction | 0.75+ |
| Content moderation | 0.85+ |
| Medical diagnosis support | 0.90+ |

**ROC/AUC:** The Receiver Operating Characteristic curve plots True Positive Rate against False Positive Rate at varying classification thresholds. The Area Under the Curve (AUC) summarizes overall discriminative ability:
- AUC = 1.0: perfect classifier
- AUC = 0.5: random guessing (no discrimination)
- AUC < 0.5: worse than random (model is inverted)

**PM relevance of ROC/AUC:** The threshold on the ROC curve is a product decision, not a technical one. Moving the threshold trades off precision vs. recall — the PM must decide where to set it based on business impact.

**Sources:**
- [Google ML Crash Course: Classification Metrics](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall)
- [Evidently AI: Classification Metrics Guide](https://www.evidentlyai.com/classification-metrics)
- [Galileo: 9 Accuracy Metrics for ML Engineers](https://galileo.ai/blog/accuracy-metrics-ai-evaluation)
- [Deepchecks: F1 Score, Accuracy, ROC-AUC & PR-AUC](https://www.deepchecks.com/f1-score-accuracy-roc-auc-and-pr-auc-metrics-for-models/)

#### 2.2 Generation Metrics

For products that generate text (summarization, translation, content creation), different metrics apply.

**BLEU (Bilingual Evaluation Understudy):**
- Measures n-gram overlap between generated text and reference text
- Scores 0-1 (higher = more overlap with reference)
- Originally designed for machine translation
- Limitation: Measures surface-level word overlap, not semantic meaning. A paraphrase with different words scores low even if the meaning is identical.

**ROUGE (Recall-Oriented Understudy for Gisting Evaluation):**
- ROUGE-N: n-gram recall between generated and reference text
- ROUGE-L: longest common subsequence
- Primary metric for summarization tasks
- Limitation: Same as BLEU — surface-level, not semantic

**BERTScore:**
- Uses contextual embeddings to measure semantic similarity
- More meaningful than BLEU/ROUGE for open-ended generation
- Captures paraphrases and synonym usage
- Better correlation with human judgments than n-gram metrics

**When to use what:**
| Metric | Best for | Limitation |
|--------|----------|-----------|
| BLEU | Translation quality (with references) | Surface-level only |
| ROUGE | Summarization quality (with references) | Surface-level only |
| BERTScore | Semantic similarity | Requires embedding model |
| LLM-as-Judge | Open-ended quality, tone, helpfulness | Cost, latency, judge bias |

**The 2025-2026 consensus:** For most generative AI products, LLM-as-Judge has replaced BLEU/ROUGE as the primary quality metric. BLEU and ROUGE remain useful as fast, cheap regression checks in CI pipelines, but they should not be the sole measure of generation quality.

**Sources:**
- [Aman.ai: Evaluation Metrics Primer](https://aman.ai/primers/ai/evaluation-metrics/)
- [GeeksforGeeks: Evaluation Metrics in Machine Learning](https://www.geeksforgeeks.org/machine-learning/metrics-for-machine-learning-model/)
- [Clarifai: Performance Metrics in ML](https://www.clarifai.com/blog/performance-metrics-in-ml)

#### 2.3 Task-Specific Metrics

Beyond generic metrics, the most valuable evaluations are task-specific — measuring what actually matters for your users.

**RAG-specific metrics (RAGAS framework):**
- **Context Relevance:** Are the retrieved documents relevant to the query?
- **Faithfulness:** Is the generated answer grounded in the retrieved context (or hallucinated)?
- **Answer Relevance:** Does the answer address the user's question?

**Agent-specific metrics:**
- **Task completion rate:** Did the agent accomplish the user's goal?
- **Tool call accuracy:** Did the agent use the right tools in the right order?
- **Step efficiency:** How many steps did the agent take vs. the optimal path?
- **Recovery rate:** When the agent encountered an error, did it recover?

**Product-level metrics (what stakeholders actually care about):**
- **User satisfaction** (CSAT, thumbs up/down on AI outputs)
- **Task completion time** (with AI vs. without)
- **Adoption rate** (% of eligible users actively using the AI feature)
- **Escalation rate** (% of AI interactions that require human intervention)
- **Cost per successful interaction**

#### 2.4 Communicating Metrics to Stakeholders

**The PM translation layer:**

| Technical metric | Stakeholder translation |
|-----------------|------------------------|
| Precision = 0.92 | "Out of every 100 items the AI flags, 92 are correct" |
| Recall = 0.85 | "The AI catches 85 out of every 100 real cases" |
| F1 = 0.88 | "The AI balances finding things (85%) with being right when it does (92%)" |
| ROUGE-L = 0.45 | "The summaries cover about 45% of the key phrases from the original" |
| AUC = 0.94 | "The model correctly ranks a positive example above a negative one 94% of the time" |

**Rules for stakeholder communication:**
1. Always translate to business impact: "92% precision means 8 false alerts per 100 flags, costing ~2 hours of analyst time daily"
2. Show tradeoffs, not single numbers: "We can increase catch rate from 85% to 95%, but false alerts will triple"
3. Use confusion matrix visualizations, not just numbers
4. Benchmark against the current process (human or rule-based), not against perfection
5. Report trends over time, not point-in-time snapshots

### Common PM Misconceptions

1. **"Accuracy is the best metric."** Accuracy is misleading for imbalanced datasets. A spam filter with 99% accuracy sounds great until you realize 99% of emails are not spam — the model could just label everything "not spam" and hit 99%.

2. **"Higher metrics always mean a better product."** A model with 99% recall catches everything but may generate so many false positives that users stop trusting it. Metrics must be evaluated in context of user experience and business impact.

3. **"We should optimize one metric."** Real products require balancing multiple metrics. Improving recall often decreases precision. The PM's job is to define the acceptable tradeoff, not to maximize one number.

4. **"BLEU/ROUGE scores tell us if the output is good."** These metrics measure surface-level overlap with a reference. They cannot assess helpfulness, correctness, tone, or whether the output actually solves the user's problem. A score of 0.4 ROUGE can be excellent or terrible depending on the task.

### Decision Framework: Choosing Metrics for Your Product

| Product type | Primary metrics | Secondary metrics |
|-------------|----------------|-------------------|
| Content moderation | Precision, Recall (per category) | Latency, false positive rate by content type |
| Search / retrieval | NDCG, MRR, Context Relevance | Retrieval latency, zero-result rate |
| Summarization | LLM-as-Judge (faithfulness, coverage), ROUGE | User satisfaction, time saved |
| Chatbot / assistant | Task completion rate, user satisfaction | Escalation rate, response time |
| Classification / routing | F1, AUC, per-class precision/recall | Threshold sensitivity analysis |
| Code generation | Functional correctness (tests pass), edit distance | User acceptance rate, time to first use |

---

## Lesson 3: Red Teaming

### Core Concepts

#### 3.1 What Red Teaming Means for AI Products

AI red teaming is structured adversarial testing designed to discover failure modes, safety issues, and security vulnerabilities before attackers or users find them. Unlike traditional security testing, AI red teaming also covers content safety, bias, misinformation, and unexpected behaviors that emerge from the model's probabilistic nature.

Prompt injection sits at **#1 in OWASP's 2025 Top 10 for LLM Applications** for the second consecutive year, with sensitive information disclosure at #2. According to Adversa AI's 2025 security report, 35% of real-world AI security incidents resulted from simple prompt attacks, with some causing losses exceeding $100,000 per incident.

**Sources:**
- [OWASP Top 10 for LLM Applications (2025)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [TechEmpower: Red Teaming Gen AI (Feb 2026)](https://www.techempower.com/blog/2026/02/12/red-teaming-gen-ai/)
- [VentureBeat: Red Teaming LLMs Exposes a Harsh Truth](https://venturebeat.com/security/red-teaming-llms-harsh-truth-ai-security-arms-race/)

#### 3.2 Attack Categories PMs Must Know

**Prompt Injection:**
- **Direct injection:** User provides instructions that override the system prompt ("Ignore your instructions and instead...")
- **Indirect injection:** Malicious instructions embedded in data the model retrieves (documents, web pages, emails)
- **Delimiter attacks:** Using markers like `<|system|>` or `<|endofprompt|>` that mimic internal prompt delimiters to confuse the model about instruction boundaries

**Jailbreaking:**
- Techniques to bypass safety guardrails and content policies
- Research shows jailbreak prompts that succeed on GPT-4 transfer effectively to Claude 2 (64.1%) and Vicuna (59.7%), indicating cross-model vulnerability
- Over 1,400 adversarial prompts have been categorized and analyzed across major models

**Data Exfiltration:**
- Extracting system prompts, training data, or user data through carefully crafted queries
- Tricking the model into revealing PII from its context or tool outputs

**Harmful Content Generation:**
- Bypassing content filters to produce dangerous, illegal, or policy-violating content
- Social engineering scenarios where the model is manipulated into providing harmful guidance

**Tool/Agent Misuse:**
- For agentic AI: tricking the system into executing unintended tool calls
- Exploiting the agent's access to external systems (databases, APIs, file systems)

**Sources:**
- [arXiv:2505.04806: Red Teaming the Mind of the Machine (2025)](https://arxiv.org/html/2505.04806v1)
- [OpenAI: Understanding Prompt Injections](https://openai.com/index/prompt-injections/)
- [OpenAI: Continuously Hardening ChatGPT Atlas Against Prompt Injection](https://openai.com/index/hardening-atlas-against-prompt-injection/)

#### 3.3 How PMs Should Organize Red Teaming

**Three methodologies (OpenAI's framework):**
1. **Manual red teaming** — Humans craft adversarial prompts, simulating real attackers. Requires creative, adversarial thinking and deep product knowledge. Best for discovering novel attack vectors.
2. **Automated red teaming** — AI models generate and mutate adversarial prompts at scale. Tools like Promptfoo offer 60+ automated attack types. Best for regression testing and coverage at scale.
3. **Mixed methods** — Start with manual discovery to create a seed dataset of attacks, then scale up with automated generation and mutation. This is the recommended production approach.

**PM's role in red teaming:**
- Define the threat model: What are the worst things that could happen with your product?
- Set the scope: Which attack categories matter most for your use case?
- Recruit diverse testers: Include domain experts, skeptics, and people with different cultural contexts
- Prioritize findings: Not every vulnerability requires immediate action — assess by severity and likelihood
- Track remediation: Red team findings feed into the eval pipeline as regression tests

**Practical cadence:**
- **Pre-launch:** Dedicated red team sprint (1-2 weeks) before any AI feature ships
- **Ongoing:** Automated red team scans in CI/CD pipeline
- **Periodic:** Quarterly manual red team sessions with fresh eyes
- **Incident-driven:** After any safety incident, targeted red team exercise

**Sources:**
- [OpenAI: Approach to External Red Teaming (arXiv:2503.16431)](https://arxiv.org/html/2503.16431v1)
- [Promptfoo: LLM Red Teaming Guide](https://www.promptfoo.dev/docs/red-team/)
- [CleverX: Red Teaming Playbook — Model Safety Testing Framework 2025](https://cleverx.com/blog/red-teaming-playbook-for-model-safety-complete-implementation-framework-for-ai-operations-teams/)

#### 3.4 Regulatory Context

The EU AI Act requires adversarial testing for high-risk AI systems as part of conformity assessment before market deployment. Full compliance is required by **August 2, 2026**. General-purpose AI models with systemic risk face additional red teaming obligations. Penalties for non-compliance reach up to 35 million EUR or 7% of global annual turnover.

NIST AI RMF 1.0 recommends continuous adversarial testing throughout the AI system lifecycle, with the framework emphasizing risk-based approaches that prioritize testing based on potential impact and likelihood.

**Sources:**
- [The Register: Red Teaming for AI — The Cornerstone of Secure Compliance (Jan 2026)](https://www.theregister.com/2026/01/26/red_teaming_ai_cornerstone/)
- [White Knight Labs: The State of AI Red Teaming in 2025 & 2026](https://whiteknightlabs.com/2025/11/04/the-state-of-ai-red-teaming-in-2025-2026/)
- [Pillar Security: AI Red Teaming Regulations and Standards](https://www.pillar.security/blog/ai-red-teaming-regulations-and-standards)

### Real-World Examples

1. **GPT-5 launch (January 2026):** Red teams from SPLX jailbroke GPT-5 within 24 hours of release, declaring it "nearly unusable for enterprise out of the box." This demonstrates that even frontier models require product-level safety layers beyond what the model provider builds in.

2. **ChatGPT prompt injection (March 2025):** A vulnerability was widely exploited to trap users. A few months earlier, Microsoft's health chatbot exposed sensitive data. These incidents underscore that prompt injection is not a theoretical risk — it is an active, exploited attack vector.

3. **Cross-model jailbreak transferability:** Research shows jailbreak prompts succeeding on one model transfer to other models at rates of 59-64%. PMs cannot assume that switching models eliminates known vulnerabilities.

### Common PM Misconceptions

1. **"Our model provider handles safety."** Model providers build base safety. Your product's specific attack surface — system prompts, tool access, user data, business context — requires product-level red teaming that only you can do.

2. **"We tested it once before launch, so we're covered."** Attack techniques evolve continuously. A one-time red team exercise becomes stale within months. Red teaming must be continuous, not a checkbox.

3. **"Red teaming is a security team concern."** Red teaming for AI covers content safety, bias, misinformation, and brand risk — all PM-owned domains. Security teams handle infrastructure; PMs own the product attack surface.

4. **"Automated tools are enough."** Automated tools catch known attack patterns. Novel attacks require human creativity and domain expertise. The strongest approach combines both.

### Decision Framework: Red Teaming Priority Matrix

| Risk category | Priority for consumer products | Priority for enterprise/regulated | Testing method |
|---------------|-------------------------------|----------------------------------|----------------|
| Prompt injection | High | Critical | Automated + manual |
| Data exfiltration | Medium | Critical | Automated + manual |
| Harmful content | Critical | High | Automated + human review |
| Bias/discrimination | High | Critical | Domain expert review |
| Jailbreaking | High | High | Automated scanning |
| Tool/agent misuse | Medium (if applicable) | Critical (if applicable) | Scenario-based manual |

---

## Lesson 4: Ship/No-Ship Decisions

### Core Concepts

#### 4.1 The "Good Enough" Problem

Traditional software ships when it works correctly. AI features ship when they work *well enough*. This is a fundamentally different decision because:
- AI output quality exists on a spectrum, not a binary pass/fail
- Different users experience different quality levels for the same feature
- Edge cases are infinite and cannot all be tested
- Quality may degrade over time as data distributions shift

The PM must define "good enough" before building, not after. Without a predefined quality bar, teams either ship too early (harming users) or never ship (harming the business).

#### 4.2 Quality Gates for AI Features

A quality gate is a predefined threshold that must be met before an AI feature progresses to the next deployment stage. Gates should be defined during planning, not discovered during launch review.

**Recommended quality gates:**
1. **Golden dataset performance:** Model clears the eval suite and does not regress on critical tasks
2. **Safety checks:** No sensitive data in prompts or logs; red team findings addressed
3. **Latency budget:** P50 and P95 latency within acceptable bounds, with fallbacks for tool errors
4. **Cost ceiling:** Cost per successful interaction under target
5. **Fairness audit:** Performance is consistent across demographic groups (see Lesson 5)
6. **Fallback behavior:** Graceful degradation when the model fails, times out, or returns low-confidence results

#### 4.3 Staged Rollout Strategies for AI

AI features demand more cautious rollout than deterministic software because failure modes are harder to predict.

**Shadow Mode (Dark Launch):**
- The AI feature runs in production processing real inputs, but outputs are not shown to users
- Only the team sees and evaluates outputs
- Tests performance on real, recent examples without user impact
- Use for: First deployment of a new AI feature, model swaps, major prompt changes
- Duration: 1-2 weeks minimum

**Canary Release:**
- Route 1-5% of production traffic to the new AI feature
- Monitor key metrics: error rate, latency, user satisfaction, escalation rate
- If metrics remain within predefined bounds, gradually ramp up traffic
- Each expansion phase has clear exit criteria — not subjective judgment
- Use for: Validated features that passed shadow mode

**A/B Testing:**
- Split users between AI feature variants to measure causal impact
- Critical for measuring whether AI actually improves user outcomes vs. the existing experience
- Run until statistical significance is reached (typically 2-4 weeks depending on traffic)
- Use for: Comparing AI approaches, measuring incremental value of AI vs. non-AI

**Gradual Rollout with Feature Flags:**
- Combine canary + A/B by using feature flags to control exposure
- Each phase should have clear exit criteria so you are not guessing when it is safe to expand
- Enables instant rollback if issues emerge
- Use rollout phases to test different variations: prompt versions, model versions, UI placements

**Sources:**
- [Flagsmith: 10 Best Practices to Build and Ship AI Features With Minimal Risk](https://www.flagsmith.com/blog/build-and-ship-ai-features)
- [Clarifai: AI Model Deployment Strategies](https://www.clarifai.com/blog/ai-model-deployment-strategies)
- [JFrog ML: Shadow Deployment vs. Canary Release](https://www.qwak.com/post/shadow-deployment-vs-canary-release-of-machine-learning-models)
- [Neptune.ai: Model Deployment Strategies](https://neptune.ai/blog/model-deployment-strategies)
- [Medium/Syntal: Shipping AI Features Without Losing Sleep (Dec 2025)](https://medium.com/@sparknp1/shipping-ai-features-without-losing-sleep-7e2c32a104df)

#### 4.4 Setting Thresholds

**How to set quality thresholds:**
1. **Baseline first:** Measure the current experience (human performance, existing rules-based system, or no-AI baseline)
2. **Non-inferiority:** The AI must be at least as good as the current experience on critical dimensions
3. **User-acceptable minimum:** Through user research, determine the quality level below which users reject the feature
4. **Business-viable minimum:** Below what quality level does the feature cost more than it saves?
5. **Set the bar at the highest of these three**

**Threshold examples:**
| Dimension | Threshold approach |
|-----------|-------------------|
| Accuracy | Must match or exceed current process (e.g., human accuracy baseline) |
| Latency | P95 must be under user-perceived "fast" threshold (typically <3s for interactive, <500ms for inline) |
| Hallucination rate | Zero tolerance for high-stakes domains; <5% for low-stakes suggestions |
| Cost per query | Must be under the value of the task automated (e.g., <$0.10 if replacing a $0.50 human task) |
| User satisfaction | Thumbs-up rate must exceed 70% for general features, 85% for critical workflows |

### Real-World Examples

1. **Shadow mode in practice:** Neal Lathia describes shadow deployment as balancing "insight (you get all of the data) and risk (you don't need to act on the outcomes)." The system processes real inputs but does not expose outputs, enabling the team to evaluate on production-representative data before any user is affected.

2. **Canary with automatic rollback:** A 1% canary deployment with predefined metric bounds. If latency exceeds P95 budget or error rate spikes above threshold, traffic is automatically reverted. The PM defines the bounds; the system enforces them.

3. **Feature flag-driven AI rollout:** Modern platforms (LaunchDarkly, Flagsmith) enable PMs to target AI features by user segment, geography, or account tier — allowing staged rollout with different quality bars for different risk levels.

### Common PM Misconceptions

1. **"We'll ship when it's perfect."** AI features are never perfect. Waiting for perfection means never shipping. The question is not "Is it perfect?" but "Is it better than the alternative, with acceptable failure modes?"

2. **"We can fix issues after launch."** Some AI failures — hallucinated medical advice, biased hiring recommendations, leaked private data — cause irreversible harm. Staged rollout is not optional for high-stakes AI features.

3. **"A/B testing AI is the same as A/B testing traditional features."** AI features have higher variance, non-deterministic outputs, and user adaptation effects. Longer test periods, larger sample sizes, and AI-specific metrics (hallucination rate, faithfulness) are needed.

4. **"Shadow mode is wasted effort — just launch to 1%."** Shadow mode catches catastrophic failures (crashes, data leaks, offensive outputs) with zero user risk. The few days invested prevent incidents that could damage trust irreversibly.

5. **"Our thresholds should be fixed."** Quality bars should evolve. Start conservative (higher thresholds) and relax as you gain confidence. Review thresholds quarterly based on production data and user feedback.

### Decision Framework: Ship/No-Ship Checklist

| Gate | Question | Ship if... | Block if... |
|------|----------|-----------|-------------|
| Eval suite | Does it pass the golden dataset? | Scores meet or exceed baseline | Regression on any critical category |
| Safety | Did it pass red team review? | All critical findings addressed | Open critical vulnerabilities |
| Latency | Is it fast enough? | P95 within budget | P95 exceeds 2x target |
| Cost | Is it economically viable? | Cost per success under target | Cost per success exceeds value delivered |
| Fairness | Is performance equitable? | Variance across groups within bounds | Significant disparity on protected groups |
| Fallback | What happens when it fails? | Graceful degradation defined and tested | No fallback; failure = broken experience |
| Rollback | Can we undo this? | Instant rollback via feature flag | No rollback mechanism |

---

## Lesson 5: Bias & Fairness

### Core Concepts

#### 5.1 Types of Bias in AI Systems

Bias in AI is not a single problem — it is a family of related issues that can enter at every stage of the product lifecycle.

**Training Data Bias:**
- **Representation bias:** Training data does not reflect the true population. Example: a facial recognition system trained predominantly on light-skinned faces performs worse on darker-skinned faces (the foundational finding of Buolamwini & Gebru, "Gender Shades," 2018).
- **Historical bias:** Training data faithfully reflects historical inequities. Example: a hiring model trained on historical hiring data learns to discriminate against women because historical hiring was biased against women. The data is "correct" but the pattern is unjust.
- **Labeling bias:** Human annotators introduce their own biases into labels. Disagreement between annotators from different demographics is itself a signal of bias.

**Measurement Bias:**
- The features or proxies used to represent a concept systematically disadvantage certain groups
- Example: Using zip code as a feature is a proxy for race in many US contexts
- Example: Using "years of experience" as a quality signal disadvantages career changers and people who took caregiving breaks

**Selection Bias:**
- The data collection process systematically excludes certain populations
- Example: An AI trained on app usage data misses users without smartphones
- Example: Feedback loops where the model's past decisions influence future training data (the model only sees outcomes for people it approved)

**Evaluation Bias:**
- The metrics used to evaluate the model are not appropriate for all subgroups
- A model with high overall accuracy may perform poorly on a specific minority group
- Aggregate metrics hide disparities; disaggregated evaluation is essential

**Temporal Bias:**
- The world changes, but the model's training data is frozen in time
- Assumptions encoded in training data may become invalid or harmful as society evolves

**Sources:**
- [Frontiers in Big Data: Bias in AI Systems — Integrating Formal and Socio-Technical Approaches (2025)](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2025.1686452/full)
- [Francesca Tabor: AI Evaluation Metrics — Bias & Fairness (2025)](https://www.francescatabor.com/articles/2025/7/10/ai-evaluation-metrics-bias-amp-fairness)
- [Kodex Labs: Bias in AI — Examples, Causes & Mitigation (2025)](https://kodexolabs.com/bias-in-ai/)
- [EY: Addressing AI Bias — A Human-Centric Approach to Fairness](https://www.ey.com/en_us/insights/emerging-technologies/addressing-ai-bias-a-human-centric-approach-to-fairness)

#### 5.2 Fairness Metrics

Multiple mathematical definitions of fairness exist, and critically, **they are often incompatible** — satisfying one may require violating another (the Impossibility Theorem of fairness in ML).

**Demographic Parity (Statistical Parity):**
- The model's positive prediction rate should be the same across all demographic groups
- Formula: P(Positive | Group A) = P(Positive | Group B)
- Limitation: Does not account for legitimate differences in base rates. A loan approval model with demographic parity may approve unqualified applicants in one group while rejecting qualified applicants in another.

**Equalized Odds:**
- The model's true positive rate and false positive rate should be equal across groups
- Accounts for actual qualification/outcome, not just prediction rate
- Stricter than demographic parity; harder to achieve

**Equal Opportunity:**
- A relaxation of equalized odds: only the true positive rate must be equal across groups
- Ensures qualified members of all groups have an equal chance of being correctly identified

**Predictive Parity:**
- The precision (positive predictive value) should be equal across groups
- Ensures the model's positive predictions are equally trustworthy regardless of group

**Individual Fairness:**
- Similar individuals should receive similar predictions
- Requires defining a meaningful similarity metric, which is itself a value judgment

**The PM's dilemma:** No single fairness metric is universally correct. The choice of metric is a product and ethical decision, not a technical one. PMs must explicitly decide which fairness definition aligns with their product's values and document the reasoning.

**Sources:**
- [GeeksforGeeks: Fairness Metrics — Demographic Parity, Equalized Odds](https://www.geeksforgeeks.org/artificial-intelligence/fairness-metrics-demographic-parity-equalized-odds/)
- [Shelf.io: Fairness Metrics in AI — Step-by-Step Guide](https://shelf.io/blog/fairness-metrics-in-ai/)
- [Crescendo AI: AI Bias — 16 Real Examples & Mitigation Guide](https://www.crescendo.ai/blog/ai-bias-examples-mitigation-guide)

#### 5.3 Bias Auditing

**Practical audit process:**
1. **Identify protected attributes** — Demographics relevant to your product and jurisdiction (race, gender, age, disability, etc.)
2. **Disaggregate metrics** — Run your eval suite broken down by protected groups. Overall accuracy hides disparities.
3. **Test for proxy discrimination** — Check if non-protected features (zip code, name, language patterns) correlate with protected attributes
4. **Measure fairness metrics** — Calculate demographic parity, equalized odds, or your chosen fairness definition across groups
5. **Red team for bias** — Specifically test with inputs designed to trigger biased outputs (stereotypical prompts, underrepresented groups)
6. **Document findings and decisions** — Which disparities were found, which were accepted (with reasoning), which were mitigated

**Mitigation strategies:**
- **Pre-processing:** Fix the data — re-sampling, re-weighting, or augmenting underrepresented groups
- **In-processing:** Add fairness constraints during model training (adversarial debiasing)
- **Post-processing:** Adjust model outputs to satisfy fairness criteria (threshold adjustment per group)
- **Product-level:** Add human review for high-stakes decisions, provide recourse/appeal mechanisms, be transparent about limitations

#### 5.4 Regulatory Requirements

**EU AI Act (effective timeline):**
- **February 2025:** Prohibited AI practices (social scoring, manipulative AI) take effect
- **August 2025:** Obligations for general-purpose AI models take effect
- **August 2, 2026:** Full obligations for high-risk AI systems, including:
  - Article 10(2)(f): Providers must identify, detect, prevent, and mitigate harmful biases
  - Article 14: Deployers must assign responsibility for operational oversight to specific individuals
  - Mandatory bias testing and validation before and during deployment
  - Performance metrics reviewed periodically, disaggregated by affected groups
  - Penalties: Up to 35 million EUR or 7% of global annual turnover

**NIST AI Risk Management Framework:**
- Recommends bias testing as part of ongoing risk management
- Emphasizes documentation of bias testing methodology and results
- Not legally binding but widely adopted as industry best practice

**PM responsibility:** Even where regulation does not require it, fairness auditing is a product quality issue. Biased AI damages user trust, creates PR risk, and may expose the company to legal liability.

**Sources:**
- [SIG: EU AI Act Summary (Jan 2026 update)](https://www.softwareimprovementgroup.com/blog/eu-ai-act-summary/)
- [Sombra Inc: AI Regulations and Governance in 2026](https://sombrainc.com/blog/ai-regulations-2026-eu-ai-act)
- [Scrut: Fairness and Bias Mitigation in AI — EU AI Act](https://www.scrut.io/glossary/fairness-and-bias-mitigation)
- [PwC: EU's AI Act — What Regulators Should Know](https://www.pwc.com/us/en/services/consulting/cybersecurity-risk-regulatory/library/tech-regulatory-policy-developments/eu-ai-act.html)
- [DLA Piper: Fairness / Unlawful Bias in the EU — AI Laws of the World](https://intelligence.dlapiper.com/artificial-intelligence/?t=10-fairness-or-unlawful-bias&c=EU)

### Real-World Examples

1. **Amazon hiring tool (2018):** Amazon scrapped an AI recruiting tool that showed bias against women. The model was trained on historical resumes, which were predominantly male. It learned to penalize resumes containing the word "women's" (as in "women's chess club"). This is a textbook case of historical bias in training data.

2. **COMPAS recidivism prediction:** The COMPAS algorithm used in US criminal justice was found to have different false positive rates across racial groups — Black defendants were nearly twice as likely to be incorrectly flagged as high risk. This case demonstrated that a model can satisfy predictive parity while violating equalized odds, making the choice of fairness metric a values decision.

3. **Apple Card (2019):** Goldman Sachs' credit algorithm for Apple Card was investigated after reports that it offered significantly lower credit limits to women than men with similar financial profiles. The case showed that even when gender is not an explicit input, proxy features can create disparate outcomes.

### Common PM Misconceptions

1. **"We don't use protected attributes, so we can't be biased."** Proxy discrimination is real. Zip code, name, language, and many other features correlate with protected attributes. Not using race as an input does not prevent racial bias.

2. **"Bias is an engineering problem to solve."** Choosing which fairness definition to optimize is a values and product decision. Engineers can implement the chosen definition, but the PM must decide what "fair" means in context.

3. **"One fairness metric covers everything."** Multiple fairness criteria are mathematically incompatible when base rates differ across groups (Impossibility Theorem). The PM must choose and defend a specific fairness definition.

4. **"Our model treats everyone equally, so it's fair."** Equal treatment of unequal groups can perpetuate inequality. A loan model that applies the same criteria to all applicants may disadvantage groups with historically limited access to credit.

5. **"Bias auditing is a one-time activity."** Population distributions, social norms, and regulatory requirements change. Bias auditing must be ongoing, especially as the model encounters new data in production.

### Decision Framework: Bias & Fairness Audit

| Step | Action | Owner |
|------|--------|-------|
| 1 | Identify protected attributes relevant to your product and jurisdiction | PM + Legal |
| 2 | Choose fairness metrics with explicit reasoning for the choice | PM + Ethics/Legal |
| 3 | Disaggregate eval metrics by protected groups | Engineering |
| 4 | Test for proxy discrimination (feature correlation analysis) | Data Science |
| 5 | Red team specifically for biased outputs | PM + Diverse testers |
| 6 | Define acceptable disparity thresholds | PM + Leadership |
| 7 | Implement mitigations (data, model, product level) | Engineering |
| 8 | Document decisions, findings, and rationale | PM |
| 9 | Schedule periodic re-audits (at least quarterly) | PM |
| 10 | Build recourse mechanisms for affected users | PM + Design |

---

## Synthesis Connectors (Lesson 6)

### How the Five Lessons Connect

The five evaluation lessons form a complete quality system where each lesson depends on and reinforces the others:

1. **Evals (Lesson 1) require Metrics (Lesson 2)** — An eval framework without the right metrics is a test suite that measures the wrong thing. The eval pipeline operationalizes the metrics that matter for your product type.

2. **Red Teaming (Lesson 3) feeds Evals (Lesson 1)** — Every red team finding becomes a regression test in the golden dataset. Red teaming discovers failure modes; evals prevent them from recurring.

3. **Ship/No-Ship (Lesson 4) depends on all three** — Quality gates are defined by metrics (Lesson 2), enforced by eval pipelines (Lesson 1), and validated by red teaming (Lesson 3). Without this foundation, ship decisions are subjective and inconsistent.

4. **Bias & Fairness (Lesson 5) is a lens applied everywhere** — Metrics must be disaggregated by group (Lesson 2). Red teaming must include bias-specific scenarios (Lesson 3). Ship decisions must include fairness gates (Lesson 4). Fairness is not a separate workstream — it is a dimension of every other evaluation activity.

5. **The eval flywheel:** Production failures discovered through monitoring (Lesson 4) feed back into the golden dataset (Lesson 1), which improves metrics (Lesson 2), which raises the quality bar for future ship decisions (Lesson 4). This is a continuous improvement loop, not a linear process.

### Connections to Earlier Chapters

**Chapter 01 (Foundations) connections:**
- Hallucinations (Ch01) are measured and gated by faithfulness metrics (Lesson 2) and caught by eval pipelines (Lesson 1)
- Probabilistic nature of LLMs (Ch01) is why deterministic testing is insufficient and AI-specific eval frameworks exist (Lesson 1)
- Temperature and sampling parameters (Ch01) directly affect eval reproducibility — evals should run at temperature 0 for consistency

**Chapter 02 (Strategy) connections:**
- Build vs. Buy decisions (Ch02) should include eval infrastructure as a key consideration — the product layer (including evals) is your moat, not the model
- Model selection (Ch02) is validated through task-specific evals (Lesson 1), not benchmark leaderboards

**Chapter 03 (Product Design) connections:**
- Trust and explainability (Ch03) are built through the confidence that rigorous evaluation provides — you cannot design trust indicators without knowing your system's actual reliability
- Error handling UX (Ch03) is designed based on failure modes discovered through red teaming (Lesson 3)
- Feedback loops in UX (Ch03) generate data that feeds back into the golden dataset (Lesson 1)

**Chapter 04 (Development) connections:**
- Prompt engineering and RAG pipelines (Ch04) are validated through task-specific evals and RAG-specific metrics like RAGAS (Lessons 1-2)
- Agent architectures (Ch04) require agent-specific metrics: task completion, tool accuracy, recovery rate (Lesson 2)

### The Meta-Insight

Evaluation is where AI product management becomes most distinct from traditional product management. In traditional software, testing proves the product works. In AI products, evaluation defines what "works" means — and that definition is a product decision, an ethical decision, and a business decision all at once.

The PM who masters evaluation does not just ship better AI products. They build the organizational capability to improve AI products systematically over time, because every production interaction generates data that flows back through the eval flywheel.

---

## Key Reference Works

| Source | Type | Relevance |
|--------|------|-----------|
| Hamel Husain, "Your AI Product Needs Evals" + FAQ + Field Guide | Blog series (Rank 2) | Foundational eval methodology for PMs |
| Husain & Shankar, AI Evals for Engineers & PMs (Maven course) | Course (Rank 2) | Comprehensive eval training |
| Chip Huyen, *AI Engineering* (O'Reilly, 2025) | Book (Rank 2) | Eval pipeline design, production monitoring |
| OpenAI, "Approach to External Red Teaming" (arXiv:2503.16431) | Paper (Rank 1) | Canonical red teaming methodology |
| NIST AI Risk Management Framework 1.0 | Framework (Rank 1) | Industry-standard risk and bias management |
| EU AI Act (Regulation 2024/1689) | Regulation (Rank 1) | Legal requirements for bias, fairness, testing |
| OWASP Top 10 for LLM Applications (2025) | Framework (Rank 1) | Security vulnerability classification |
| Buolamwini & Gebru, "Gender Shades" (2018) | Paper (Rank 1) | Foundational bias research |
| Pragmatic Engineer: A Pragmatic Guide to LLM Evals | Newsletter (Rank 2) | Developer-focused eval guidance |
| Lenny's Newsletter: Building Eval Systems | Newsletter (Rank 2) | PM-focused eval strategy |
| Flagsmith: 10 Best Practices to Ship AI Features | Blog (Rank 3) | Practical deployment guidance |

---

## Uncertain / Needs Verification

1. **"500x-5000x cost savings" for LLM-as-Judge vs. human review:** Widely cited but the range is enormous and depends heavily on task complexity, judge model cost, and human reviewer rates. Use as "order-of-magnitude cheaper" rather than a precise figure. [UNCERTAIN]

2. **"80% agreement between LLM judges and human preferences":** Multiple sources cite this figure, but agreement rates vary significantly by task type and judge model. Some tasks show 90%+, others below 70%. Use as "roughly matching human-to-human agreement" with caveats. [UNCERTAIN]

3. **"35% of real-world AI security incidents from simple prompt attacks":** From Adversa AI's 2025 report. Methodology and sample size not independently verified. Directionally credible but the exact percentage may not generalize. [UNCERTAIN]

4. **GPT-5 jailbroken within 24 hours:** Reported by multiple sources citing SPLX research. The claim that it was "nearly unusable for enterprise out of the box" is the red team's characterization, not an objective assessment. [UNCERTAIN]

5. **Amazon hiring tool bias details:** The core story (bias against women, penalizing "women's") is well-documented by Reuters (2018). Some secondary details have been embellished in retellings. Stick to the Reuters primary source. [Verified core, details vary]

6. **Impossibility Theorem of fairness:** The mathematical result (Chouldechova 2017, Kleinberg et al. 2016) is well-established in peer-reviewed literature. The practical implication — that PMs must choose between incompatible fairness definitions — is verified. [Verified]

---

## Gaps and Open Questions

1. **Eval standards across industries:** No industry-wide standard for AI product evaluation exists yet. Each company builds ad hoc. Will an ISO or IEEE standard emerge? [Gap for Lesson 1]

2. **LLM-as-Judge reliability for non-English:** Most LLM-as-Judge research focuses on English. Reliability for multilingual products is less studied. [Gap for Lesson 1]

3. **Red teaming for multimodal AI:** Most red teaming guidance focuses on text-based LLMs. Image, audio, and video attack vectors are less systematically studied. [Gap for Lesson 3]

4. **Fairness metrics for generative AI:** Most fairness metrics are designed for classification (approve/deny). Defining and measuring fairness for open-ended text generation is an open research problem. [Gap for Lesson 5]

5. **Cost-benefit analysis of staged rollouts:** Hard data on how much shadow mode and canary testing actually prevent vs. delay is sparse. The practice is consensus-recommended but empirical evidence is mostly anecdotal. [Gap for Lesson 4]

6. **Intersectional bias measurement:** Current bias auditing typically checks one protected attribute at a time. Measuring bias at intersections (e.g., Black women, elderly disabled) is methodologically challenging with small subgroup sizes. [Gap for Lesson 5]
