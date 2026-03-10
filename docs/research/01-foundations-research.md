# Research: 01 — Foundations (AI Foundations for Product Managers)

> Status: Research complete
> Date: 2026-03-10
> Purpose: Factual basis for writing 4 lessons + 1 synthesis
> Source hierarchy: Peer-reviewed/official docs > Established frameworks > Practitioner content

---

## Lesson 1: How LLMs Think

### Core Concepts

#### 1.1 Tokens: The Atomic Unit of LLMs

LLMs do not process text as words. They process **tokens** — subword units created through Byte-Pair Encoding (BPE).

**How BPE works:**
- Start with individual characters/bytes as the base vocabulary
- Iteratively merge the most frequent adjacent pairs into new tokens
- Repeat until the target vocabulary size is reached
- Result: common words = 1 token, rare words = multiple tokens

**Vocabulary sizes (verified):**
- GPT-3.5 / GPT-4: ~100,258 tokens (100k from BPE + 258 special tokens)
- OpenAI uses tiktoken, a byte-level BPE tokenizer
- Karpathy's minbpe project demonstrates the algorithm from scratch

**PM-relevant implications:**
- Token count != word count. English averages ~1.3 tokens/word; non-English languages and code use significantly more tokens per semantic unit
- Tokens determine cost (priced per million tokens) and context limits
- Understanding tokenization explains why "count the R's in strawberry" fails — the model doesn't see letters, it sees token chunks

