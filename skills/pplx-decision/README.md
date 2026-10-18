# Perplexity Decisions

Build applications with Perplexity Decisions: models that turn information and focused questions into structured judgments your software can use. This skill helps a coding agent explore opportunities, build an integration, evaluate it, or migrate from TypeSafe/Jev.

## What is a decision model?

A decision model interprets information and returns answers that software can act on: a yes/no probability, a choice from supplied options, or a score against defined criteria. Your application sends it data through an **API**, the interface for requesting those judgments and receiving the results.

For example, a support application might ask whether a customer has lost data, which team should handle the ticket, and how severe the disruption is. The model judges the message; your code decides whether to escalate it or ask a person to review it.

**Context + questions → model judgments → application rules → action or review.**

### State, questions, and answers

**State** is the information available for a decision: a message, document, image, or relevant application data. **Questions** describe what to judge, including the options or scoring criteria. Both providers below support three question types:

| Type | Illustrative question | Result |
| --- | --- | --- |
| Yes/no (`noul`) | Does this ticket report lost data? | A probability of yes, from 0 to 1. |
| Choice (`choice`) | Which team should handle it? | The selected option and probabilities for the supplied options. |
| Rubric (`score`) | How serious is the disruption? | A numerical score and probabilities across defined severity levels. |

These are illustrative questions, not recorded model results. A high probability is a model judgment, not proof. Test your questions and action thresholds on representative examples.

### Jev, TypeSafe, and Perplexity Decisions

**TypeSafe** provides **Jev**, its flagship decision model. It calls this approach “System One”: focused judgments that software combines using explicit rules. The [TypeSafe introduction](https://docs.typesafe.ai/introduction) explains the pattern.

**Perplexity Decisions** is Perplexity’s API for its **`pplx-decider` models**. They return structured judgments; they do not write replies, generate code, or explain their reasoning. See the [Perplexity Decisions quickstart](https://docs.perplexity.ai/docs/decisions/quickstart).

These are separate services with different behavior. For example, TypeSafe documents independent question evaluation, while Perplexity’s v1.2 models see the other questions in the same request. Moving between them requires checking those assumptions.

### Where this skill fits

The **`pplx-decision` skill instructs your coding agent** on designing and building a Perplexity integration. The **decision model runs inside the application workflow** through API calls. Installing the skill does not provide the model service or API credentials.

Use ordinary code for exact rules, such as checking whether a date has passed. Consider a decision model when interpreting meaning or context is the hard part. If the workflow also needs a written reply, retrieval, or an action, connect the appropriate components; application code controls what happens next.

## When to use it

- Investigate where contextual judgments could improve an existing product.
- Implement a Perplexity Decisions integration within your current stack.
- Design an evaluation of decision quality, thresholds, cost, and latency.
- Port a TypeSafe/Jev workflow while checking differences in request grouping and answer interpretation.

This is a software-building skill, not a general Perplexity search tool. A direct code change is usually enough when the rule is deterministic. It can recommend against an integration if the benefits do not justify the complexity.

## Copyable examples

These are starting prompts, not recorded API runs. Choose the scope before you copy:

| Starting point | Prompt |
| --- | --- |
| Existing project; deciding where Decisions would help | [Explore before editing](#explore-a-project-before-editing) |
| Existing project; a specific integration is already chosen | [Build a focused integration](#build-a-focused-integration) |
| New project; you have state and questions in mind | [Build from state and questions](#build-a-new-project-from-state-and-questions) |

A concrete integration does not require a broad opportunity audit. The skill already supplies documentation, grouping, and validation guidance; use the prompts to describe your project and intended outcome.

If supplying files manually instead of installing the skill, include `SKILL.md` and the complete `references/` folder so the linked guidance remains available.

### Explore a project before editing

```text
Use the pplx-decision skill to assess this project.

Project: [repository/path]
Goal: [user problem or behavior to improve]
Constraints: [stack, workload, latency, cost, privacy, or other requirements]

Inspect the relevant code and assess where Perplexity Decisions could improve
existing behavior or enable useful capabilities. Audit enough of the architecture
to support recommendations within my goal.

For the strongest opportunity, identify the available state and its sources,
proposed questions, integration points, and application behavior after the answers.
Compare simpler alternatives and propose the smallest useful experiment.

Keep this pass read-only. Give recommendations and a proposed implementation scope;
do not modify files or make live API calls.
```

### Build a focused integration

```text
Use the pplx-decision skill to implement this integration.

Project: [repository/path]
Behavior to add or change: [specific outcome, such as support-ticket triage]
Available state and sources: [fields, representative data, or relevant files]
Behavior after the answers: [routes, rankings, flags, actions, or UI changes]
Constraints: [requirements to preserve]

Implement this behavior in the existing stack. Investigate architecture only where
needed to resolve implementation decisions; skip a broad opportunity audit.
Verify the affected behavior with offline tests and report remaining live-evaluation
needs. Do not deploy or make live API calls yet.
```

### Build a new project from state and questions

```text
Use the pplx-decision skill to build a new project.

Product goal: [what users should be able to do]
Preferred stack and location: [details, or recommend a simple stack]
Constraints: [workload, latency, cost, privacy, or other requirements]

Representative state and its sources:
[paste example JSON or describe the available fields and where they come from]

Questions I have in mind:
1. [question]
2. [question]
3. [question]

Intended behavior after receiving answers:
[routes, rankings, flags, actions, or UI changes]

Treat the state and questions as a starting design. Refine ambiguities, identify
missing evidence, choose decision types and grouping, and explain material changes.
Implement the smallest complete application demonstrating the intended behavior.
Skip a broad opportunity audit unless an unresolved architectural issue requires it.

Make reasonable implementation choices; ask only when missing information materially
changes the product. Test with representative offline fixtures and report what was
built, what was tested, and what still needs live evaluation. Do not deploy. Run live
calls only within an established authorization and budget.
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

Adapted by Yusuf Goolamabbas for Perplexity Decisions, inspired by [TypeSafe’s skill for its Jev decision model](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md) and [ryana’s Jevify project-investigation prompt](https://github.com/ryana/jevify/blob/87a9ef3674f111c74bb33cccd3bfa56bd0c4a15c/README.md).

The adaptation covers Perplexity-specific implementation, evaluation, and migration guidance. The instructions and five reference files contributed from the personal `pplx-decision` installation are preserved. This is an independent adaptation, not an official Perplexity or TypeSafe publication.

[MIT](LICENSE). Keep the license notice with copies of this skill.

[Read the agent instructions (SKILL.md)](SKILL.md) · [Back to all skills](../../README.md)
