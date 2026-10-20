# Investigate Perplexity Decisions opportunities

Use this guide to assess what the Perplexity Decisions API could make
possible in an existing project. It can also serve as a standalone
project-investigation prompt.

Treat semantic judgments as software operations: the API returns yes/no
probabilities, option choices, and rubric scores that application code combines.

Aim for a recommendation grounded in the code and user outcomes.
Explore ambitious possibilities without assuming adoption is worthwhile.
An investigation does not itself authorize production changes.

## Establish the evidence

Consult the current Perplexity Decisions quickstart:
https://docs.perplexity.ai/docs/decisions/quickstart.md

Use the documentation index for additional relevant material:
https://docs.perplexity.ai/llms.txt

For exact requests use the [endpoint schema](https://docs.perplexity.ai/api-reference/decisions-post.md).
Reuse relevant docs already checked for the task. If live docs are unavailable,
use the [dated baseline](api-snapshot.md). When using this guide without companion
files, use the direct official links.

Inspect enough of the project to understand its purpose, relevant execution
paths, data, and operating constraints. Follow evidence into additional
files as needed; a complete repository survey is not a prerequisite.

Look for repeated processing of the same context and unnecessarily sequential
judgments. Evaluate reuse, stage changes, or concurrent requests within the
provider's grouping and capacity constraints.

Separate:

- Documented provider behavior.
- Measurements from this project.
- Estimates and hypotheses.

Tie findings to concrete code paths or observed workflows and identify material
evidence gaps.

## Look for consequential opportunities

If useful judgments fit this product's quality, cost, and response-time budgets,
what would we design differently? Give new capabilities explicit attention
alongside improvements to existing workflows.

Consider three outcomes:

- Lower total cost or latency for existing behavior.
- Better quality, coverage, or responsiveness.
- Useful capabilities the product does not currently attempt.

Look for semantic decisions hidden inside generated text, brittle
heuristics, manual handling, or coarse filtering. Also examine behavior
excluded from the product because richer interpretation appeared too
expensive or slow.

Identify specific architecture assumptions caused by the former cost of semantic
processing: sampling, delayed review, discarded context, or limited coverage.
Explain what could change if the proposed quality, capacity, and economics hold.

Do not limit the investigation to existing model calls. Consider whether
semantic understanding could improve search, navigation, intake,
personalization, prioritization, or feedback.

For each promising idea, explain which current constraint it relaxes
and what the user gains. Prefer project-specific proposals over generic
lists of AI features.

## Consider useful patterns

Use these as starting points, not a required checklist. Read the relevant cookbook
before adapting its design; examples do not override current model guidance.

| Pattern | Starting example | Grouping consideration |
| --- | --- | --- |
| Route and escalate | [Ticket triage](https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-ticket-triage/README.md) | Test related facets together on Standard. Hosted Flash evaluates questions separately and bills state per question, even in a multi-question request. |
| Select instead of generate; rerank | [Quote finder](https://docs.perplexity.ai/docs/cookbook/examples/decisions-quote-finder/README.md) | Start independent candidate scores in separate requests; deliberate comparison is a different design to evaluate. |
| Verify claims and repair | [Answer gate](https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-answer-gate/README.md) | Isolate independent claims; retain joint evidence where the judgment depends on relationships. |
| Check proposed actions | [Action gate](https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-action-gate/README.md) | Related checks of one action may group on Standard; isolate independent proposed actions. Code still enforces permission. |
| Respond to changing state | [Browser agent](https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-browser-agent/README.md) | Related judgments of one observation may group on Standard; a newly observed state is a new stage. |

## Make the strongest ideas concrete

For each serious candidate, identify:

- The user problem and current behavior.
- The integration point and available evidence.
- Available input fields and their sources, plus evidence that must be retrieved
  before the judgment.
- The proposed questions and suitable decision types.
- The application rules that consume the answers.
- Remaining retrieval, generation, or deterministic work.
- The principal failure mode and likely implementation effort.

Include representative request shapes and consumer pseudocode where they
would resolve uncertainty. Verify their API contract first.

Do not hide a complex reasoning task inside a vague classification question.
Show that the decomposition preserves evidence and relationships needed for the
decision, including work that still needs deeper reasoning.

Choose grouping deliberately. Distinguish related judgments about one
item from independently scored candidates. Evaluate standard and Flash
with their documented grouping guidance rather than assuming putting questions
in the same request is behaviorally neutral.

When a later decision needs newly retrieved evidence or options selected
by an earlier result, represent it as a separate workflow stage.

## Challenge the business case

Compare the proposal with the current implementation and credible simpler
alternatives. These may include deterministic rules, caching, retrieval,
embeddings, conventional classifiers, or a generative model.

Estimate the entire path: input preparation, inference, network overhead,
retries, review, fallbacks, and downstream work caused by mistakes.

Identify the latency-critical steps and expected workload. Distinguish
per-request speed from user-visible response time.

Estimate required RPS as actions per second times requests per action, allowing
for retries and other organizational traffic. Compare it with the current shared
request and token limits in the quickstart or [baseline](api-snapshot.md#limits-and-images).
Include headroom and evaluate queueing under load. Dividing request count by the
RPS limit estimates nominal capacity consumption, not exact elapsed time.
Consider prefiltering candidates, smaller relevant state, or staged processing
before assuming every candidate needs inference.

Use measured values when available. Otherwise state assumptions and break-even
conditions, then test the proposal against the project's workload.

For uncertain inputs that could change the recommendation, give plausible ranges
and show where the conclusion changes.

## Resolve the most important uncertainty

Use [evaluation.md](evaluation.md) when designing an experiment. If this prompt
is being used without that file, define representative held-out cases, a baseline,
asymmetric error costs, repeated boundary cases, and end-to-end workload measures.

Where relevant, test missing or conflicting evidence, sensitivity to wording and
grouping, and abstention/fallback behavior.

Choose a small experiment that could overturn the recommendation.
Define the baseline, representative cases, relevant error costs, and
a practical acceptance criterion.

Run it when the user's request allows live calls and data, credentials, and an
established budget permit.
Otherwise provide a runnable design and identify what remains unmeasured.
Do not let unavailable credentials prevent useful architectural analysis.

## Deliver an actionable assessment

Provide:

- A concise assessment of the opportunity.
- A ranked table separating savings, improvements, and new capabilities.
- Concrete designs for the strongest candidates, up to three.
- The smallest experiment that would change the decision.
- Important rejected ideas and why they did not survive scrutiny.

When a substantial opportunity survives, include a brief sketch of how the
relevant product behavior could be designed today, rather than only replacing
calls inside the existing architecture. Omit that detour for narrow tasks.

Scale the depth to the project and evidence. Recommend no integration
when the benefits do not justify the complexity.
