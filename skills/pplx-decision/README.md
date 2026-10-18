# Perplexity Decisions

Build applications that use Perplexity Decisions for structured judgments: yes/no probabilities, choices, and rubric scores. Explore project opportunities, implement an integration, evaluate its behavior, or migrate a TypeSafe/Jev workflow.

Use this skill when a product needs to interpret context and turn that interpretation into a decision application code can use. It starts with the intended user outcome and keeps deterministic rules, permissions, and execution in code.

## When to use it

- Investigate where contextual judgments could improve an existing product.
- Implement a Perplexity Decisions integration within your current stack.
- Design an evaluation of decision quality, thresholds, cost, and latency.
- Port a TypeSafe/Jev workflow while checking differences in request grouping and answer interpretation.

This is a software-building skill, not a general Perplexity search tool. A direct code change is usually enough when the rule is deterministic. It can recommend against an integration if the benefits do not justify the complexity.

## Copyable examples

These are starting prompts, not recorded API runs.

### Explore a project before editing

```text
Use the pplx-decision skill to assess this repository for useful Perplexity
Decisions integrations. Identify the strongest opportunity, explain the user
benefit and tradeoffs, and propose a small experiment that could change your
recommendation. Give recommendations only; do not modify files or make paid calls.
```

### Build a focused integration

```text
Use the pplx-decision skill to add support-ticket triage to this application.
Preserve the existing stack. Keep permissions and actions in application code,
handle missing or invalid results explicitly, and include offline tests.
Treat routing thresholds as provisional until evaluated on representative tickets.
Do not deploy or make live API calls yet.
```

### Evaluate an existing workflow

```text
Use the pplx-decision skill to evaluate this decision workflow.
Inspect the questions, grouping, answer handling, and action thresholds.
Propose representative held-out cases and compare against the current baseline.
Distinguish fixture checks from measurements that require live calls.
```

### Port a TypeSafe/Jev workflow

```text
Use the pplx-decision skill to port this TypeSafe/Jev integration to Perplexity
Decisions. Inspect the existing request builder, answer consumer, and tests.
Preserve the intended product behavior, identify assumptions that do not transfer,
and verify the revised application logic with offline tests. Do not deploy.
```

## What to provide

Share the project or relevant files, the intended decision, and the constraints that matter: acceptable errors, response time, budget, and review requirements. State whether you want recommendations, implementation, or evaluation. For live measurements, specify the permitted data and spending boundary; keep credentials outside prompts and source files.

## What to expect

For exploration, expect a grounded recommendation and a small next experiment. For implementation, expect code and verification within the requested scope. For evaluation or migration, expect explicit assumptions, comparisons, and remaining measurement gaps.

The skill checks current documentation when implementing or making current API claims. Its bundled API snapshot is a dated reference, not a promise that models, limits, or prices remain unchanged. Model probabilities and confidence are not proof of accuracy; evaluate them against the decisions your application will make.

Installing the skill provides instructions, not API credentials or service access. Live inference requires access to the provider and may incur charges. Useful project analysis and offline tests can proceed without live calls.

## Supporting guidance

The agent loads the references relevant to the task:

- [Project opportunities](references/project-opportunities.md): investigate improvements and new capabilities.
- [Implementation](references/implementation.md): request design, answer handling, and operational failures.
- [Evaluation](references/evaluation.md): representative cases, thresholds, and whole-workflow measurements.
- [Porting from TypeSafe/Jev](references/porting-from-typesafe.md): preserve decisions while revisiting provider assumptions.
- [Dated API snapshot](references/api-snapshot.md): documented baseline and its evidence limits.

## Origin and license

Created by Yusuf Goolamabbas and contributed to this collection from his personal `pplx-decision` skill. The original instructions and five reference files are preserved. This is an independent guide, not an official Perplexity or TypeSafe publication.

[MIT](LICENSE). Keep the license notice with copies of this skill.

[Read the agent instructions (SKILL.md)](SKILL.md) · [Back to all skills](../../README.md)
