# Research: Chapter 04 — Technical Literacy (Technical Foundations for AI Product Managers)

> Status: Research complete, 2026-03-10
> Purpose: Factual basis for 5 lessons + 1 synthesis
> Quality: Sources ranked per quality plan. Uncertain items marked with [UNCERTAIN].
> Source hierarchy: Peer-reviewed/official docs > Established frameworks > Practitioner content

---

## Lesson 1: Prompt Engineering

### Core Concepts

#### 1.1 Prompting Techniques Hierarchy

Prompt engineering is the practice of designing inputs to LLMs to elicit desired outputs. For PMs, it is the lowest-cost, fastest-iteration lever for improving AI product quality.

**Zero-Shot Prompting:**
The model receives only the task instruction, no examples. It relies entirely on pre-trained knowledge.
- Best for: well-understood tasks (summarization, translation, classification with common categories)
- Start here. Only escalate to few-shot when zero-shot fails on specific failure modes
- Cost: minimal tokens, fastest iteration

**One-Shot / Few-Shot Prompting:**
Provide 1–5 examples of desired input-output pairs in the prompt. The model learns the pattern in-context.
- Research shows strong accuracy gains from 1–2 examples, with diminishing returns beyond 4–5 examples
- Few-shot remains one of the highest-ROI techniques available
- Cost: each example adds tokens (and cost), so use the minimum number that fixes the observed failure mode
- PM trap: adding 10+ examples "just to be safe" wastes tokens and can confuse the model

**Chain-of-Thought (CoT) Prompting:**
Instruct the model to reason step by step before answering. Adding "Let's think step by step" or showing reasoning traces in examples.
- Research shows a 19-point boost on MMLU-Pro benchmark for hard reasoning tasks
- Critical caveat for 2025-2026: Skip explicit CoT for reasoning models (OpenAI o-series, Claude Extended Thinking, Gemini Thinking Mode) — they already do it internally. Adding "think step by step" to a reasoning model is redundant and can degrade performance
- Best for: math, logic, multi-step analysis, complex decision-making

**System Prompts:**
A special instruction block that sets the model's role, constraints, and behavior. Persists across the conversation.
- Use for: persona definition, output format constraints, safety guardrails, domain context
- PM decision: system prompts are where product behavior is encoded — they are a product specification, not an engineering detail
- System prompts are typically cached (Anthropic charges 0.1x base rate for cached reads), making them cost-efficient for repeated use

**Structured Output:**
Instruct the model to return JSON, XML, YAML, or other machine-parseable formats.
- OpenAI, Anthropic, and Google all support structured output / JSON mode natively
- Essential for: any AI feature where output feeds into downstream systems (APIs, databases, UI rendering)
- PM implication: structured output makes AI features reliable enough for production pipelines, not just chat

#### 1.2 Advanced Techniques PMs Should Know

**Self-Consistency:** Run the same prompt multiple times, take the majority answer. Increases accuracy at the cost of latency and tokens (typically 3–5x cost).

**Meta-Prompting / Prompt Chaining:** Break complex tasks into sequential prompts where output of one becomes input to the next. Reduces error rate on complex tasks but increases latency.

**Role Prompting:** Assigning a persona ("You are a senior financial analyst...") to activate domain-specific knowledge patterns. Simple to implement, measurable quality improvement for domain tasks.

**Blended Prompting (2025-2026 best practice):** Combining multiple techniques — few-shot examples + role instruction + format constraints + chain-of-thought — into a single cohesive prompt. Most production prompts use blended approaches.

#### 1.3 Cost Implications of Prompting Strategies

| Technique | Token overhead | Latency impact | When to use |
|-----------|---------------|----------------|-------------|
| Zero-shot | Minimal | Lowest | Default starting point |
| Few-shot (3 examples) | +200–500 tokens | Low | When zero-shot has specific failures |
| Chain-of-thought | +100–2000 tokens output | Medium | Complex reasoning tasks |
| System prompt (cached) | First call: full cost; subsequent: 0.1x | None after first | Always for product features |
| Self-consistency (5 runs) | 5x total cost | 5x latency | High-stakes decisions only |

### Real-World Examples

| Product | Technique | Implementation |
|---------|-----------|----------------|
| **Notion AI** | System prompt + structured output | Slash commands trigger specific system prompts tailored to task type (summarize, translate, brainstorm); output rendered as structured Notion blocks |
| **GitHub Copilot** | Few-shot (implicit) | Uses surrounding code as in-context examples; the file itself serves as few-shot demonstrations |
| **Perplexity** | Chain-of-thought + RAG | Decomposes complex queries into sub-questions, reasons through retrieved sources step by step |
| **Stripe Docs AI** | System prompt + structured output | Constrains responses to Stripe documentation domain; returns structured answers with code examples |
| **Cursor** | Blended prompting | Combines codebase context (few-shot), task instructions (system prompt), and iterative refinement (prompt chaining) |

### Common PM Misconceptions

1. **"Longer prompts = better results."** False. Overly verbose prompts dilute the signal. Concise, specific instructions outperform lengthy ones. Each unnecessary token costs money and can confuse the model.

2. **"Prompt engineering is an engineering task."** Partially false. The prompt IS the product specification for AI features. PMs should own prompt design (what behavior, what constraints, what tone) while engineers handle integration and infrastructure.

3. **"One perfect prompt works forever."** False. Model updates change behavior. Prompts need versioning, testing, and monitoring like any product feature. A prompt that works on GPT-4 may fail on GPT-5.

4. **"Chain-of-thought always helps."** False. For simple tasks (classification, extraction), CoT adds cost without improving accuracy. For reasoning models, explicit CoT is redundant and wasteful.

5. **"Few-shot examples should cover every edge case."** False. 2–4 well-chosen examples beat 15 mediocre ones. Diminishing returns are steep, and excessive examples waste context window space.

### Decision Framework: Prompt Strategy Selection

**The Complexity-Stakes Matrix:**

| | Simple task (classification, extraction) | Complex task (reasoning, generation) |
|---|---|---|
| **Low stakes** | Zero-shot, temp 0–0.2 | CoT, temp 0.3–0.7 |
| **High stakes** | Few-shot + validation layer | CoT + self-consistency + human review |

