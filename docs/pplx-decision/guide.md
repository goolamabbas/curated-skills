# Perplexity Decisions

Understand decision models, choose between Perplexity Standard, Flash, and TypeSafe/Jev, and turn their judgments into useful application behavior. Then use the Perplexity Decisions skill with a coding agent to build and evaluate an integration.

An independent guide and skill adapted by Yusuf Goolamabbas. See [origin and license](#origin-and-license) for attribution.

## What is a decision model?

A decision model interprets information and returns answers that software can act on: a yes/no probability, a choice from supplied options, or a score against defined criteria. Your application sends it data through an **API**, the interface for requesting those judgments and receiving the results.

For example, a support application might ask whether a message needs human review, which team should own the ticket, and how urgent the reported disruption is. The model judges the message; your code decides whether to escalate it or ask a person to review it.

**Context + questions → model judgments → application rules → action or review.**

## When to use it

### Is a decision model the right tool?

| The hard part | A useful starting approach |
| --- | --- |
| Applying an exact rule, such as whether an invoice is overdue | Ordinary code. |
| Interpreting meaning, such as whether a ticket reports lost data | A decision model whose probabilities your code can use. |
| Writing a reply or explanation for a person | A generative LLM. |
| Finding missing facts, such as the customer’s recent orders | Search or retrieval to supply the evidence. |

These components can work together: retrieval gathers context, a model judges it, code applies policy, and an LLM drafts a reply when needed. General LLMs can also return structured answers. A decision model provides a specialized interface for focused, probability-based judgments; evaluate whether it improves your workflow.

Prefer ordinary code when exact rules already work. A decision model alone will not provide a written explanation or retrieve missing evidence. Before relying on its thresholds, check representative examples with known answers.

## State, questions, and answers

**State** is the information available for a decision: a message, document, image, or relevant application data. Supported inputs vary: [Perplexity accepts images](https://docs.perplexity.ai/docs/decisions/quickstart#images-in-state); [Jev currently takes text](https://docs.typesafe.ai/models). **Questions** describe what to judge, including the options or scoring criteria. Both providers below support three question types:

| Type | Illustrative question | Result |
| --- | --- | --- |
| Yes/no (`noul`) | Does this message require human review under the supplied policy? | A probability of yes, from 0 to 1. |
| Choice (`choice`) | Which team should own this ticket? | The selected option and probabilities for the supplied options. |
| Rubric (`score`) | What urgency does the reported disruption justify? | A numerical score and probabilities across defined urgency levels. |

`noul` is both APIs’ name for a yes/no question. A **request** is one call your application sends to the API, containing state and one or more questions.

These are illustrative questions, not recorded model results. A high probability is a model judgment, not proof. Test your questions and action thresholds on representative examples.

### From a message to an application action

Our fictional contact manager requires human review for possible lost data, unclear ownership, or insufficient information to triage. A clear routine request with enough information does not require review.

- **Input:** “After importing a CSV, my saved contacts disappeared. My team cannot work.”
- **Question:** Does this message require human review under the supplied policy?
- **Illustrative answer:** a yes probability of `0.90`.
- **Application rule:** require human review at `0.20` or higher. This **threshold**—the cutoff your code uses—is deliberately low to catch possible review cases, but it may create too much review work. It is unvalidated and must be tested.

Here the ticket goes to a person; the model has not established that data was actually lost. The [worked example](worked-example.md#turn-answers-into-application-behavior) uses this same question, probability, and cutoff, then adds team ownership and urgency.

<details>
<summary>See the request and answer as JSON</summary>

An illustrative request using the [documented API shape](https://docs.perplexity.ai/docs/decisions/quickstart):

```json
{
  "model": "pplx-decider-v1.2",
  "state": {
    "product": "A contact manager",
    "customer_message": "After importing a CSV, my saved contacts disappeared. My team cannot work.",
    "triage_policy": {
      "human_review": "Required for possible lost data, unclear ownership, or insufficient information to triage. A clear routine request with enough information does not require review.",
      "technical": "Product failures, imports, and missing records",
      "billing": "Charges, refunds, and invoices",
      "priority": "Possible lost data or blocked work takes highest priority. Treat the message as a report, not a verified incident."
    }
  },
  "questions": {
    "human_review": {
      "type": "noul",
      "instructions": "Does this message require human review under the supplied triage policy?"
    }
  }
}
```

Illustrative answer excerpt; the complete response also contains the model name and token usage. This is not a recorded API result.

```json
{
  "answers": {
    "human_review": {"type": "noul", "noul": 0.90}
  }
}
```

Your application compares `noul` with its review threshold. Noul answers have no separate `confidence` field.

</details>

## Choose a model to evaluate

**Standard and Flash are Perplexity models. Jev is TypeSafe's separate offering.** If you are building with Perplexity and are unsure where to begin, start by evaluating **Standard**. It is the provider's recommended default, especially for nuanced criteria or costly mistakes.

| Your starting situation | A useful first step |
| --- | --- |
| Building with Perplexity, with nuanced judgments or several related questions about the same content | Start with **Standard**. Test related questions together so they can use one another's context. |
| Making clear, repetitive judgments at high volume | Test **Flash** against your workflow's quality target. Start with one question per request; keep it only if quality and total workflow cost justify it. |
| Comparing providers for independent judgments over text, especially several questions about the same information | Include **Jev**. It evaluates questions independently against shared state in one request. It is also a natural candidate if you already use TypeSafe. |

These are starting points, not exclusive categories or measured rankings. More than one model can suit the same application. Standard can also evaluate a single question; Flash is not automatically cheaper for a multi-question workflow.

**Why consider Jev alongside Flash?** Both evaluate questions independently, but Jev ingests shared state once for a multi-question request, while hosted Flash repeats and bills state for every question. This is a reason to compare their complete workflows, not evidence that either is more accurate, faster, or cheaper overall. Jev's current input is text; Perplexity also accepts images.

These distinctions follow the [Perplexity quickstart](https://docs.perplexity.ai/docs/decisions/quickstart), [TypeSafe introduction](https://docs.typesafe.ai/introduction), and [TypeSafe model documentation](https://docs.typesafe.ai/models). Read the [model comparison](model-comparison.md) for operational limits and answer interpretation.

### Perplexity Decisions and TypeSafe/Jev

**Perplexity Decisions** is Perplexity’s API for its **`pplx-decider` models**. They return structured judgments; they do not write replies, generate code, or explain their reasoning. See the [Perplexity Decisions quickstart](https://docs.perplexity.ai/docs/decisions/quickstart).

**TypeSafe** provides **Jev**, another decision model built around state and typed questions. The [TypeSafe introduction](https://docs.typesafe.ai/introduction) explains its approach. These are separate services; this skill helps you build with Perplexity or [migrate an existing TypeSafe/Jev workflow](#port-a-typesafejev-workflow).

For a practical comparison, read [How Jev, Standard, and Flash differ](model-comparison.md). It explains Standard’s joint evaluation, hosted Flash’s separate question processing, and what those differences mean for your application.

### Where this skill fits

A **coding agent** is an AI assistant that can work with your project’s files and tools to write and test software. The **`pplx-decision` skill** is a folder of instructions that helps the agent design a Perplexity integration. The **decision model** supplies judgments when the application calls its API.

If the workflow also needs a written reply, retrieval, or an action, connect the appropriate components; application code controls what happens next.

### What a small workflow might cost

Compare the **same work**, including how often each model bills the information supplied. A token is a unit used to measure model input; the number of billed tokens can differ from the length of the customer's message.

Suppose each ticket supplies **10,000 tokens of state and asks three questions**. Standard answers all three together, within its input limit; hosted Flash answers them separately. Using [Perplexity's rates](https://docs.perplexity.ai/docs/decisions/quickstart#pricing), checked on **20 October 2026**:

| For this workload | Standard v1.2 | Flash v1.2 |
| --- | --- | --- |
| Times the state is billed per ticket | Once | Three times |
| Billed state tokens per ticket | 10,000 | 30,000 |
| Input price per million tokens | $0.02 | $0.01 |
| State cost per ticket | $0.0002 | $0.0003 |
| State cost for one million such tickets | $200 | $300 |

**This is state-only arithmetic, not a complete bill or a model benchmark.** Add question tokens, other input overhead, and retries. Standard repeats state too if an oversized request is split into groups. Both models currently have free output tokens and no request fee.

Flash has the lower token rate, yet Standard has the lower state cost in this example. A single-question workflow can give a different result. Use returned `usage.input_tokens` across the complete workflow, then include retrieval, generated replies, and human review before deciding on cost. The [comparison page](model-comparison.md#inputs-limits-and-cost) includes Jev's rate and limits; its different rate and token usage also require a whole-workflow comparison.

<details>
<summary>How to calculate the model-call subtotal</summary>

For each call, multiply its billed input tokens by that model's price per million input tokens, then divide by one million. Add the costs of all calls and any billed retries for a completed task. Returned usage already includes repeated state; do not add it again. Recheck prices before budgeting and identify any missing usage rather than assuming it is zero.

</details>

## Walk through a support decision

Follow [From a customer message to an actionable support decision](worked-example.md). The example defines a review question, an owning team, and an urgency rubric; shows how to submit them with Standard, Flash, and Jev; and connects simulated answers to application rules. It includes clear and ambiguous messages so you can see when more evidence or human review is needed.

This is a teaching example, not a benchmark or a report of live model performance.

## Evaluate before relying on the answers

1. **Define success and the baseline.** Compare with the current workflow, including simple rules or manual triage. Specify costly errors, review capacity, and latency requirements.
2. **Prepare representative cases with expected decisions.** Include ordinary traffic, missing information, overlapping categories, and consequential mistakes. Keep difficult stress cases visible rather than treating them as representative traffic.
3. **Tune on development cases; assess on held-out cases.** Use one set to refine questions and thresholds, then freeze that design and evaluate on examples you have not tuned against. Choose thresholds for each workflow against the same application objectives.
4. **Measure actions and the whole cost.** Count missed urgent cases, incorrect automatic routes, and the fraction sent for review. Include billed model usage, retries, retrieval, generated replies, and human review; measure typical and slow responses.

A model's confidence is not a measured accuracy rate. Check whether predicted probabilities agree with observed outcomes on your cases. Offline fixtures can check your code; live calls are needed to measure model quality. Reevaluate when the model, evidence, questions, or action policy changes. The [evaluation prompt](#evaluate-an-existing-workflow) helps turn these steps into a plan.

## Install this skill

Use an application that supports folder-based agent skills.

1. [Download the collection ZIP](https://github.com/goolamabbas/curated-skills/archive/refs/heads/main.zip) and unzip it.
2. Open the extracted `skills/` directory and find `pplx-decision/`.
3. Copy that **whole folder** into your application’s documented skills directory. Keep `SKILL.md`, the short `README.md`, `LICENSE`, and `references/` together. Back up an existing copy before replacing it.
4. Follow your application’s reload instructions. Open the relevant project, or choose a workspace for a new one.
5. In the agent’s chat, ask: “Find the installed pplx-decision skill, read its instructions, and tell me which file you loaded. Do not change any files.” If it cannot find the skill, check the folder location and reload before continuing.

**Using Codex?** For a personal installation, place the folder at `~/.agents/skills/pplx-decision/`, where `~` means your home folder. Codex detects skill changes automatically; restart it if the skill does not appear. See the [official Codex skill locations](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills). Other applications may use different locations and reload procedures.

**Supplying files manually?** Give the agent `SKILL.md` and the complete `references/` folder so it can follow the linked guidance. Keep the license with redistributed copies.

The full guide, [model comparison](model-comparison.md), and [worked example](worked-example.md) are website documentation outside the skill folder. Install the current package as a complete folder rather than retaining files from older packages.

Installing the skill does not provide API credentials or model-service access. Project exploration and offline tests—tests using saved example inputs without calling the model—can proceed without live inference. Calling Perplexity Decisions requires provider access and may incur charges; agree on data and spending limits before live testing, and keep credentials outside prompts and source files.

### What this skill helps with

- Investigate where contextual judgments could improve an existing product.
- Implement a Perplexity Decisions integration within your current stack.
- Design an evaluation of decision quality, thresholds, cost, and latency.
- Port a TypeSafe/Jev workflow while checking differences in request grouping and answer interpretation.

This skill helps build software; it does not provide general Perplexity search. It may recommend a simpler approach when an integration would add little value.

## Choose a starting point

Paste your chosen prompt into the coding agent’s chat with the project open or its files accessible. Replace the square-bracketed placeholders with your details. Describe the outcome and constraints in plain language; if you do not know the technical choices, ask the agent to recommend them.

| Your starting point | Choose this prompt |
| --- | --- |
| I just want to try a small demo | [Try the filled-in example](#a-filled-in-example) |
| I have a project and want recommendations before changing it | [Explore before editing](#explore-a-project-before-editing) |
| I know what behavior to add to an existing project | [Build a focused integration](#build-a-focused-integration) |
| I want a new application and have some state and questions in mind | [Build from state and questions](#build-a-new-project-from-state-and-questions) |

A specific build request does not require a broad project audit. For later work, jump to [evaluation](#evaluate-an-existing-workflow) or [TypeSafe/Jev migration](#port-a-typesafejev-workflow).

### A filled-in example

This illustrative new-project prompt carries the support-ticket example from the primer into a concrete request. It is not a recorded model run. Use it as a guide to filling in the [new-project template](#build-a-new-project-from-state-and-questions), or adapt it for a small practice project.

```text
Use the pplx-decision skill to build a small support-ticket triage demo in a new
folder called support-triage-demo. Recommend a simple stack.

State: the customer message is "After importing a CSV, my saved contacts disappeared.
My team cannot work." The product is a contact manager. Technical Support owns
product failures and missing records; Billing owns charges and invoices. Review
handles unclear ownership. Possible lost data or insufficient information requires
human review. Treat the message as a report, not a verified incident.

Questions:
1. Does this message require human review under that policy?
2. Which team should own it: Technical Support, Billing, or Review?
3. What urgency is justified: routine request with no disruption; impaired work
   without lost data or complete blockage; or possible lost data / blocked work?

Show the suggested team and urgency. For the initial simulated demo, require human
review at a review probability of 0.20 or higher, or when the selected team is Review.
Otherwise allow automatic routing only at a top team probability of at least 0.85.
Flag high priority at a level-2 urgency probability of at least 0.50; otherwise use
the expected urgency score to order the queue. Label all cutoffs unvalidated.
A suggested team must not bypass required human review.
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

Use the [evaluation steps](#evaluate-before-relying-on-the-answers) and [worked example](worked-example.md#evaluate-the-workflow) to define a comparison for your own application.

**Outcome:** an evaluation plan for an existing workflow. Held-out cases are examples reserved for evaluation rather than used to tune the questions. Provide the workflow, its current baseline, and the errors that matter.

```text
Use the pplx-decision skill to plan an evaluation of this decision workflow.
Workflow and current baseline: [details]
Errors that matter and acceptable review workload: [details]
Candidate models, request designs, and cost or latency constraints: [details]

Inspect the available state, questions, answer handling, and action thresholds.
Compare the current workflow and simpler alternatives with the proposed designs.
Propose representative labelled development and held-out cases, including missing
information and consequential errors. Tune questions and thresholds on development
cases, then freeze the design before assessing the held-out set.
Use each provider's documented request guidance and report design differences.
Measure action errors, review rate, latency, and total workflow cost. Include
repeated cases near thresholds. Investigate question or grouping sensitivity when
it could change an important application action.
Distinguish offline fixture checks from live measurements. Return a plan and a
proposed live-test budget; do not modify files or call model APIs yet.
```

### Port a TypeSafe/Jev workflow

Start with [How Jev, Standard, and Flash differ](model-comparison.md) for the conceptual differences, then use the migration prompt below.

**Outcome:** a revised integration and offline checks of its application logic. Provide the existing request builder, answer handling, and tests. TypeSafe documents independent question evaluation. Standard evaluates questions jointly within each processing group; hosted Flash evaluates them separately and bills state per question. Review the [migration guidance](../../skills/pplx-decision/references/porting-from-typesafe.md#reconsider-grouping-first) before carrying over assumptions.

```text
Use the pplx-decision skill to port this TypeSafe/Jev integration to Perplexity
Decisions. Inspect the existing request builder, answer consumer, and tests.
Preserve the intended product behavior, identify assumptions that do not transfer,
and verify the revised application logic with offline tests. Do not deploy.
```

## Supporting guidance

These references are optional reading for you; the agent loads the ones needed for your task. It checks current provider documentation when implementing an integration or making current API claims. The bundled API snapshot is a dated reference, so model behavior, limits, and prices may have changed.

- [How Jev, Standard, and Flash differ](model-comparison.md): a short explanation, optional practitioner checklist, and learning checks.
- [From a customer message to an actionable support decision](worked-example.md): one illustrative workflow across Standard, Flash, and Jev, with simulated answers and application rules.
- [Project opportunities](../../skills/pplx-decision/references/project-opportunities.md): investigate improvements and new capabilities.
- [Implementation](../../skills/pplx-decision/references/implementation.md): request design, answer handling, and operational failures.
- [Evaluation](../../skills/pplx-decision/references/evaluation.md): representative cases, thresholds, and whole-workflow measurements.
- [Porting from TypeSafe/Jev](../../skills/pplx-decision/references/porting-from-typesafe.md): preserve decisions while revisiting provider assumptions.
- [Dated API snapshot](../../skills/pplx-decision/references/api-snapshot.md): documented baseline and its evidence limits.

## Origin and license

Adapted by Yusuf Goolamabbas for Perplexity Decisions, inspired by [TypeSafe’s skill for its Jev decision model](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md) and [ryana’s Jevify project-investigation prompt](https://github.com/ryana/jevify/blob/87a9ef3674f111c74bb33cccd3bfa56bd0c4a15c/README.md).

The adaptation covers Perplexity-specific implementation, evaluation, and migration guidance. This is an independent adaptation, not an official Perplexity or TypeSafe publication.

[MIT](../../skills/pplx-decision/LICENSE). Keep the license notice with copies of this skill.

[Read the agent instructions (SKILL.md)](../../skills/pplx-decision/SKILL.md) · [Back to all skills](https://goolamabbas.github.io/curated-skills/)
