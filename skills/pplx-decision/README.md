# Perplexity Decisions

Use a coding agent to build applications with Perplexity Decisions, an API for models that turn context and focused questions into structured judgments. This guide takes you from the basic idea to installing the skill and choosing a prompt.

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

### Perplexity Decisions and TypeSafe/Jev

**Perplexity Decisions** is Perplexity’s API for its **`pplx-decider` models**. They return structured judgments; they do not write replies, generate code, or explain their reasoning. See the [Perplexity Decisions quickstart](https://docs.perplexity.ai/docs/decisions/quickstart).

**TypeSafe** provides **Jev**, another decision model built around state and typed questions. The [TypeSafe introduction](https://docs.typesafe.ai/introduction) explains its approach. These are separate services; this skill helps you build with Perplexity or [migrate an existing TypeSafe/Jev workflow](#port-a-typesafejev-workflow).

For a practical comparison, read [How Jev, Standard, and Flash differ](model-comparison.md). It explains how questions can influence one another and why Flash needs different starting assumptions.

### Where this skill fits

A **coding agent** is an AI assistant that can work with your project’s files and tools to write and test software. The **`pplx-decision` skill** is a folder of instructions that helps the agent design a Perplexity integration. The **decision model** supplies judgments when the application calls its API.

If the workflow also needs a written reply, retrieval, or an action, connect the appropriate components; application code controls what happens next.

## When to use it

- Investigate where contextual judgments could improve an existing product.
- Implement a Perplexity Decisions integration within your current stack.
- Design an evaluation of decision quality, thresholds, cost, and latency.
- Port a TypeSafe/Jev workflow while checking differences in request grouping and answer interpretation.

Use ordinary code for exact rules, such as checking whether a date has passed. Consider a decision model when interpreting meaning or context is the hard part. This skill helps build software; it does not provide general Perplexity search. It may recommend a simpler approach when an integration would add little value.

## Install this skill

Use an application that supports folder-based agent skills.

1. [Download the collection ZIP](https://github.com/goolamabbas/curated-skills/archive/refs/heads/main.zip) and unzip it.
2. Open the extracted `skills/` directory and find `pplx-decision/`.
3. Copy that **whole folder** into your application’s documented skills directory. Keep `SKILL.md`, `README.md`, `LICENSE`, and `references/` together. Back up an existing copy before replacing it.
4. Follow your application’s reload instructions. Open the relevant project, or choose a workspace for a new one.
5. In the agent’s chat, ask: “Find the installed pplx-decision skill, read its instructions, and tell me which file you loaded. Do not change any files.” If it cannot find the skill, check the folder location and reload before continuing.

**Using Codex?** For a personal installation, place the folder at `~/.agents/skills/pplx-decision/`, where `~` means your home folder. Codex detects skill changes automatically; restart it if the skill does not appear. See the [official Codex skill locations](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills). Other applications may use different locations and reload procedures.

**Supplying files manually?** Give the agent `SKILL.md` and the complete `references/` folder so it can follow the linked guidance. Keep the license with redistributed copies.

Installing the skill does not provide API credentials or model-service access. Project exploration and offline tests—tests using saved example inputs without calling the model—can proceed without live inference. Calling Perplexity Decisions requires provider access and may incur charges; agree on data and spending limits before live testing, and keep credentials outside prompts and source files.

## Choose a starting point

Paste your chosen prompt into the coding agent’s chat with the project open or its files accessible. Replace the square-bracketed placeholders with your details. Describe the outcome and constraints in plain language; if you do not know the technical choices, ask the agent to recommend them.

| Your starting point | Choose this prompt |
| --- | --- |
| I have a project and want recommendations before changing it | [Explore before editing](#explore-a-project-before-editing) |
| I know what behavior to add to an existing project | [Build a focused integration](#build-a-focused-integration) |
| I want a new application and have some state and questions in mind | [Build from state and questions](#build-a-new-project-from-state-and-questions) |

A specific build request does not require a broad project audit. For later work, jump to [evaluation](#evaluate-an-existing-workflow) or [TypeSafe/Jev migration](#port-a-typesafejev-workflow).

### A filled-in example

This illustrative new-project prompt carries the support-ticket example from the primer into a concrete request. It is not a recorded model run. Use it as a guide to filling in the [new-project template](#build-a-new-project-from-state-and-questions), or adapt it for a small practice project.

```text
Use the pplx-decision skill to build a small support-ticket triage demo in a new
folder called support-triage-demo. Recommend a simple stack.

State: the customer message is "After importing a CSV, my saved contacts disappeared."
The product is a contact manager. Available teams are Technical Support and Billing.

Questions:
1. Does the message report lost data?
2. Which team should handle the ticket?
3. How serious is the disruption: minor inconvenience, blocked task, or possible data loss?

Show the suggested team and severity. Propose a review threshold for the lost-data
probability and label it unvalidated; flag matching tickets for human review.
Show uncertain or unavailable results clearly. Do not send messages automatically.

Refine the questions and grouping, then build the demo with saved example inputs
and simulated answers. Keep action rules in code. Explain what needs live evaluation.
Do not call the model API or deploy yet.
```

### Explore a project before editing

**Outcome:** recommendations and a proposed experiment, with no file changes. Provide the project, the behavior you want to improve, and any constraints that matter.

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

**Outcome:** changes to an existing application, checked with offline tests. Describe the specific behavior, available data, and requirements to preserve. Live model quality still needs evaluation.

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

**Outcome:** a small working application and offline tests. Supply representative information and the questions you want answered; the agent can refine both and recommend a stack.

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
changes the product. Test offline with representative saved example inputs. Report
what was built, what was tested, and what still needs live evaluation. Do not deploy.
Run live calls only within an established authorization and budget.
```

## Optional next steps

### Evaluate an existing workflow

**Outcome:** an evaluation plan for an existing workflow. Held-out cases are examples reserved for evaluation rather than used to tune the questions. Provide the workflow, its current baseline, and the errors that matter.

```text
Use the pplx-decision skill to evaluate this decision workflow.
Inspect the questions, grouping, answer handling, and action thresholds.
Propose representative held-out cases and compare against the current baseline.
Distinguish fixture checks from measurements that require live calls.
```

### Port a TypeSafe/Jev workflow

Start with [How Jev, Standard, and Flash differ](model-comparison.md) for the conceptual differences, then use the migration prompt below.

**Outcome:** a revised integration and offline checks of its application logic. Provide the existing request builder, answer handling, and tests. TypeSafe documents independent question evaluation, while Perplexity’s v1.2 models see other questions in the request; review the [migration guidance](references/porting-from-typesafe.md#reconsider-grouping-first) before carrying over assumptions.

```text
Use the pplx-decision skill to port this TypeSafe/Jev integration to Perplexity
Decisions. Inspect the existing request builder, answer consumer, and tests.
Preserve the intended product behavior, identify assumptions that do not transfer,
and verify the revised application logic with offline tests. Do not deploy.
```

## Supporting guidance

These references are optional reading for you; the agent loads the ones needed for your task. It checks current provider documentation when implementing an integration or making current API claims. The bundled API snapshot is a dated reference, so model behavior, limits, and prices may have changed.

- [Project opportunities](references/project-opportunities.md): investigate improvements and new capabilities.
- [Implementation](references/implementation.md): request design, answer handling, and operational failures.
- [Evaluation](references/evaluation.md): representative cases, thresholds, and whole-workflow measurements.
- [Porting from TypeSafe/Jev](references/porting-from-typesafe.md): preserve decisions while revisiting provider assumptions.
- [Dated API snapshot](references/api-snapshot.md): documented baseline and its evidence limits.

## Origin and license

Adapted by Yusuf Goolamabbas for Perplexity Decisions, inspired by [TypeSafe’s skill for its Jev decision model](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md) and [ryana’s Jevify project-investigation prompt](https://github.com/ryana/jevify/blob/87a9ef3674f111c74bb33cccd3bfa56bd0c4a15c/README.md).

The adaptation covers Perplexity-specific implementation, evaluation, and migration guidance. This is an independent adaptation, not an official Perplexity or TypeSafe publication.

[MIT](LICENSE). Keep the license notice with copies of this skill.

[Read the agent instructions (SKILL.md)](SKILL.md) · [Back to all skills](../../README.md)