**Escalation path:** Zero-shot → Few-shot → CoT → Prompt chaining → Self-consistency. Stop at the first level that meets quality requirements.

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [DAIR.AI Prompt Engineering Guide](https://www.promptingguide.ai/) | Comprehensive techniques reference (zero-shot, few-shot, CoT) |
| 2 | [Lakera: The Ultimate Guide to Prompt Engineering (2026)](https://www.lakera.ai/blog/prompt-engineering-guide) | Best practices, security considerations |
| 2 | [Codecademy: Prompt Engineering 101](https://www.codecademy.com/article/prompt-engineering-101-understanding-zero-shot-one-shot-and-few-shot) | Zero-shot, one-shot, few-shot explained |
| 2 | [K2View: Prompt Engineering Techniques (2026)](https://www.k2view.com/blog/prompt-engineering-techniques/) | Top 6 techniques overview |
| 3 | [CodeSignal: Prompt Engineering Best Practices 2025](https://codesignal.com/blog/prompt-engineering-best-practices-2025/) | Practical best practices |
| 3 | [God of Prompt: Advanced Techniques](https://www.godofprompt.ai/blog/advanced-prompt-engineering-techniques-with-examples) | Advanced examples |

---

## Lesson 2: RAG (Retrieval-Augmented Generation)

### Core Concepts

#### 2.1 The RAG Pipeline: Embed → Store → Retrieve → Generate

RAG grounds LLM responses in external, up-to-date data rather than relying solely on the model's training data. It is the primary pattern for building AI features that need access to proprietary or current information.

**Step 1 — Embed (Indexing Phase):**
- Documents are split into chunks (paragraphs, sections, or semantic units)
- Each chunk is converted into a vector embedding (a high-dimensional numerical representation of meaning)
- Embeddings capture semantic similarity: "car" and "automobile" have nearby vectors
- Common embedding models: OpenAI text-embedding-3-large, Cohere embed-v4, open-source alternatives (BGE, E5)

**Step 2 — Store:**
- Embeddings are stored in a vector database alongside the original text
- Major vector databases (2026): Pinecone, Weaviate, Qdrant, Milvus, Chroma, pgvector (PostgreSQL extension)
- PM consideration: vector databases add infrastructure cost and complexity — pgvector is the simplest starting point for teams already using PostgreSQL

**Step 3 — Retrieve:**
- User query is embedded using the same model
- Vector similarity search finds the most relevant chunks (typically top 3–10)
- Hybrid search (2026 default): combines vector similarity with keyword/BM25 search for better recall
- Reranking: a cross-encoder model re-scores the initial 20–50 candidates for higher precision, returning top 3–5

**Step 4 — Generate:**
- Retrieved chunks are injected into the LLM prompt as context
- The model generates a response grounded in the retrieved information
- Source attribution: well-designed RAG systems cite which chunks informed the answer

#### 2.2 Chunking Strategies

Chunking quality is the single biggest determinant of RAG quality. Bad chunks = bad retrieval = bad answers.

| Strategy | How it works | Best for | Complexity |
|----------|-------------|----------|------------|
| **Fixed-size** | Split every N tokens (e.g., 512) with overlap | Simple documents, getting started | Low |
| **Recursive** | Split by paragraphs, then sentences, then tokens | General-purpose default | Low |
| **Semantic** | Split at topic/meaning boundaries using embeddings | Long documents with topic shifts | Medium |
| **Heading-aware** | Split by document structure (H1, H2, sections) | Structured docs, manuals, legal | Medium |
| **Contextual** | LLM-generated context prepended to each chunk | Highest retrieval quality | High |

**Best practice (2026 consensus):** Start with recursive chunking at 512 tokens and 10–20% overlap. Measure retrieval quality. Only move to semantic or contextual chunking after establishing a baseline.

#### 2.3 Advanced RAG Patterns (2025-2026)

**Hybrid Search:** Combines semantic vector search with keyword-based BM25 search. Now the default configuration in Pinecone, Qdrant, Weaviate, and Milvus. Catches cases where semantic search misses exact terms (product names, error codes, IDs).

**GraphRAG:** Builds a knowledge graph from the corpus (entities, relationships, community summaries), then queries the graph structure rather than individual chunks. Better for questions that span multiple documents or require understanding relationships.

**Agentic RAG:** The retrieval step is performed by an AI agent that can decide what to search, reformulate queries, and combine results from multiple sources. More flexible but harder to control.

**Long RAG:** Processes longer retrieval units (full sections or documents) rather than small chunks. Reduces information fragmentation at the cost of more tokens per retrieval.

#### 2.4 When RAG vs. Other Approaches

| Approach | Best when | Not suitable when |
|----------|-----------|-------------------|
| **RAG** | Need current/proprietary data; data changes frequently; need source attribution | Data is small enough to fit in context window; need behavioral changes |
| **Fine-tuning** | Need to change model behavior/style/format; consistent specialized performance | Data changes frequently; need source citation |
| **Long context** | Data fits in window; one-off analysis; prototyping | Data exceeds window; cost-sensitive at scale; need to process many queries |
| **Prompt engineering** | Simple tasks; stable requirements; small context | Large knowledge bases; frequently changing data |

#### 2.5 RAG Quality Factors PMs Must Track

1. **Retrieval precision:** Are the retrieved chunks actually relevant? (Measured by hit rate, MRR)
2. **Retrieval recall:** Are all relevant chunks being found? (Measured by recall@k)
3. **Answer faithfulness:** Does the generated answer stick to retrieved content, or hallucinate beyond it?
4. **Answer relevance:** Does the answer actually address the user's question?
5. **Chunk quality:** Are chunks coherent and self-contained, or do they cut off mid-thought?

#### 2.6 Cost Structure

| Component | Typical cost | Notes |
|-----------|-------------|-------|
| Embedding (indexing) | $0.01–0.10 per 1M tokens | One-time per document, re-run on updates |
| Vector database | $70–500/month (managed) | Scales with data volume; pgvector is free |
| Embedding (query-time) | $0.01–0.10 per 1M tokens | Per user query |
| Reranking | $0.50–2.00 per 1M tokens | Optional but recommended |
| LLM generation | $1–25 per 1M tokens | Depends on model choice |

### Real-World Examples

| Product | RAG Implementation | Key Design Decision |
|---------|-------------------|---------------------|
| **Perplexity** | Web-scale RAG with real-time search | Retrieves from live web, cites sources inline, uses reranking for precision |
| **Notion AI Q&A** | Workspace-scoped RAG | Indexes all workspace content; respects permissions; answers grounded in user's own documents |
| **GitHub Copilot Chat** | Codebase RAG | Indexes repository code; retrieves relevant files/functions for context-aware code assistance |
| **Glean** | Enterprise search RAG | Connects to 100+ enterprise apps (Slack, Confluence, Drive); unified search with permission-aware retrieval |
| **ChatGPT with file upload** | Session-scoped RAG | Uploaded documents chunked and embedded for the session; simple but non-persistent |

### Common PM Misconceptions

1. **"RAG eliminates hallucinations."** False. RAG reduces hallucinations by grounding responses in retrieved data, but the model can still hallucinate beyond the retrieved content, misinterpret chunks, or generate answers when retrieval returns irrelevant results.

2. **"More data = better RAG."** False. Indexing irrelevant or low-quality documents increases noise and reduces retrieval precision. Curating the knowledge base is more important than expanding it.

3. **"RAG is plug-and-play."** False. Production RAG requires chunking strategy tuning, embedding model selection, retrieval threshold calibration, and ongoing monitoring. The 80/20 version is fast; production quality takes iteration.

4. **"Vector search is all you need."** False. Hybrid search (vector + keyword) is the 2026 default because pure vector search misses exact matches (product codes, error messages, proper nouns).

5. **"RAG replaces fine-tuning."** Partially false. RAG provides knowledge; fine-tuning changes behavior. They solve different problems and are often complementary.

### Decision Framework: RAG Architecture

**Start simple, measure, iterate:**
1. Begin with recursive chunking (512 tokens, 10% overlap) + single vector store
2. Add hybrid search when exact-match queries fail
3. Add reranking when precision matters more than latency
4. Consider GraphRAG only when cross-document reasoning is a core requirement

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [Pinecone: Retrieval-Augmented Generation](https://www.pinecone.io/learn/retrieval-augmented-generation/) | Canonical RAG architecture explanation |
| 1 | [PMC: Comparative Evaluation of Advanced Chunking for RAG (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12649634/) | Peer-reviewed chunking strategy comparison |
| 2 | [Neo4j: Advanced RAG Techniques](https://neo4j.com/blog/genai/advanced-rag-techniques/) | GraphRAG and knowledge graphs |
| 2 | [Eden AI: 2025 Guide to RAG](https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag) | Comprehensive RAG guide |
| 2 | [Morphik: RAG Strategies at Scale](https://www.morphik.ai/blog/retrieval-augmented-generation-strategies) | Enterprise RAG deployment patterns |
| 3 | [Data Nucleus: RAG Enterprise Guide 2025](https://datanucleus.dev/rag-and-agentic-ai/what-is-rag-enterprise-guide-2025) | Enterprise considerations, agentic RAG |
| 3 | [Braincuber: How RAG Works (2026)](https://www.braincuber.com/blog/how-rag-works-architecture-chunking-retrieval-explained) | Architecture and chunking overview |

---

## Lesson 3: Fine-Tuning

### Core Concepts

#### 3.1 What Fine-Tuning Actually Does

Fine-tuning takes a pre-trained LLM and trains it further on a domain-specific dataset. It changes the model's weights — its internal behavior — rather than just providing context at inference time.

**What fine-tuning is good for:**
- Changing the model's tone, style, or format consistently
- Teaching domain-specific terminology and reasoning patterns
- Reducing prompt length (behaviors baked into the model don't need prompt instructions)
- Improving performance on narrow, well-defined tasks

**What fine-tuning is NOT good for:**
- Adding new factual knowledge (use RAG instead — fine-tuned knowledge becomes stale)
- One-off customization (use prompting)
- Tasks where requirements change frequently (re-training is expensive)

#### 3.2 Fine-Tuning Methods

**Full Fine-Tuning:**
Updates all model parameters. Highest quality ceiling but prohibitively expensive for large models.
- Cost: $10,000–$30,000+ per run for 7B+ models
- Requires: 100–120 GB VRAM for a 7B model (~$50K in H100 GPUs)
- Timeline: days to weeks of compute
- When: only when budget is unlimited and maximum quality is required

**LoRA (Low-Rank Adaptation):**
Freezes the original model weights and trains small adapter matrices that modify the model's behavior. The dominant fine-tuning method in 2025-2026.
- Achieves 95% of full fine-tuning performance at 10% of the cost
- Cost: $500–$5,000 per run depending on model size
- Reduces memory requirements 10–20x
- Adapters are small (10–100 MB) and can be swapped, enabling multiple specializations from one base model
- PM implication: LoRA makes fine-tuning accessible to startups, not just big tech

**QLoRA (Quantized LoRA):**
Combines LoRA with model quantization (reducing weight precision from 16-bit to 4-bit).
- Enables fine-tuning a 7B model on a $1,500 consumer GPU (RTX 4090)
- Slight quality trade-off vs. standard LoRA
- Best for: experimentation, proof of concept, small teams

**RLHF (Reinforcement Learning from Human Feedback):**
Humans rank model outputs; a reward model learns these preferences; the LLM is trained to maximize the reward.
- Used by OpenAI, Anthropic, Google to align models with human preferences
- Expensive: requires human labelers, reward model training, and PPO/DPO training
- PM relevance: understand that RLHF is why models are "helpful and harmless" — it's an alignment technique, not a customization tool for most teams
- DPO (Direct Preference Optimization) is a simpler alternative gaining traction: skip the reward model, train directly on preference pairs

**Managed Fine-Tuning Services (2026):**
- OpenAI: fine-tuning API for GPT-4o and GPT-4o-mini (upload JSONL, pay per training token)
- Anthropic: fine-tuning available for Claude models (enterprise tier)
- Google: Vertex AI fine-tuning for Gemini models
- Together AI, Anyscale, Lambda: managed infrastructure for open-source model fine-tuning

#### 3.3 Data Requirements

| Model size | Minimum examples | Recommended | Quality bar |
|------------|-----------------|-------------|-------------|
| 7B (Mistral, Llama) | 100–500 | 1,000–5,000 | Consistent format, correct labels |
| 13B–70B | 500–1,000 | 5,000–10,000 | Domain expert validated |
| Managed API (GPT-4o) | 10 (minimum) | 50–100 | High-quality input-output pairs |

**Data quality > data quantity.** 500 expert-curated examples outperform 50,000 noisy ones. The most common failure mode in fine-tuning is poor training data, not insufficient volume.

#### 3.4 Cost and Timeline (2026)

| Method | Compute cost | Engineering cost | Total timeline |
|--------|-------------|-----------------|----------------|
| LoRA (7B model) | $500–$3,000 | $4,000–$12,000 (data prep + eval) | 2–4 weeks |
| LoRA (13B model) | $2,000–$5,000 | $4,000–$12,000 | 3–6 weeks |
| Full fine-tuning (7B) | $10,000–$30,000 | $8,000–$20,000 | 4–8 weeks |
| Managed API (OpenAI) | $0.80–$3.00/1M training tokens | Minimal | 1–3 days |
| RLHF | $50,000+ | $30,000+ (human labelers) | 2–3 months |

Infrastructure trend: H100 prices dropped from ~$8/hour at launch to $2.85–3.50/hour in late 2025. AWS cut P5 instance pricing by 44% in June 2025.

**ROI benchmark:** Fine-tuning ROI is typically achievable in 4–8 months for companies processing 50,000+ queries/month. Below that volume, prompt engineering is usually more cost-effective.

#### 3.5 The Decision Hierarchy: Prompt → RAG → Fine-Tune

**The IBM framework (widely adopted):**

1. **Start with prompt engineering** (hours, $0–100)
   - If the model can do the task with the right instructions, stop here
   - "If you can get the model to produce acceptable results with good prompting, do not fine-tune"

2. **Add RAG** ($70–1,000/month ongoing)
   - If the model needs access to current/proprietary data
   - If responses need source attribution

3. **Fine-tune** ($5,000–$50,000+ upfront, ongoing maintenance)
   - Only when behavior change is needed AND prompt engineering cannot achieve it
   - When inference cost reduction justifies upfront investment (fine-tuned models need shorter prompts)
   - When consistent specialized performance matters more than flexibility

**Production reality:** Most systems combine all three. A fine-tuned model with a well-crafted system prompt, augmented by RAG retrieval, is a common production architecture.

### Real-World Examples

| Company | Fine-tuning approach | Outcome |
|---------|---------------------|---------|
| **Bloomberg** | BloombergGPT — trained on financial data | Domain-specific financial NLP; outperformed general models on financial tasks but was expensive to maintain [UNCERTAIN: specific maintenance costs not publicly disclosed] |
| **Replit** | Fine-tuned code models for code completion | Achieved faster, more relevant completions than general-purpose models for their specific IDE context |
| **Intuit (TurboTax)** | Fine-tuned for tax domain language and regulations | Domain terminology and regulatory compliance embedded in model behavior |
| **OpenAI GPT-4o mini fine-tuning** | Customer-facing managed service | Enables startups to fine-tune frontier models at $3.00/1M training tokens without infrastructure |

**Failed/abandoned fine-tuning examples:**
- Multiple companies fine-tuned early GPT-3.5 models only to find that GPT-4's zero-shot performance exceeded their fine-tuned GPT-3.5. Lesson: fine-tuning a weaker model often loses to prompting a stronger model.
- Companies that fine-tuned on small, biased datasets saw models amplify biases rather than improve quality. Data curation is the critical path.

### Common PM Misconceptions

1. **"Fine-tuning makes the model smarter."** False. Fine-tuning adjusts behavior, not intelligence. It cannot teach capabilities the base model lacks. A fine-tuned 7B model will not outperform a general 70B model on broad reasoning.

2. **"We need fine-tuning for our domain."** Usually false. In 2025-2026, frontier models (GPT-5.x, Claude Opus 4.6, Gemini 3 Pro) handle most domains well with proper prompting. Fine-tuning is justified for narrow, high-volume, specialized tasks — not for "domain knowledge."

3. **"Fine-tuning is a one-time cost."** False. Models need re-training when data changes, base models update, or requirements evolve. Budget for ongoing maintenance.

4. **"More training data is always better."** False. Data quality matters far more than quantity. 500 expert-validated examples often outperform 50,000 noisy ones. The cost of data curation exceeds compute cost.

5. **"Fine-tuning replaces RAG."** False. Fine-tuning bakes in behavior; RAG provides current knowledge. A fine-tuned model still needs RAG for up-to-date information.

### Decision Framework: Should We Fine-Tune?

**Answer these questions in order:**

1. Can prompt engineering solve this? → Try first (hours, not weeks)
2. Does the model need current/proprietary data? → Add RAG
3. Do we need consistent behavioral change across all interactions? → Consider fine-tuning
4. Do we have 500+ high-quality labeled examples? → If not, invest in data first
5. Will we process 50,000+ queries/month? → If not, ROI unlikely
6. Can we maintain the fine-tuned model over time? → Budget for re-training

If YES to questions 3–6 and NO to question 1: fine-tune.

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [IBM: RAG vs Fine-Tuning vs Prompt Engineering](https://www.ibm.com/think/topics/rag-vs-fine-tuning-vs-prompt-engineering) | Decision framework between three approaches |
| 2 | [Stratagem Systems: LoRA Fine-Tuning Cost 2026](https://www.stratagem-systems.com/blog/lora-fine-tuning-cost-analysis-2026) | Current pricing and ROI analysis |
| 2 | [Introl: Fine-Tuning Infrastructure — LoRA, QLoRA, PEFT at Scale](https://introl.com/blog/fine-tuning-infrastructure-lora-qlora-peft-scale-guide-2025) | Infrastructure guide and cost comparison |
| 2 | [Heavybit: LLM Fine-Tuning Guide for Engineering Teams](https://www.heavybit.com/library/article/llm-fine-tuning) | Practical engineering perspective |
| 2 | [Stratagem Systems: LLM Fine-Tuning Business Guide 2026](https://www.stratagem-systems.com/blog/llm-fine-tuning-business-guide) | Business case and ROI timeline |
| 3 | [RunPod: LLM Fine-Tuning on a Budget](https://www.runpod.io/articles/guides/llm-fine-tuning-on-a-budget-top-faqs-on-adapters-lora-and-other-parameter-efficient-methods) | Budget-friendly approaches, LoRA/QLoRA FAQ |
| 3 | [Xenoss: Fine-Tuning LLMs at Scale — Cost Optimization](https://xenoss.io/blog/fine-tuning-llm-cost-optimization) | Cost optimization strategies |

---

## Lesson 4: Model Selection

### Core Concepts

#### 4.1 The 2026 Model Landscape

The model landscape has consolidated around a few major providers with distinct positioning:

| Provider | Frontier model | Strength | Input $/1M tokens | Output $/1M tokens |
|----------|---------------|----------|-------------------|-------------------|
| **OpenAI** | GPT-5.2 / GPT-5.4 | General-purpose, strong tooling ecosystem | $1.75–$3.00 | $7.00–$14.00 |
| **Anthropic** | Claude Opus 4.6 | Writing, safety, agentic coding, long context (200K) | $5.00 | $25.00 |
| **Anthropic** | Claude Sonnet 4.6 | Best performance-to-cost ratio for many apps | $3.00 | $15.00 |
| **Google** | Gemini 3 Pro | Multimodal, 1M context, caching/grounding | $1.25 | $10.00 |
| **Google** | Gemini 3 Flash / 2.5 Flash | Speed-optimized, cost-efficient | $0.15–$0.30 | $0.60–$2.50 |
| **Meta** | Llama 4 Scout (open) | Open-source, 10M context, fast (2600 t/s) | $0.11 | $0.34 |
| **DeepSeek** | DeepSeek-V3 / R1 | Aggressive price/performance | $0.07–$0.55 | $0.28–$2.19 |

**Reasoning models (separate tier):**
- OpenAI o3, o4-mini: Deep reasoning, higher cost, higher latency
- Claude Extended Thinking: Reasoning within Claude models
- Gemini Thinking Mode: Reasoning within Gemini

#### 4.2 Benchmarks PMs Should Understand

**General intelligence benchmarks:**
- **MMLU / MMLU-Pro:** Multi-task language understanding across 57+ domains. The most widely cited general benchmark, though increasingly saturated at the top.
- **GPQA:** Graduate-level science questions. Harder than MMLU, better for distinguishing frontier models.
- **ARC-AGI:** Abstract reasoning. Tests pattern recognition that humans find easy but LLMs find hard.

**Coding benchmarks:**
- **HumanEval / HumanEval+:** Code generation from docstrings. Widely used but increasingly saturated.
- **SWE-bench:** Real-world software engineering tasks (fixing GitHub issues). More meaningful than HumanEval for production coding assessment.
- **LiveCodeBench:** Continuously updated coding problems to prevent data contamination.

**Agentic benchmarks:**
- **GRIND:** Adaptive reasoning and agentic capability assessment.
- **TAU-bench:** Tool-use and agentic tasks.

**PM caveat on benchmarks:** Benchmarks measure model capability in controlled conditions. They do not measure performance on YOUR specific task. A model that ranks #1 on MMLU may underperform on your customer support use case. Always evaluate on your own data.

#### 4.3 Multi-Model Routing

The emerging production pattern: use different models for different tasks rather than one model for everything.

**Tiered routing architecture:**
- **Fast/cheap tier** (Gemini Flash, GPT-4o-mini, Llama): Simple classification, extraction, formatting — 70–80% of requests
- **Strong tier** (Claude Sonnet, GPT-4o, Gemini Pro): Complex reasoning, generation, analysis — 15–25% of requests
- **Reasoning tier** (o3, Claude Extended Thinking): Multi-step reasoning, research — 1–5% of requests

**How routing works:**
1. A lightweight classifier (or heuristic rules) assesses query complexity
2. Simple queries go to the cheap tier, complex ones to the strong tier
3. Combined, this can reduce costs 5–10x compared to sending everything to the frontier model

**Production examples:**
- Anthropic's own Claude Code routes between Sonnet (fast) and Opus (complex)
- Many customer support systems use a small model for FAQ answers and a frontier model for escalated queries
- Coding assistants use fast models for autocomplete and frontier models for complex generation

#### 4.4 Beyond Benchmarks: Practical Selection Criteria

| Criterion | Why it matters | How to evaluate |
|-----------|---------------|----------------|
| **Task-specific quality** | Benchmarks don't predict YOUR use case | Run 50–100 representative queries, blind-evaluate outputs |
| **Latency (TTFT + TPS)** | User experience for real-time features | Measure time-to-first-token and tokens-per-second in production conditions |
| **Cost at YOUR scale** | 10x price difference between models | Calculate monthly cost at projected query volume |
| **Context window** | Limits what you can include in each request | Match to your longest realistic input |
| **Multimodal support** | Image, audio, video understanding | Test with actual product inputs |
| **API reliability/uptime** | Production availability | Check status pages, SLA terms |
| **Data privacy/compliance** | Regulatory requirements | Review data processing terms; consider self-hosted open models |
| **Ecosystem/tooling** | Developer productivity | Function calling, JSON mode, streaming, SDK quality |

### Real-World Examples

| Scenario | Model choice | Rationale |
|----------|-------------|-----------|
| **High-volume customer support** | GPT-4o-mini or Gemini Flash | Cost-efficient at scale, adequate quality for FAQ-level queries |
| **Legal document analysis** | Claude Opus 4.6 | Long context (200K), strong reasoning, careful with nuance |
| **Code generation (IDE)** | Multi-model: fast model for autocomplete, frontier for generation | Latency-sensitive for autocomplete, quality-sensitive for generation |
| **Data privacy-sensitive** | Llama 4 (self-hosted) or Mistral | No data leaves infrastructure |
| **Multimodal product (images + text)** | Gemini 3 Pro or GPT-5.2 | Native multimodal processing |
| **Research/deep analysis** | o3 or Claude Extended Thinking | Reasoning models for complex multi-step analysis |

### Common PM Misconceptions

1. **"The #1 model on the leaderboard is the best choice."** False. Best depends on task, cost, latency, and compliance requirements. The #1 model is often 5–10x more expensive than models that are "good enough."

2. **"We should use one model for everything."** Usually suboptimal. Multi-model routing typically cuts costs 50–80% while maintaining quality where it matters.

3. **"Open-source models are always cheaper."** Not necessarily. Self-hosting requires infrastructure, MLOps, and engineering time. Below ~100K queries/month, managed APIs are often cheaper than self-hosting.

4. **"Bigger models are always better."** False. Smaller models fine-tuned for specific tasks often outperform larger general models on those tasks, at a fraction of the cost.

5. **"Model selection is a one-time decision."** False. The model landscape changes quarterly. Build abstractions that allow model switching without rewriting your product.

### Decision Framework: Model Selection

**Step 1 — Define requirements:**
- Quality threshold (what's "good enough" for this feature?)
- Latency budget (real-time < 2s? Background processing OK?)
- Cost ceiling (monthly budget at projected volume?)
- Compliance constraints (data residency, privacy?)

**Step 2 — Evaluate candidates:**
- Run 50–100 representative queries on 3–4 candidate models
- Blind-evaluate outputs (remove model names, rate quality 1–5)
- Measure latency and calculate cost at projected volume

**Step 3 — Design for switching:**
- Use model-agnostic abstractions (LiteLLM, OpenRouter, or provider SDKs with adapters)
- Version your prompts per model (different models respond differently to the same prompt)
- Monitor quality metrics continuously

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [Artificial Analysis: LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models) | Independent benchmark and pricing comparison |
| 2 | [Klu: 2026 LLM Leaderboard](https://klu.ai/llm-leaderboard) | Model comparison with quality/speed/price metrics |
| 2 | [DEV Community: Choosing an LLM in 2026](https://dev.to/superorange0707/choosing-an-llm-in-2026-the-practical-comparison-table-specs-cost-latency-compatibility-354g) | Practical comparison table |
| 2 | [Claude5.ai: LLM API Pricing 2026](https://claude5.ai/news/llm-api-pricing-comparison-2025-complete-guide) | Comprehensive pricing comparison |
| 2 | [Siliconflow: LLM Model Benchmarks 2026](https://www.siliconflow.com/articles/benchmark) | Benchmark methodology and results |
| 3 | [Shakudo: Top 9 LLMs March 2026](https://www.shakudo.io/blog/top-9-large-language-models) | Model positioning and use cases |
| 3 | [LLM Stats: AI Leaderboards 2026](https://llm-stats.com) | Comparative ranking tool |

---

## Lesson 5: Cost/Quality Tradeoffs

### Core Concepts

#### 5.1 Token Economics

**The fundamental unit of LLM cost is the token.** All pricing, budgeting, and optimization revolves around token consumption.

**Key pricing dynamics (2026):**
- Output tokens cost 2–5x more than input tokens across all major providers (because generation requires more compute than processing input)
- Cached input tokens cost 0.1x the base input rate (Anthropic) or are free (some providers)
- Reasoning tokens (internal chain-of-thought in o-series models) are billed as output tokens but not visible to the user — a hidden cost multiplier

**Price deflation trend ("LLMflation"):**
Per a16z research, LLM inference costs have declined approximately 10x annually:
- GPT-4 equivalent performance: $20/1M tokens (late 2022) → $0.40/1M tokens (2025)
- This trend is driven by hardware improvements, quantization, and competition
- PM implication: features that are uneconomical today may be viable in 6–12 months

**Current pricing snapshot (March 2026):**

| Model | Input $/1M | Output $/1M | Cached input $/1M |
|-------|-----------|------------|-------------------|
| GPT-5.2 | $1.75 | $14.00 | — |
| GPT-4o-mini | $0.15 | $0.60 | $0.075 |
| Claude Opus 4.6 | $5.00 | $25.00 | $0.50 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 |
| Gemini 2.5 Pro | $1.25 | $10.00 | $0.3125 |
| Gemini 2.5 Flash | $0.15 | $0.60 | $0.0375 |
| Llama 4 Scout (via API) | $0.11 | $0.34 | — |

#### 5.2 Real Cost Calculations

**Example 1: AI customer support chatbot**
- 100,000 conversations/month
- Average conversation: 2,000 input tokens + 500 output tokens
- Using Claude Sonnet 4.6:
  - Input: 100K × 2,000 = 200M tokens × $3.00/1M = $600
  - Output: 100K × 500 = 50M tokens × $15.00/1M = $750
  - **Monthly total: $1,350**
- Using Gemini 2.5 Flash:
  - Input: 200M × $0.15/1M = $30
  - Output: 50M × $0.60/1M = $30
  - **Monthly total: $60**
- **Difference: 22.5x cost for the premium model**

**Example 2: Document analysis feature**
- 10,000 documents/month, average 5,000 tokens each
- System prompt: 2,000 tokens (cached after first call)
- Output: 1,000 tokens per document
- Using GPT-4o with prompt caching:
  - System prompt (cached): 10K × 2,000 = 20M tokens × $0.075/1M = $1.50
  - Document input: 10K × 5,000 = 50M tokens × $2.50/1M = $125
  - Output: 10K × 1,000 = 10M tokens × $10.00/1M = $100
  - **Monthly total: ~$227**

**Example 3: AI-powered search (RAG)**
- 500,000 queries/month
- Per query: 500 token query + 2,000 token retrieved context + 300 token response
- Embedding cost: 500K × 500 = 250M tokens × $0.02/1M = $5
- Using Gemini 2.5 Flash:
  - Input: 500K × 2,500 = 1.25B tokens × $0.15/1M = $187.50
  - Output: 500K × 300 = 150M tokens × $0.60/1M = $90
  - Vector DB: ~$200/month (Pinecone starter)
  - **Monthly total: ~$483**

#### 5.3 Cost Optimization Strategies

**1. Prompt Caching**
Cache static portions of prompts (system prompts, few-shot examples) across requests.
- Anthropic: cached reads cost 0.1x base rate (90% savings on cached portions)
- Google: context caching for Gemini models
- Impact: Up to 73% cost reduction in high-repetition workloads (Redis LangCache benchmark)

**2. Model Routing (Tiered Architecture)**
Route requests to the cheapest model capable of handling them.
- Send 70–80% of requests to a fast/cheap model
- Reserve frontier models for complex queries
- Combined impact: 5–10x cost reduction vs. single-model architecture

**3. Output Length Control**
- Set max_tokens to the minimum needed for the task
- Use structured output (JSON) to avoid verbose prose responses
- Output tokens cost 2–5x more than input — every unnecessary output token is expensive

**4. Batching**
Group multiple requests into batch API calls (available from OpenAI and Anthropic).
- Typically 50% cost reduction for non-real-time workloads
- Trade-off: higher latency (minutes to hours vs. seconds)

**5. Token Reduction**
- Compress prompts: remove redundant instructions, use abbreviations in system prompts
- Summarize conversation history instead of sending full transcripts
- Use embeddings for retrieval instead of stuffing everything into context

**6. Self-Hosting Open Models**
- Break-even vs. API typically at 40+ GPU-hours/week sustained usage
- Midjourney case study: moved from NVIDIA A100/H100 to TPU v6e, reducing monthly inference from $2.1M to under $700K ($16.8M annualized savings)
- Only viable at significant scale with dedicated MLOps capability

#### 5.4 Unit Economics for AI Features

**The AI feature P&L framework:**

| Line item | Calculation | Example |
|-----------|------------|---------|
| Revenue per user/month | Subscription or usage fee | $20/user/month |
| AI cost per user/month | (Avg queries × tokens per query × price per token) | $0.50–$5.00/user/month |
| AI cost as % of revenue | AI cost / Revenue | 2.5–25% |
| Gross margin impact | Traditional margin minus AI cost | Varies by baseline |

**Healthy AI unit economics benchmarks:**
- AI inference cost should be <10% of the feature's revenue contribution
- If AI cost exceeds 20% of feature revenue, optimize (model routing, caching) or re-price
- For freemium products: free-tier AI costs must be covered by conversion to paid

**The "AI tax" problem:**
Every AI-powered feature adds a per-use marginal cost that traditional software does not have. Traditional SaaS has near-zero marginal cost per user interaction. AI features cost money every time they run. This fundamentally changes unit economics and requires:
- Usage-based pricing or credits for AI features
- Rate limiting for free tiers
- Cost monitoring dashboards as a first-class product concern

#### 5.5 The Quality-Cost Frontier

**Not all quality is worth paying for.** The PM's job is to find the minimum quality that users value and deliver it at the lowest cost.

| Quality level | Typical approach | Use case |
|---------------|-----------------|----------|
| "Good enough" (80%) | Small model, zero-shot | Autocomplete, classification, simple extraction |
| "High quality" (90%) | Mid-tier model, few-shot + RAG | Customer support, document analysis |
| "Near-perfect" (95%+) | Frontier model, CoT + RAG + human review | Medical, legal, financial — high-stakes |

**The diminishing returns curve:** Going from 80% to 90% quality might cost 3x. Going from 90% to 95% might cost 10x. Going from 95% to 99% might cost 50x. PMs must define "good enough" before engineering starts.

### Real-World Examples

| Company | Optimization | Impact |
|---------|-------------|--------|
| **Midjourney** | Migrated inference from NVIDIA GPUs to TPU v6e | $2.1M/month → <$700K/month ($16.8M annualized savings) |
| **Various (a16z data)** | LLMflation — natural price decline over time | 10x annual cost reduction for equivalent capability |
| **Enterprise RAG systems** | Prompt caching + model routing | 5–10x cost reduction vs. naive single-model approach |

### Common PM Misconceptions

1. **"AI features have the same cost structure as traditional software."** False. AI features have per-use marginal costs. Every API call costs money. This changes pricing, budgeting, and margin calculations fundamentally.

2. **"The cheapest model is the best choice for cost optimization."** False. A cheap model that requires 3 retries costs more than a mid-tier model that succeeds on the first try. Measure cost per successful outcome, not cost per API call.

3. **"Cost optimization can wait until we scale."** Risky. Architectural decisions made early (model choice, caching, routing) are hard to change later. Build cost awareness into the product from day one.

4. **"Users will pay more for AI features."** Partially true. Users will pay for value, not for AI. If the AI feature saves them 2 hours/week, they'll pay for the time savings. "Powered by AI" is not a value proposition.

5. **"Price declines mean we don't need to optimize."** False. Costs decline but usage also grows. Most companies find that AI cost grows faster than price declines because adoption drives volume increases.

### Decision Framework: Cost Optimization Priority

**Optimize in this order (highest ROI first):**
1. **Model routing** — biggest lever, 5–10x savings
2. **Prompt caching** — easy to implement, 50–90% savings on cached portions
3. **Output length control** — set max_tokens, use structured output
4. **Batch processing** — 50% savings for non-real-time workloads
5. **Prompt compression** — 10–30% savings from tighter prompts
6. **Self-hosting** — only at scale, only with MLOps capability

### Sources

| Rank | Source | Key Contribution |
|------|--------|-----------------|
| 1 | [a16z: LLMflation — LLM Inference Cost Is Going Down Fast](https://a16z.com/llmflation-llm-inference-cost/) | 10x annual cost decline data |
| 2 | [Introl: Cost Per Token Analysis](https://introl.com/blog/cost-per-token-llm-inference-optimization) | Token cost optimization techniques |
| 2 | [Introl: Inference Unit Economics](https://introl.com/blog/inference-unit-economics-true-cost-per-million-tokens-guide) | True cost per million tokens analysis |
| 2 | [Redis: LLM Token Optimization 2026](https://redis.io/blog/llm-token-optimization-speed-up-apps/) | Caching strategies and benchmarks |
| 2 | [Silicon Data: LLM Cost Per Token Guide 2026](https://www.silicondata.com/blog/llm-cost-per-token) | Practical cost guide |
| 3 | [FutureAGI: LLM Cost Optimization Guide](https://futureagi.com/blogs/llm-cost-optimization-2025) | 30% infrastructure reduction strategies |
| 3 | [Unified AI Hub: Economics of AI](https://www.unifiedaihub.com/blog/the-economics-of-ai-cost-optimization-strategies-for-token-based-models) | Token-based cost strategies |
| 3 | [Hakia: LLM Inference Optimization 2026](https://www.hakia.com/tech-insights/llm-inference-optimization/) | Speed and cost optimization techniques |

---

## Synthesis: How These 5 Lessons Connect

### Theme 1: The Optimization Hierarchy

The five lessons form a natural escalation path that every AI PM should internalize:

**Prompt Engineering → RAG → Fine-Tuning → Model Selection → Cost Optimization**

This is not a sequence to follow in order — it's a hierarchy of levers:
- **Prompt engineering** is the fastest, cheapest lever. Always start here.
- **RAG** adds external knowledge without changing the model. Use when the model needs data it doesn't have.
- **Fine-tuning** changes model behavior. Use only when prompting cannot achieve the needed consistency.
- **Model selection** determines the quality ceiling and cost floor. Choose based on task requirements, not leaderboard rankings.
- **Cost optimization** runs across all layers — caching, routing, batching, and monitoring apply regardless of which techniques you use.

The PM who reaches for fine-tuning before exhausting prompt engineering wastes weeks and thousands of dollars. The PM who uses a frontier model for every request wastes money on quality users don't need.

### Theme 2: The Build-vs-Configure Spectrum

Each lesson represents a different point on the build-vs-configure spectrum:

| Lesson | Effort | Flexibility | Lock-in |
|--------|--------|-------------|---------|
| Prompt Engineering | Hours | Very high (change anytime) | None |
| RAG | Weeks | High (update data anytime) | Moderate (vector DB choice) |
| Fine-Tuning | Months | Low (re-train to change) | High (model + data investment) |
| Model Selection | Days | Medium (switching cost exists) | Medium (prompt differences) |
| Cost Optimization | Ongoing | N/A | Varies by strategy |

**PM principle:** Prefer configuration over building. The more baked-in a decision, the harder it is to change. Start flexible, lock down only when measurement proves the investment is justified.

### Theme 3: Quality Is Not a Single Number

Across all five lessons, "quality" means different things:
- **Prompt engineering quality:** Does the output match the desired format, tone, and accuracy?
- **RAG quality:** Are retrieved chunks relevant? Is the answer faithful to sources?
- **Fine-tuning quality:** Is the behavioral change consistent? Does it generalize?
- **Model selection quality:** Does the model perform well on YOUR specific task distribution?
- **Cost/quality tradeoff:** What is the minimum quality that users value?

**The PM's job is to define "good enough" concretely** — with measurable criteria — before any optimization work begins. "Make it better" is not a product requirement.

### Theme 4: Connections to Earlier Chapters

**To Chapter 01 (Foundations):**
- Prompt engineering directly applies the token/context window/temperature concepts from Lesson 1
- RAG is the primary mitigation strategy for hallucinations (covered in Foundations)
- Model selection requires understanding the ML landscape (Foundations Lesson 2)
- Cost calculations require understanding tokenization (Foundations Lesson 1)

**To Chapter 02 (Strategy):**
- Cost/quality tradeoffs are central to AI product strategy and pricing decisions
- Model selection and routing are architectural decisions with strategic implications
- Fine-tuning decisions represent significant resource commitments that must align with product strategy
- The build-vs-configure spectrum maps directly to build/buy/partner strategic decisions

**To Chapter 03 (Product Design):**
- Prompt engineering determines the quality of AI-generated content that UX must present
- RAG quality affects trust and explainability (source attribution, confidence indicators)
- Model selection impacts latency, which directly affects UX loading states and streaming
- Cost constraints shape what AI features can be offered on free vs. paid tiers

### Theme 5: The PM's Technical Decision Map

When facing a technical AI decision, use this routing:

| Question | Relevant lesson | First action |
|----------|----------------|-------------|
| "The AI output quality isn't good enough" | Prompt Engineering (L1) | Improve the prompt before anything else |
| "The model doesn't know about our data" | RAG (L2) | Build a retrieval pipeline |
| "The model's tone/style isn't right" | Fine-Tuning (L3) | Try system prompt first; fine-tune only if prompt fails |
| "Which model should we use?" | Model Selection (L4) | Run blind evaluation on 50+ representative queries |
| "AI costs are too high" | Cost/Quality (L5) | Implement model routing as the highest-leverage fix |
| "We need all of the above" | Synthesis | Start with prompt engineering on a mid-tier model with RAG. Optimize from there. |

---

## Key Frameworks Referenced (for lesson authoring)

| Framework | Source | Usage |
|-----------|--------|-------|
| Prompt → RAG → Fine-Tune Hierarchy | IBM, widely adopted | Lesson 3 — decision framework |
| Tiered Model Routing | Production best practice | Lesson 4 + 5 — cost optimization |
| LLMflation (10x annual cost decline) | a16z | Lesson 5 — pricing trends |
| Quality-Cost Frontier | Standard economics | Lesson 5 — diminishing returns |
| Complexity-Stakes Matrix | Synthesized from multiple sources | Lesson 1 — prompt strategy |
| Build-vs-Configure Spectrum | Synthesized | Synthesis — connecting themes |

---

## Gaps and Open Questions

1. **Prompt engineering evaluation tooling:** No standardized tooling for A/B testing prompts in production exists yet. Most teams use ad-hoc approaches. [Gap for Lesson 1]
2. **RAG evaluation benchmarks:** While RAGAS and similar frameworks exist, there is no industry-standard benchmark for RAG quality in production settings. [Gap for Lesson 2]
3. **Fine-tuning ROI data:** Most fine-tuning ROI claims come from vendor case studies, not independent research. Hard numbers on when fine-tuning pays off vs. better prompting are scarce. [Gap for Lesson 3]
4. **Multi-model routing best practices:** The pattern is emerging but standardized approaches (when to route, how to classify complexity) are not well-documented. [Gap for Lesson 4]
5. **Long-term cost projections:** While the 10x annual decline trend is documented, predicting costs 12–18 months out for product planning remains speculative. [Gap for Lesson 5]
6. **Non-English cost implications:** Token economics for non-English languages (more tokens per word) are rarely discussed in pricing guides but significantly affect cost calculations for international products. [Gap for Lesson 5]
