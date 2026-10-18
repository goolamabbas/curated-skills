---
name: pplx-decision
description: >-
  Build, port, evaluate, or explore applications using Perplexity Decisions
  (/v1/decisions, pplx-decider models) for probabilistic yes/no, choice, and
  rubric judgments. Use for Perplexity decision-model integrations, project-fit
  assessments, and TypeSafe/Jev-to-Perplexity migrations; not general Perplexity
  search or TypeSafe-only work.
---

# Build with Perplexity Decisions

Start from the user-visible behavior and identify the semantic judgments
it requires. Keep deterministic rules and execution in application code.
Preserve the user's stack and requested scope.

## Choose the relevant guidance

- To investigate opportunities in an existing project, read
  [project-opportunities.md](references/project-opportunities.md).
- To implement or troubleshoot an integration, read
  [implementation.md](references/implementation.md).
- To compare models, validate thresholds, or measure a workflow, read
  [evaluation.md](references/evaluation.md).
- To migrate a TypeSafe/Jev workflow, read
  [porting-from-typesafe.md](references/porting-from-typesafe.md).

Load only what the task needs. Audit when assessing project fit or when
unresolved architecture affects the work; concrete integrations need no
mandatory audit. The exploration companion includes patterns and cookbook links.

## Consult current documentation

Use Perplexity documentation as the source of truth:

- Index: https://docs.perplexity.ai/llms.txt
- Quickstart: https://docs.perplexity.ai/docs/decisions/quickstart.md
- Request/response schema: https://docs.perplexity.ai/api-reference/decisions-post.md

Check relevant current documentation before implementing or claiming current models,
limits, pricing, or performance; reuse sufficient documentation already checked
in the task. If Markdown retrieval fails, try the ordinary page.

For a dated baseline or unavailable docs, use [api-snapshot.md](references/api-snapshot.md).
Follow current docs over the snapshot and surface material contradictions.
Use documented request fields and verified SDK interfaces.

## Preserve the important distinctions

Use `noul` for yes/no probability, `choice` for an option, and `score` for an
ordered rubric. `noul` has no separate confidence field; near 0.5 means
uncertainty, not medium intensity.

Treat probabilities as model judgments requiring task-specific validation.
Keep confidence distinct from the probability of the selected answer.

Question grouping is part of the model input. Current v1.2 models see
other questions in the request; do not import Jev's independence assumption.

Use a separate component when the workflow needs generated prose,
retrieval, or execution. Validate permissions and action arguments in code.

## Complete the requested work

For exploration, deliver grounded opportunities and a decisive next
experiment. For implementation, complete the requested integration and
verify the affected behavior within the available environment.

State what was inspected, implemented, and tested. Distinguish live API
results from mocked tests and unmeasured proposals. Respect the user's
requested review or deployment boundary.