**Sources:**
- [OpenAI tiktoken (GitHub)](https://github.com/openai/tiktoken)
- [Karpathy minbpe (GitHub)](https://github.com/karpathy/minbpe)
- [Sebastian Raschka: BPE from Scratch (2025)](https://sebastianraschka.com/blog/2025/bpe-from-scratch.html)
- [Hugging Face LLM Course: BPE Tokenization](https://huggingface.co/learn/llm-course/chapter6/5)

#### 1.2 Next-Token Prediction: The Core Mechanism

LLMs are, at their core, **next-token prediction machines**. Given a sequence of tokens, the model calculates a probability distribution over all possible next tokens and selects one.

**Karpathy's framing (verified):**
> "It's a bit sad and confusing that LLMs ('Large Language Models') have little to do with language; It's just historical. They are highly general purpose technology for statistical modeling of token streams. A better name would be Autoregressive Transformers."
— Andrej Karpathy, X/Twitter, September 2024

**How it works step by step:**
1. Input text is tokenized into a sequence of token IDs
2. Each token is converted into a high-dimensional embedding vector
3. The Transformer architecture processes these embeddings through self-attention layers
4. The model outputs a probability distribution over the entire vocabulary for the next position
5. A token is selected from this distribution (selection method depends on sampling parameters)
6. The selected token is appended, and the process repeats (autoregressive generation)

**Self-attention mechanism (PM-level):**
Each token creates three vectors: a Query ("what am I looking for?"), a Key ("what do I contain?"), and a Value ("what do I offer if selected?"). The attention mechanism lets every token "attend to" every other token in the context, determining which parts of the input are most relevant for predicting the next token. This is the core innovation from the 2017 paper "Attention is All You Need" (Vaswani et al., Google Brain).

**Sources:**
- [Vaswani et al., "Attention Is All You Need" (2017), arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
- [Karpathy on X (Sept 2024)](https://x.com/karpathy/status/1835024197506187617)
- [Karpathy: Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html)
- [The Illustrated Transformer (Jay Alammar)](https://jalammar.github.io/illustrated-transformer/)
- [Transformer Explainer (Georgia Tech, interactive)](https://poloclub.github.io/transformer-explainer/)

#### 1.3 Temperature and Sampling Parameters

Temperature controls the **randomness of token selection** from the probability distribution.

**How temperature works:**
- Temperature = 0: Always pick the highest-probability token (deterministic, "greedy decoding")
- Temperature = 0.1–0.5: Conservative — mostly predictable with slight variation
- Temperature = 0.7–0.9: Balanced creativity and coherence
- Temperature = 1.0: Standard randomness (unmodified probability distribution)
- Temperature > 1.0: High randomness, may produce incoherent output

**Technical mechanism:** Temperature divides the logits (raw model scores) before the softmax function. Lower values make the distribution "peakier" (dominant token gets even more probability); higher values "flatten" it (more tokens become viable candidates).

**Other sampling parameters PMs should know:**
- **Top-p (nucleus sampling):** Only consider tokens whose cumulative probability reaches p (e.g., top_p=0.9 means consider the smallest set of tokens covering 90% probability)
- **Top-k:** Only consider the k most probable tokens
- **Frequency/presence penalty:** Reduce probability of tokens that already appeared (reduces repetition)

**PM decision framework:**
| Use case | Recommended temperature |
|----------|------------------------|
| Code generation, data extraction | 0 – 0.2 |
| Customer support, summarization | 0.3 – 0.5 |
| Creative writing, brainstorming | 0.7 – 1.0 |
| Exploration, artistic content | 1.0 – 1.5 |

**Sources:**
- [Vellum: LLM Temperature](https://www.vellum.ai/llm-parameters/temperature)
- [IBM: LLM Parameters](https://www.ibm.com/think/topics/llm-parameters)
- [DEV Community: Three Pillars of LLM Control](https://dev.to/qvfagundes/temperature-tokens-and-context-windows-the-three-pillars-of-llm-control-34jg)

#### 1.4 Context Window: The Model's Working Memory

The context window is the **maximum number of tokens** an LLM can process in a single interaction (input + output combined).

**Current context window sizes (as of early 2026):**
| Model | Context window |
|-------|---------------|
| GPT-4 Turbo | 128K tokens |
| GPT-5.2 | 128K tokens (standard) |
| Claude Opus 4.6 / Sonnet 4.6 | 200K tokens (1M beta for tier 4+ orgs, Jan 2026) |
| Gemini 3 Pro | 1M tokens (default) |
| Gemini 3 Flash | 200K tokens |
| Gemini 1.5 Pro | Up to 2M tokens |
| Llama 4 Scout | 10M tokens (109B total params, 17B active) |

**PM-relevant implications:**
- Context window determines how much information the model can "see" at once
- Bigger != always better: performance can degrade as the window fills ("lost in the middle" problem; also "context rot" per Simon Willison)
- Cost scales with token usage: more context = higher cost per request
- Context window management is a key architectural decision — what goes in, what gets summarized, what gets dropped

**Cost implications (API pricing, as of March 2026):**
| Model | Input $/1M tokens | Output $/1M tokens |
|-------|-------------------|-------------------|
| Claude Opus 4.6 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| GPT-5.2 | $1.75 | $14.00 |
| Gemini 2.5 Pro | $1.25 | $10.00 |
| Gemini 2.5 Flash | $0.30 | $2.50 |

**Sources:**
- [AI Multiple: Best LLMs for Extended Context Windows (2026)](https://aimultiple.com/ai-context-window)
- [IntuitionLabs: AI API Pricing Comparison (2026)](https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude)
- [OpenAI Pricing](https://platform.openai.com/docs/pricing)
- [Simon Willison: Building with LLMs (PyCon 2025)](https://allarddewinter.net/blog/simon-willison-on-building-with-llms-pycon-2025/)

#### 1.5 Hallucinations: Why LLMs Make Things Up

Hallucinations are outputs that are **factually incorrect, fabricated, or unsupported** — yet delivered with apparent confidence.

**Root causes (based on OpenAI's September 2025 research paper):**

1. **Training incentives reward guessing over uncertainty.** Standard training objectives (next-token prediction) and evaluation benchmarks reward confident guessing over saying "I don't know." Models learn that guessing has a chance of being right (partial credit), while abstaining guarantees zero points.
   - Source: Kalai, Nachum, Vempala, Zhang. "Why Language Models Hallucinate." OpenAI, September 2025. arXiv:2509.04664

2. **Pattern prediction, not fact verification.** LLMs generate text by predicting likely continuations, not by consulting a knowledge base. They have no mechanism to verify factual accuracy during generation.

3. **Low-frequency facts are inherently unreliable.** Arbitrary facts (e.g., a specific person's birthday) that appear rarely in training data cannot be reliably predicted from patterns alone.

4. **Enterprise data quality compounds the problem.** In production, outdated, inconsistent, or poorly retrieved enterprise data causes many "hallucinations" that are actually retrieval failures, not model failures.

**Hallucination rates (as of April 2025, per Lakera):**
- Best performing: Google Gemini-2.0-Flash-001 at 0.7%
- Worst performing: TII falcon-7B-instruct at 29.9%
- Even the best model produces hallucinations in ~7 out of 1,000 prompts

**Mitigation strategies (2025 consensus):**
- **RAG (Retrieval-Augmented Generation):** Ground responses in retrieved, verified documents
- **Calibrated uncertainty:** Design systems that transparently signal doubt and can refuse to answer when unsure
- **Evaluation/scoring reform:** Penalize confident errors more than penalizing appropriate expressions of uncertainty
- **Human-in-the-loop:** Flag low-confidence outputs for review
- **Source attribution:** Require models to cite sources, making claims verifiable

**Sources:**
- [OpenAI: Why Language Models Hallucinate (Sept 2025)](https://openai.com/index/why-language-models-hallucinate/)
- [arXiv:2509.04664](https://arxiv.org/abs/2509.04664)
- [Lakera: Guide to Hallucinations in LLMs (2026)](https://www.lakera.ai/blog/guide-to-hallucinations-in-large-language-models)
- [Evidently AI: LLM Hallucination Examples](https://www.evidentlyai.com/blog/llm-hallucination-examples)

### Real-World Examples

1. **Legal case fabrication:** In 2023, lawyer Steven Schwartz used ChatGPT to prepare a court filing. The model generated citations to six nonexistent cases. The judge discovered none of the cases existed. (Widely reported, verified incident.)

2. **Google's Bard launch:** Google's AI chatbot made a factual error about the James Webb Space Telescope in its public demo, contributing to a $100B drop in Alphabet's market cap. (February 2023.)

3. **Customer support hallucinations:** Air Canada's chatbot fabricated a refund policy that didn't exist, and a court ruled the airline was liable for honoring it. (February 2024.)

### Common PM Misconceptions

1. **"More data = no hallucinations."** False. Hallucinations are structural — they stem from the prediction mechanism itself, not just data gaps. Even models trained on the entire internet hallucinate.

2. **"Temperature 0 = no randomness = no errors."** False. Temperature 0 is deterministic (same input = same output), but the output can still be factually wrong. Determinism != accuracy.

3. **"LLMs understand what they're saying."** Contested. LLMs are statistical pattern matchers generating probable continuations. Whether this constitutes "understanding" is an active philosophical and scientific debate. For PM purposes: treat the model as a very sophisticated autocomplete, not as a reasoning agent.

4. **"Context window = memory."** False. The context window is session-based working memory only. LLMs have no persistent memory across conversations unless explicitly engineered (e.g., via memory systems, RAG, or fine-tuning).

5. **"Tokens = words."** False. A token can be a word, subword, character, or even a byte. Non-English text and code typically require more tokens per concept.

### Decision Framework: LLM Parameter Selection

**The Temperature-Stakes Matrix:**

| | Low stakes (drafts, ideas) | High stakes (user-facing, factual) |
|---|---|---|
| **Needs creativity** | Temp 0.8–1.0, top_p 0.95 | Temp 0.5–0.7, top_p 0.9 + human review |
| **Needs precision** | Temp 0.3–0.5, top_p 0.8 | Temp 0–0.2, top_p 0.5 + validation layer |

---

## Lesson 2: ML Landscape

### Core Concepts

#### 2.1 Three Programming Paradigms

**Karpathy's Software 1.0 vs 2.0 framing (2017):**

| Paradigm | How it works | Who writes the logic |
|----------|-------------|---------------------|
| **Traditional programming** (Software 1.0) | Human writes explicit rules: `if X then Y` | Human programmer |
| **Machine learning** (Software 2.0) | Machine learns rules from labeled examples: data + desired outputs → model discovers the mapping | Machine, from data |
| **Deep learning** (subset of ML) | Machine learns rules from raw data using multi-layered neural networks; no manual feature engineering needed | Machine, from raw data |

**Key distinction: Feature engineering**
- Traditional ML: Humans must decide what features (input variables) matter. A spam filter needs humans to define "contains ALL CAPS" or "has suspicious link" as features.
- Deep learning: The network discovers relevant features automatically through its layers. Given raw email text, it figures out what patterns indicate spam.

**Sources:**
- [Karpathy: "Software 2.0" (2017)](https://karpathy.medium.com/software-2-0-a64152b37c35)
- [AWS: ML vs Deep Learning](https://aws.amazon.com/compare/the-difference-between-machine-learning-and-deep-learning/)
- [Syracuse iSchool: Deep Learning vs Machine Learning](https://ischool.syracuse.edu/deep-learning-vs-machine-learning/)
- [GeeksforGeeks: Traditional Programming vs ML](https://www.geeksforgeeks.org/machine-learning/traditional-programming-vs-machine-learning/)

#### 2.2 Neural Networks: The Building Blocks

**PM-level explanation:**
A neural network is layers of simple mathematical functions ("neurons") connected together.

- **Input layer:** Receives data (numbers representing text, images, etc.)
- **Hidden layers:** Transform data through weighted connections. Each neuron multiplies inputs by weights, adds them up, and applies an activation function (a non-linear transformation)
- **Output layer:** Produces the result (a classification, a prediction, generated text)

"Deep" learning = many hidden layers (typically dozens to hundreds). The "depth" allows the network to learn increasingly abstract representations. Early layers might detect edges in an image; middle layers detect shapes; later layers detect objects.

**Weights** are the learned parameters — numbers that get adjusted during training. GPT-4 is rumored to have ~1.8 trillion parameters across multiple expert networks. Claude and Gemini parameter counts are not publicly disclosed.

**Sources:**
- [AWS: What is a Neural Network?](https://aws.amazon.com/what-is/neural-network/)
- [IBM: What Is a Neural Network?](https://www.ibm.com/think/topics/neural-networks)
- [MIT News: Explained: Neural Networks](https://news.mit.edu/2017/explained-neural-networks-deep-learning-0414)
- [Google ML Crash Course: Nodes and Hidden Layers](https://developers.google.com/machine-learning/crash-course/neural-networks/nodes-hidden-layers)

#### 2.3 Types of Machine Learning

**Five types (verified via IBM, multiple academic sources):**

**1. Supervised Learning**
- Learns from labeled data (input-output pairs)
- Tasks: Classification (email → spam/not spam) and Regression (house features → price)
- Real-world examples: Fraud detection, medical diagnosis, spam filtering, credit scoring
- Requires: High-quality labeled data, which is expensive and time-consuming to create

**2. Unsupervised Learning**
- Finds patterns in unlabeled data
- Tasks: Clustering (group similar customers), dimensionality reduction, anomaly detection
- Real-world examples: Customer segmentation, recommendation systems, fraud detection (anomaly approach)
- Advantage: No labeled data needed. Disadvantage: Results harder to validate

**3. Semi-Supervised Learning**
- Combines small labeled dataset with large unlabeled dataset
- The labeled data guides learning on the larger body of unlabeled data
- Key techniques: Self-Training (model predicts labels for unlabeled data, adds high-confidence predictions to training set iteratively), Co-Training (two models trained on different feature subsets, each labels data for the other)
- Real-world: Medical imaging (few expert-labeled scans, many unlabeled)

**4. Self-Supervised Learning**
- Model generates its own supervision signal from the data itself
- Foundation model pre-training is self-supervised: predict the next token (GPT), or predict masked tokens (BERT)
- This is the key innovation that enabled foundation models — learn from vast amounts of text without manual labeling
- Dramatically reduces labeling costs; enables training on internet-scale data

**5. Reinforcement Learning**
- Agent learns through trial-and-error, maximizing cumulative reward
- No labeled data; instead, a reward function signals good/bad outcomes
- Real-world: Game playing (AlphaGo), robotics, recommendation optimization
- RLHF (Reinforcement Learning from Human Feedback) is how ChatGPT/Claude are aligned to be helpful

**Sources:**
- [IBM: Types of Machine Learning](https://www.ibm.com/think/topics/machine-learning-types)
- [IBM: Supervised vs. Unsupervised Learning](https://www.ibm.com/think/topics/supervised-vs-unsupervised-learning)
- [Lumen Alta: 5 Types of Machine Learning (2025)](https://lumenalta.com/insights/5-types-of-machine-learning)
- [Wikipedia: Self-supervised learning](https://en.wikipedia.org/wiki/Self-supervised_learning)

#### 2.4 Classification vs. Generation

This is the most important distinction for PMs deciding what AI can do for their product.

**Discriminative models (Classification/Prediction):**
- Learn boundaries between categories
- Answer: "Given this input, which category does it belong to?" or "Given this input, what number do I predict?"
- Model the conditional probability: P(label | data)
- Examples: spam detection, sentiment analysis, fraud detection, image classification, churn prediction
- Typically more accurate for classification tasks

**Generative models (Generation/Creation):**
- Learn the underlying distribution of data
- Answer: "What new data points would be consistent with the patterns I've learned?"
- Model the joint probability: P(data, label) or just P(data)
- Examples: text generation (GPT, Claude), image generation (DALL-E, Midjourney), code generation, music generation
- Can also be used for classification, but primary strength is creation

**PM decision framework: When to use which**
| Goal | Model type | Example products |
|------|-----------|-----------------|
| Sort, label, or score existing data | Discriminative/Classification | Spam filter, fraud detector, recommendation ranker |
| Create new content or handle open-ended input | Generative | Chatbot, writing assistant, image creator |
| Both (analyze then act) | Hybrid pipeline | Customer support (classify intent → generate response) |

**Sources:**
- [DataCamp: Generative vs Discriminative Models](https://www.datacamp.com/blog/generative-vs-discriminative-models)
- [Coursera: Discriminative vs Generative Models](https://www.coursera.org/articles/discriminative-vs-generative-models)
- [Plain Concepts: Discriminative AI vs Generative AI](https://www.plainconcepts.com/discriminative-ai-vs-generative-ai/)

#### 2.5 RLHF and Constitutional AI: How Models Get Aligned

**RLHF (Reinforcement Learning from Human Feedback):**
Three-stage process used by OpenAI, Anthropic, Google, and others:
1. **Pre-train** a language model on vast text (self-supervised — predicts next tokens)
2. **Train a reward model** on human preference rankings (humans compare two outputs and pick the better one)
3. **Fine-tune the LM** using PPO (Proximal Policy Optimization) to maximize the reward model's scores

Analogy (from Gun.io, verified): "Pre-training is reading every cookbook ever written. Fine-tuning is watching a chef demonstrate techniques. RLHF is developing taste — learning what actually makes food good."

**Constitutional AI (Anthropic):**
- Reduces dependence on human labelers by having AI critique and revise its own outputs
- The model checks its own answers against a set of explicit principles ("constitution")
- Generates synthetic preference data for training
- Published: Bai et al., "Constitutional AI: Harmlessness from AI Feedback," arXiv:2212.08073

**RLAIF (RL from AI Feedback):**
- By 2025, Google DeepMind demonstrated RLAIF can match or exceed RLHF performance while dramatically reducing costs
- Enables faster iteration on alignment without bottleneck of human labelers

**Sources:**
- [Gun.io: RLHF Explained (2025)](https://gun.io/news/2025/12/rlhf-explained-how-human-feedback-actually-trains-ai-models/)
- [Anthropic: Constitutional AI paper (arXiv:2212.08073)](https://arxiv.org/abs/2212.08073)
- [RLHF Book: Constitutional AI & AI Feedback](https://rlhfbook.com/c/13-cai)
- [IntuitionLabs: RLHF Explained](https://intuitionlabs.ai/articles/reinforcement-learning-human-feedback)

### Real-World Examples

1. **Netflix recommendation system:** Uses collaborative filtering (unsupervised) to cluster users by viewing patterns + supervised models to predict individual viewing likelihood. Hybrid approach.

2. **Tesla Autopilot (Karpathy era):** Software 2.0 in action — vision system uses deep learning trained on millions of labeled driving scenarios rather than hand-coded rules for every road situation.

3. **GitHub Copilot:** Generative model (based on OpenAI Codex/GPT) that creates new code, not a discriminative model that classifies code quality. This distinction matters for understanding what it can and cannot do.

4. **Gmail Smart Reply:** Discriminative model classifies the intent of incoming email, then a generative model produces short reply options. Pipeline of both model types.

### Common PM Misconceptions

1. **"AI = Machine Learning."** False. AI is the broad goal; ML is one method. Simple rule-based expert systems are AI but not ML. Not every AI feature needs ML — sometimes rules are cheaper, faster, and more explainable.

2. **"Deep learning is always better than traditional ML."** False. For structured/tabular data with clear features, traditional ML (gradient boosted trees, logistic regression) often outperforms deep learning and is far cheaper to train and run. Deep learning shines with unstructured data (images, text, audio).

3. **"You need massive data for any ML."** Depends on the approach. Transfer learning and fine-tuning mean you can adapt a pre-trained model with hundreds or thousands of examples, not millions. But you do need representative, clean data.

4. **"Unsupervised learning requires no data."** It requires no *labeled* data — but it still needs large volumes of raw data to find meaningful patterns.

5. **"Generative AI can do everything discriminative AI does."** While LLMs can be prompted for classification, purpose-built discriminative models are typically more accurate, faster, and cheaper for classification tasks.

### Decision Framework: Which ML Approach for Your Product?

**The Data-Task Matrix:**

| | I have labeled data | I have unlabeled data only |
|---|---|---|
| **I need to classify/predict** | Supervised learning (logistic regression, random forest, neural network) | Unsupervised (clustering, anomaly detection) or semi-supervised |
| **I need to generate/create** | Fine-tuned generative model (start from foundation model) | Foundation model with prompting or RAG |
| **I need to optimize a process** | Reinforcement learning | Reinforcement learning |

---

## Lesson 3: Probabilistic Thinking

### Core Concepts

#### 3.1 The Paradigm Shift: Deterministic to Probabilistic

**The central thesis (Gian Segato, "Building AI Products in the Probabilistic Era"):**

Software is undergoing a fundamental shift — from a world where code deterministically takes inputs and produces specific outputs, to one where machines produce **statistical distributions** instead.

**Traditional software:**
- Same input → same output, every time
- Behavior defined by explicit rules
- Bugs are reproducible
- Testing is binary: pass or fail

**AI-powered software:**
- Same input → potentially different output each time
- Behavior defined by learned statistical patterns
- "Bugs" may be probabilistic — intermittent, context-dependent
- Testing requires distributions: accuracy rates, confidence intervals, percentile analysis

**The fundamental mismatch (Segato):**
AI products have **deterministic costs but stochastic outputs**. Users insert the coin with certainty, but are uncertain whether they'll get back what they expect. This gap — between certain input and uncertain output — produces frustration that the industry hasn't yet learned to bridge.

**Sources:**
- [Gian Segato: "Building AI Products in the Probabilistic Era"](https://giansegato.com/essays/probabilistic-era)
- [DabApps: Navigating the Non-Deterministic Future of AI Apps](https://www.dabapps.com/insights/navigating-the-new-normal-embracing-uncertainty-and-the-non-deterministic-future-of-ai-apps/)
- [Kubiya: Deterministic AI vs Non-Deterministic AI](https://www.kubiya.ai/blog/deterministic-ai-vs-non-deterministic-ai)

#### 3.2 Two Types of Uncertainty

**Epistemic uncertainty** — uncertainty from limited data or model knowledge. Can be reduced with more/better data and training.
- Example: Model is uncertain about a rare medical condition because it saw few training examples

**Aleatoric uncertainty** — inherent randomness in the data itself. Cannot be reduced by more data.
- Example: Predicting exact stock prices — some randomness is fundamental

**Why this matters for PMs:**
- Epistemic uncertainty → invest in data quality and model improvement
- Aleatoric uncertainty → design the product to communicate and manage it (confidence scores, ranges, fallbacks)
- Confusing the two leads to wasted effort: trying to eliminate irreducible uncertainty, or accepting reducible uncertainty as "that's just how AI is"

**Sources:**
- [arXiv:2502.05244: Probabilistic Artificial Intelligence (Krause & Huebotter, 2025)](https://arxiv.org/abs/2502.05244)
- [ODSC: How Probabilistic AI is Redefining Decision-Making](https://odsc.medium.com/embracing-uncertainty-how-probabilistic-ai-is-redefining-decision-making-0f33b57387ae)

#### 3.3 Designing Products for Uncertainty

**Confidence scores and thresholds:**
Rather than returning hard yes/no answers, AI systems can return confidence levels. Product design must decide:
- What confidence threshold triggers an action vs. a human review?
- How to communicate uncertainty to users?

**Industry-specific thresholds (verified via practitioner sources):**
| Domain | Typical confidence threshold | Rationale |
|--------|----------------------------|-----------|
| Financial services | 90–95% | Monetary impact |
| Healthcare | 95%+ | Patient safety |
| Customer service (routine) | 80–85% | Low-risk, high-volume |
| Content moderation | 85–90% | Balance speed vs. accuracy |

**Escalation rates:**
- Target: 10–15% escalation to human review
- ~20%: Manageable operations
- ~60%: System is miscalibrated — too much goes to humans

**Compound uncertainty in multi-step systems:**
A three-agent chain with 90% individual confidence has only ~73% overall confidence (0.9^3). Multi-agent systems require more conservative thresholds.

**Sources:**
- [Ideafloats: Human-in-the-Loop AI Design Patterns (2025)](https://blog.ideafloats.com/human-in-the-loop-ai-in-2025/)
- [BP Rigent: AI Product Development — Probabilistic Features](https://www.bprigent.com/article/ai-product-development-probabilistic-features)
- [Smashing Magazine: Psychology of Trust in AI (2025)](https://www.smashingmagazine.com/2025/09/psychology-trust-ai-guide-measuring-designing-user-confidence/)

#### 3.4 UX Patterns for Probabilistic Products

**Pattern 1: Show confidence explicitly**
- Display confidence scores, bars, or badges
- Use clear language: "70% confident" rather than vague hedging
- Flag low-confidence outputs with suggested alternatives or source links

**Pattern 2: Graceful degradation**
- When confidence < threshold: offer retry options, sources, human escalation
- When AI fails: explain, apologize, suggest alternatives
- Never silently fail — silent failure destroys trust

**Pattern 3: Human-in-the-loop escalation**
- Set clear criteria for when human intervention triggers (confidence thresholds)
- Design seamless handoff from AI to human
- Track and learn from escalations to improve the model

**Pattern 4: Transparency over hiding**
- Acknowledging uncertainty improves credibility; hiding it damages trust
- Surface AI's confidence in its own outputs to prevent automation bias
- Be upfront about what AI cannot do

**Sources:**
- [Smashing Magazine: Designing for Agentic AI (2026)](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [Orange Loops: 9 UX Patterns for Trustworthy AI Assistants (2025)](https://orangeloops.com/2025/07/9-ux-patterns-to-build-trustworthy-ai-assistants/)
- [Shape of AI: UX Patterns for AI Design](https://www.shapeof.ai/)
- [Google PAIR Guidebook: Principles & Patterns](https://pair.withgoogle.com/guidebook/patterns)
- [AI UX Design Guide: Error Recovery & Graceful Degradation](https://www.aiuxdesign.guide/patterns/error-recovery)

#### 3.5 Evals: The New Core PM Skill

Traditional QA uses pass/fail tests. AI products require **evaluations (evals)** — systematic measurement of probabilistic output quality across multiple dimensions.

**Why evals matter (Productboard, Aakash Gupta, Product School — all 2025 sources agree):**
> "Your competitive advantage isn't which model you use — GPT-4, Claude, or open-source models are available to everyone — the real differentiation comes from how effectively you evaluate and improve performance."

**Key eval dimensions:**
- Accuracy / correctness
- Relevance to the query
- Tone and style consistency
- Safety (no harmful content)
- Hallucination rate
- Latency

**Building an eval framework (practical steps):**
1. Create "golden examples" — 50–100 diverse user queries with manually verified ideal responses
2. Define success criteria per dimension (what does "good" look like?)
3. Generate synthetic test data using LLMs to increase coverage
4. Compare model performance with A/B testing tools
5. Monitor in production — eval isn't a one-time event, it's continuous

**Tools for evals (2025 ecosystem):**
Promptfoo, RAGAS, DeepEval, LangSmith, LangFuse, TruLens, Arize Phoenix, MLflow, EvidentlyAI

**Sources:**
- [Productboard: AI Evals for Product Managers](https://www.productboard.com/blog/ai-evals-for-product-managers/)
- [Aakash Gupta: The AI Evaluation Revolution (2025)](https://aakashgupta.medium.com/the-ai-evaluation-revolution-why-every-product-manager-must-master-this-critical-skill-in-2025-0458c4ac6097)
- [Product School: AI Evals for PMs](https://productschool.com/blog/artificial-intelligence/ai-evals-product-managers)
- [Mind the Product: How to Implement Effective AI Evaluations](https://www.mindtheproduct.com/how-to-implement-effective-ai-evaluations/)

### Real-World Examples

1. **Grammarly:** Probabilistic suggestions with confidence indicators. Users see "correctness" vs. "clarity" vs. "engagement" with different confidence levels. The product doesn't silently change text — it suggests, explains, and lets users decide.

2. **Google Maps ETA:** Communicates uncertainty via ranges ("25–35 minutes") rather than false precision. The range width itself signals confidence.

3. **GitHub Copilot:** Returns multiple code suggestions, implicitly communicating that no single answer is "correct." Users learn to evaluate suggestions rather than blindly accepting.

4. **Medical AI (PathAI, etc.):** Never replaces diagnosis — augments it. Flags potential areas of concern for pathologist review, with explicit confidence scores. Human-in-the-loop is the product.

### Common PM Misconceptions

1. **"AI should aim for 100% accuracy."** Impossible for probabilistic systems. The real question is: what error rate is acceptable for this use case? And are errors distributed fairly across user groups?

2. **"We can test AI like we test traditional software."** Not with unit tests. You need statistical evaluation over distributions: accuracy rates, precision/recall, confidence calibration, fairness metrics.

3. **"Users don't notice non-determinism."** They do. When the same prompt returns different quality results, user trust erodes. Manage expectations and use temperature/seeding for consistency where it matters.

4. **"We'll launch when it's ready."** AI products are never "done" in the traditional sense. They require continuous monitoring, evaluation, and improvement. Launch when the error rate is acceptable, not when it's zero.

5. **"Fallback to human = failure."** No. Human-in-the-loop is a design pattern, not a failure mode. The best AI products design elegant escalation paths.

### Decision Framework: Uncertainty Tolerance Assessment

For each AI feature, assess:

| Dimension | Low tolerance (high stakes) | High tolerance (low stakes) |
|-----------|----------------------------|----------------------------|
| **Error cost** | Financial loss, safety risk, legal liability | Minor inconvenience, easily correctable |
| **Reversibility** | Irreversible action (send email, place order) | Reversible suggestion (draft, recommendation) |
| **User sophistication** | Novice users trust outputs blindly | Expert users validate and edit |
| **Volume** | Low volume, each case matters | High volume, statistical accuracy sufficient |

**Decision rules:**
- Low tolerance on any dimension → require human review, high confidence threshold, explicit uncertainty communication
- High tolerance on all dimensions → can automate with monitoring
- Mixed → hybrid approach with tiered confidence thresholds

---

## Lesson 4: Foundation Models

### Core Concepts

#### 4.1 What Are Foundation Models?

**Definition (Stanford HAI, 2021 — the canonical source):**
> "Foundation models are models trained on broad data at scale and are adaptable to a wide range of downstream tasks."
— Bommasani et al., "On the Opportunities and Risks of Foundation Models," Stanford CRFM, 2021 (100+ co-authors)

**Key properties:**
1. **Trained on broad data:** Not task-specific. Trained on internet-scale text, images, code, etc.
2. **At scale:** Billions to trillions of parameters, trained on trillions of tokens
3. **Adaptable:** Can be specialized for many different tasks through fine-tuning, prompting, or RAG — without retraining from scratch

**Why the term "foundation":**
The Stanford authors chose this term to emphasize that these models are both **critically central** (everything is built on top of them) and **incomplete** (they need adaptation for specific uses). Like a building's foundation — necessary but not sufficient.

**The paradigm shift:**
Before foundation models: Build a separate model for each task (spam detection, translation, summarization each required separate training)
After foundation models: One base model, adapted to many tasks. This is enabled by:
- **Self-supervised pre-training:** Learn general representations from unlabeled data
- **Transfer learning:** Pre-trained knowledge transfers to new tasks
- **Fine-tuning:** Adapt the general model to specific domains with relatively small datasets

**Sources:**
- [Bommasani et al.: "On the Opportunities and Risks of Foundation Models" (arXiv:2108.07258)](https://arxiv.org/abs/2108.07258)
- [Stanford HAI: Introducing CRFM](https://hai.stanford.edu/news/introducing-center-research-foundation-models-crfm)
- [Stanford CRFM Report](https://crfm.stanford.edu/report.html)

#### 4.2 Why Foundation Models Changed Everything

**Three revolutionary properties:**

**1. Emergent capabilities**
As models scale, they develop capabilities that were not explicitly trained for. A model trained purely to predict next tokens can perform translation, summarization, reasoning, and coding — capabilities that "emerge" from scale.

**Important caveat (2025 research):** Whether these capabilities appear "suddenly" or "gradually" is debated. A March 2025 survey (arXiv:2503.05788) shows that many reported "sudden" abilities may be artifacts of discontinuous evaluation metrics. When measured with continuous metrics, improvements are often more gradual.

**2. Homogenization**
The same foundation model underlies many different applications. This creates efficiency (shared development costs) but also concentration risk (a flaw in the foundation affects everything built on top).

**3. Democratization through adaptation**
Previously, building an AI system required massive ML teams and infrastructure. Now, a product team can:
- Prompt a foundation model (zero effort, low cost)
- Fine-tune with 100s–1000s of examples (moderate effort)
- RAG: ground the model in proprietary data at query time (moderate effort, no retraining)

**Sources:**
- [Georgetown CSET: Emergent Abilities in LLMs Explainer](https://cset.georgetown.edu/article/emergent-abilities-in-large-language-models-an-explainer/)
- [arXiv:2503.05788: Emergent Abilities in LLMs Survey (March 2025)](https://arxiv.org/abs/2503.05788)
- [Stanford HAI: Reflections on Foundation Models](https://hai.stanford.edu/news/reflections-foundation-models)

#### 4.3 The Current Landscape (as of March 2026)

**Closed-Source (Proprietary) Models:**

| Provider | Key models | Strengths | Notes |
|----------|-----------|-----------|-------|
| **OpenAI** | GPT-5.2, o3 (reasoning) | Broad capabilities, strong coding, large ecosystem | GPT-5 claims 80% fewer hallucinations vs GPT-4. Unified system dynamically adjusts compute per request. |
| **Anthropic** | Claude Opus 4.6, Sonnet 4.6 | Instruction following, safety, long context (200K+) | Trained with Constitutional AI. Known for agentic coding. ASL-3 safety standard for Opus. |
| **Google** | Gemini 3 Pro, Flash, Flash-Lite | Multimodal native, massive context (1M+), competitive pricing | Built multimodal from day one. Deep reasoning + agentic functions. |

**Open-Source / Open-Weight Models:**

| Provider | Key models | Strengths | Notes |
|----------|-----------|-----------|-------|
| **Meta** | Llama 4 Scout, Maverick | 10M token context, strong community | Open-weight, active fine-tuning ecosystem |
| **DeepSeek** | V3.2-Speciale | Matches frontier model performance, MIT license | Won gold at 2025 IMO and IOI. Remarkable efficiency. |
| **Alibaba** | Qwen 3 family | Hybrid thinking modes (fast "non-thinking" + slow "thinking") | Toggle between modes with a single parameter |
| **Mistral** | Various | European AI, strong multilingual | Important for EU data sovereignty requirements |

**Multimodal capabilities (2025–2026):**
Modern foundation models are increasingly multimodal — processing text, images, audio, and video in unified frameworks. Gemini was built multimodal from day one; GPT-4V and Claude added vision; newer models handle audio and video natively. Gemini 2.0 Flash supports multimodal *output* too (generated images mixed with text, text-to-speech).

**Sources:**
- [Promptitude: Ultimate 2025 AI Language Models Comparison](https://www.promptitude.io/post/ultimate-2025-ai-language-models-comparison-gpt5-gpt-4-claude-gemini-sonar-more)
- [Atoms.dev: 2025 LLM Review](https://atoms.dev/blog/2025-llm-review-gpt-5-2-gemini-3-pro-claude-4-5)
- [Xavor: Claude vs ChatGPT vs Gemini vs Llama (2026)](https://www.xavor.com/blog/claude-vs-chatgpt-vs-gemini-vs-llama/)
- [Anthropic System Cards](https://www.anthropic.com/system-cards)
- [LM Council Benchmarks (March 2026)](https://lmcouncil.ai/benchmarks)

#### 4.4 Open vs. Closed: The Decision

**Performance comparison:**
- Closed models lead on comprehensive benchmarks (e.g., GPT-4: ~86.4% MMLU vs Llama 3 70B: 78.5%)
- But the gap is narrowing: open-source models improve ~3x faster year-over-year
- For many everyday tasks (writing, Q&A, summarization, coding), good open-source models are "indistinguishable" from closed ones

**Cost comparison:**
- Closed: $1.86/million tokens average
- Open (self-hosted): $0.23/million tokens average
- Delta: Closed costs ~87% more (MIT Sloan research)
- Despite this, users choose closed models 80% of the time (convenience, support, ecosystem)

**Decision dimensions:**

| Factor | Favors Open | Favors Closed |
|--------|-------------|---------------|
| **Data privacy / sovereignty** | Full control, data stays on your infrastructure | Data processed on provider's servers |
| **Customization / fine-tuning** | Full access to weights, unlimited fine-tuning | Limited fine-tuning via API |
| **Vendor lock-in risk** | No dependency on single provider | API changes, pricing changes, policy changes affect you |
| **Upfront effort** | Significant: hosting, MLOps, monitoring | Minimal: API call and go |
| **Peak performance** | Good enough for 80% of tasks | Best for frontier reasoning, complex tasks |
| **Enterprise support / compliance** | DIY compliance | SLAs, audit trails, compliance certifications |
| **Speed to market** | Slower (infrastructure setup) | Faster (API-first) |

**2026 production pattern (verified across multiple enterprise sources):**
Most production systems use a **hybrid routing approach**:
- Route 80% of requests to a fast, cheap open-source model
- Escalate the 20% requiring maximum capability to a frontier closed model
- This reduces costs by 70–80% while maintaining quality

**Sources:**
- [MIT Sloan: AI Open Models Have Benefits. Why Aren't They More Widely Used?](https://mitsloan.mit.edu/ideas-made-to-matter/ai-open-models-have-benefits-so-why-arent-they-more-widely-used)
- [California Management Review (UC Berkeley): The Coming Disruption — Open-Source AI (Jan 2026)](https://cmr.berkeley.edu/2026/01/the-coming-disruption-how-open-source-ai-will-challenge-closed-model-giants/)
- [Let's Data Science: Open Source vs Closed LLMs — 2026 Decision Framework](https://www.letsdatascience.com/blog/open-source-vs-closed-llms-choosing-the-right-model-in-2026)
- [Hatchworks: Open-Source LLMs vs Closed — Guide (2026)](https://hatchworks.com/blog/gen-ai/open-source-vs-closed-llms-guide/)

#### 4.5 Key Techniques Built on Foundation Models

**RAG (Retrieval-Augmented Generation):**
- Pair a foundation model with an external knowledge source
- At query time, retrieve relevant documents, inject them into the context, then generate
- Benefits: Reduces hallucinations, enables proprietary data use, avoids expensive fine-tuning
- "Rather than spending weeks fine-tuning a model, RAG injects data at query time, delivering many benefits of a custom-trained model with far less expense." (IBM)

**Fine-tuning:**
- Adapt a pre-trained foundation model for specific tasks using smaller, domain-specific datasets
- Adjusts the model's weights to specialize its behavior
- Costs more than RAG but can achieve deeper specialization
- "Fine-tuning provides the best of both worlds: leveraging broad knowledge from pre-training and honing understanding of specific concepts." (IBM)

**Prompt engineering:**
- Crafting inputs to elicit desired outputs without changing the model
- Zero-shot (no examples), few-shot (include examples in the prompt), chain-of-thought (ask model to reason step by step)
- Lowest cost, fastest iteration, but most fragile

**The adaptation spectrum:**
```
Prompting → RAG → Fine-tuning → Training from scratch
   ←  Less effort, less control  |  More effort, more control  →
   ←  Faster iteration           |  Deeper specialization      →
   ←  Lower cost                 |  Higher cost                →
```

**Sources:**
- [IBM: What is RAG?](https://www.ibm.com/think/topics/retrieval-augmented-generation)
- [AWS: What is RAG?](https://aws.amazon.com/what-is/retrieval-augmented-generation/)
- [IBM: What is Fine-Tuning?](https://www.ibm.com/think/topics/fine-tuning)
- [Langflow: Transfer Learning, Pre-Training, or Fine-Tuning?](https://www.langflow.org/blog/transfer-learning-pre-training-or-fine-tuning)
- [Product School: RAG for Product Managers](https://productschool.com/blog/artificial-intelligence/rag-product-managers)

#### 4.6 Build vs. Buy vs. Blend

**Framework (from MarkTechPost, SVPG, multiple 2025 enterprise sources):**

**Build** when:
- The capability is your competitive advantage
- Involves sensitive regulatory data (PHI, PII, financials)
- Requires deep integration into proprietary systems
- You have (or can recruit) the ML talent

**Buy (API)** when:
- The use case is commoditized (chatbot, summarization, translation)
- Speed-to-value determines success
- Vendor brings compliance coverage you lack
- You lack internal ML infrastructure

**Blend** (the dominant 2026 approach):
- Buy vendor platforms for: governance, audit trails, multi-model routing, compliance
- Build the last mile: custom retrieval, tool adapters, evaluation datasets, domain-specific guardrails
- Use a scoring model: Rate each dimension (strategic importance, data sensitivity, customization need, speed requirement, cost) 1–5 and weight by importance
- Decision rules: Build if Build score > Buy by 20%. Buy if vice versa. Blend if within 20%.

**Sources:**
- [MarkTechPost: Build vs Buy for Enterprise AI (2025)](https://www.marktechpost.com/2025/08/24/build-vs-buy-for-enterprise-ai-2025-a-u-s-market-decision-framework-for-vps-of-ai-product/)
- [SVPG: Build vs Buy in the Age of AI](https://www.svpg.com/article-build-vs-buy-in-the-age-of-ai/)
- [Product School: Build vs Buy (2026)](https://productschool.com/blog/leadership/build-vs-buy)

### Real-World Examples

1. **Duolingo:** Uses GPT-4 for conversational practice (API/Buy approach), but built proprietary evaluation and curriculum systems (Build). Classic blend pattern.

2. **Shopify Sidekick:** Built on foundation models (API access), but the value is in the proprietary e-commerce data integration and merchant-specific context (Build the last mile).

3. **Bloomberg:** Built BloombergGPT — a domain-specific foundation model trained on 40+ years of financial data. Example of when building from scratch makes sense: unique data + competitive advantage + regulatory requirements.

4. **DeepSeek disruption (2025):** Demonstrated that open-source models can match frontier performance at dramatically lower cost. Won gold medals at IMO and IOI. Published under MIT license. Changed the open vs. closed calculus overnight for many organizations.

### Common PM Misconceptions

1. **"Foundation models are products."** No. They are infrastructure. A foundation model alone is like a CPU — powerful but useless without a system around it. The product is the system you build on top: prompts, data pipeline, evaluation, UI, guardrails.

2. **"Bigger model = better for my use case."** Not necessarily. A smaller, well-tuned model often outperforms a larger general model for specific tasks, at lower cost and latency. GPT-5 for a simple classification task is like using a Formula 1 car for grocery shopping.

3. **"Open source = free."** The model weights are free. Hosting, GPUs, monitoring, MLOps, security — those cost money and require expertise. Open source shifts cost from per-token API fees to infrastructure investment.

4. **"We should wait for the next model."** The model landscape improves every quarter. If you wait for the "perfect" model, you never ship. Build evaluation frameworks now; swap models later. The product layer is your moat, not the model.

5. **"One model fits all."** Production systems increasingly use multiple models: fast/cheap for simple tasks, powerful/expensive for complex ones. Model routing is a core architectural decision.

6. **"Fine-tuning is always better than RAG."** RAG is often sufficient and far cheaper. Fine-tuning is for changing model behavior (style, format, domain reasoning), not for adding factual knowledge (that's RAG's job).

### Decision Framework: Foundation Model Selection

**Step 1: Define requirements**
| Requirement | Question |
|-------------|----------|
| Task type | Classification, generation, reasoning, multimodal? |
| Latency | Real-time (<500ms), interactive (<3s), batch (minutes ok)? |
| Volume | Requests per day/hour? |
| Data sensitivity | Can data leave your infrastructure? |
| Accuracy threshold | What error rate is acceptable? |
| Budget | Per-request cost ceiling? |

**Step 2: Map to model category**
| Need | Approach |
|------|---------|
| Fast, cheap, good enough | Open-source (Llama 4, Qwen 3, DeepSeek) or Gemini Flash |
| Maximum quality, don't mind cost | Claude Opus 4.6, GPT-5.2, Gemini 3 Pro |
| Data must stay local | Open-source, self-hosted |
| Multimodal (images, audio) | Gemini (native), GPT-5 (vision), Claude (vision) |
| Long context (>200K tokens) | Gemini (1M+), Llama 4 Scout (10M), Claude (200K, 1M beta) |

**Step 3: Validate with evals**
Never choose based on benchmarks alone. Build task-specific evaluations with your actual data and use cases.

---

## Synthesis Connectors (Lesson 5)

The four lessons connect into a unified understanding:

1. **LLMs think in tokens and probabilities** (Lesson 1) → which means they are fundamentally **non-deterministic** (Lesson 3) → which requires new product design patterns

2. **ML has many paradigms** (Lesson 2) → foundation models use **self-supervised learning** at scale (Lesson 4) → this is why they can be adapted to many tasks without task-specific training

3. **Classification vs. generation** (Lesson 2) → maps to **discriminative vs. generative** → most AI products combine both in pipelines

4. **Hallucinations** (Lesson 1) → are a structural consequence of **probabilistic prediction** (Lesson 3) → mitigated by **RAG grounding on foundation models** (Lesson 4)

5. **Temperature and sampling** (Lesson 1) → are the PM's controls for managing the **creativity-accuracy tradeoff** (Lesson 3) → applied to **foundation model APIs** (Lesson 4)

**The meta-insight:** AI product management is fundamentally about **managing uncertainty** — in model outputs, in user expectations, in the rapidly evolving model landscape, and in organizational understanding of what AI can and cannot do.

---

## Key Reference Works

| Source | Type | Relevance |
|--------|------|-----------|
| Chip Huyen, *AI Engineering* (O'Reilly, 2025) | Book (Rank 2) | Foundation model systems design, practical patterns, RAG, evaluation |
| Chip Huyen, *Designing Machine Learning Systems* (O'Reilly, 2022) | Book (Rank 2) | ML systems in production, data quality, monitoring |
| Vaswani et al., "Attention Is All You Need" (2017) | Paper (Rank 1) | The transformer architecture underlying all LLMs |
| Bommasani et al., "On the Opportunities and Risks of Foundation Models" (2021) | Paper (Rank 1) | Canonical definition and analysis of foundation models |
| Kalai et al., "Why Language Models Hallucinate" (OpenAI, 2025) | Paper (Rank 1) | Structural causes of hallucinations |
| Bai et al., "Constitutional AI" (Anthropic, 2022) | Paper (Rank 1) | Anthropic's alignment approach |
| Gian Segato, "Building AI Products in the Probabilistic Era" | Essay (Rank 3) | Product design paradigm shift framework |
| Simon Willison's blog (simonwillison.net) | Blog (Rank 3) | Practical LLM building advice, security, agents |
| Andrej Karpathy, "Software 2.0" (2017) + lectures | Essay/Talks (Rank 3) | Programming paradigm shift, LLM intuition |
| a16z, "5 Principles for PMs in the AI Era" (2025) | Framework (Rank 2) | PM-specific guidance on evals, interviewing models |
| Reforge AI Product courses (2025) | Course (Rank 2) | AI product management frameworks |
| Google PAIR Guidebook | Guide (Rank 1) | Official UX patterns for AI products |
| Stanford CRFM Foundation Model Transparency Index (Dec 2025) | Report (Rank 1) | Transparency assessment of major models |

---

## Uncertain / Needs Verification

The following claims were found in multiple sources but could not be verified against primary/peer-reviewed sources:

1. **GPT-4 parameter count (~1.8T across MoE):** Widely reported but never officially confirmed by OpenAI. Mark as "rumored" if used.

2. **"80% fewer hallucinations in GPT-5 vs GPT-4":** OpenAI marketing claim. Independent benchmarks show improvement but the exact percentage varies by evaluation method.

3. **Exact cost savings percentages for hybrid routing (70–80%):** Reported by multiple enterprise sources but depends heavily on traffic patterns and use case mix. Use as "approximate" with context.

4. **"Open-source models improve 3x faster year-over-year":** Cited in multiple practitioner sources but measurement methodology unclear. Directionally accurate — the gap is narrowing — but the exact multiplier is imprecise.
