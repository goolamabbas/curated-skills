# Perplexity Decisions

Understand decision models, choose between Perplexity Standard, Flash, and TypeSafe/Jev, and turn their judgments into useful application behavior. Then use the Perplexity Decisions skill with a coding agent to build and evaluate an integration.

This guide covers **Perplexity Decider v1.3 and Flash v1.3**. Model behavior, limits and pricing were checked on **13 November 2026**. We update the guide as releases change the documented behavior.

**Upgrading from an earlier version?** Revalidate your thresholds and request grouping; this guide describes v1.3 behavior.

An independent guide and skill adapted by Yusuf Goolamabbas. See [origin and license](#origin-and-license) for attribution.

## What is a decision model?

A decision model interprets information and returns answers that software can act on: a yes/no probability, a choice from supplied options, a score against defined criteria, or matching spans extracted from text. Your application sends it data through an **API**, the interface for requesting those judgments and receiving the results.

For example, a support application might ask whether a message needs human review, which team should own the ticket, and how urgent the reported disruption is. The model judges the message; your code decides whether to escalate it or ask a person to review it.

**Supplied information + questions → model judgments → application rules → action or review.**

## When to use it

### Is a decision model the right tool?

| The hard part | A useful starting approach |
| --- | --- |
| Applying an exact rule, such as whether an invoice is overdue | Ordinary code. |
| Interpreting meaning, such as whether a ticket reports lost data | A decision model whose probabilities your code can use. |
| Writing a reply or explanation for a person | A generative LLM. |
| Finding missing facts, such as the customer’s recent orders | Search or retrieval to supply the evidence. |

These components can work together: retrieval gathers context, a model judges it, code applies policy, and an LLM drafts a reply when needed. General LLMs can also return structured answers. A decision model provides a specialized interface for focused, probability-based judgments; evaluate whether it improves your workflow.

Prefer ordinary code when exact rules already work. A decision model evaluates the information available to it; a hosted API can also retrieve evidence before calling that model. Perplexity offers this as optional web grounding. Your application still decides whether the evidence and judgment justify action or require review.

### Where does the evidence come from?

State is the information supplied to the model. There are three useful ways to make evidence available:

| Evidence path | What happens | When to consider it |
| --- | --- | --- |
| Supplied state | Your application sends the information to evaluate; the API performs no built-in web retrieval. | The necessary evidence is already available, such as a support message and account records. |
| Built-in web grounding | The API retrieves web evidence before the decision model answers. | The judgment depends on public facts that may have changed or are missing from your input. |
| Application-managed retrieval | Your application retrieves and selects evidence, then supplies it as state. | You need explicit source controls, private-data access, or a saved evidence snapshot. |

With Perplexity, add `mode: "web_grounding"` to enable built-in retrieval. The API prepares searches from your questions and state, adds the results to the model's input, and returns the retrieved evidence alongside its judgments. A state consisting of a page URL can also be fetched before searching. Without this mode, the API does not fetch or search for evidence; this does not mean the model has no knowledge from training. [Perplexity documentation](https://docs.perplexity.ai/docs/decisions/quickstart#web-grounding)

**Supplied information + questions + optional retrieval → model judgments → application rules → action or review.**

Grounding is optional, but its effect matters: it changes the evidence, cost and response time of the workflow. A high probability does not prove that retrieval succeeded or that the sources support acting. Your application needs a path for missing, stale, irrelevant or conflicting evidence.

Both Perplexity's optional grounding and Parallel's documented Decisions flow share retrieved evidence across the questions in a request. Perplexity forms queries from the questions and merges the results; identical queries can share a search. Parallel's only documented mode, `fast`, includes web retrieval, with no documented supplied-state-only mode. Both return request-level evidence without a documented per-answer source mapping. These are differences in API design, not a ranking of decision quality. [Parallel documentation](https://docs.parallel.ai/api-reference/decisions/make-web-grounded-typed-decisions), [Perplexity grounding](https://docs.perplexity.ai/docs/decisions/quickstart#how-web-grounding-works)

## State, questions, and answers

**State** is the information available for a decision: a message, document, image, or relevant application data. Supported inputs vary: [Perplexity accepts images](https://docs.perplexity.ai/docs/decisions/quickstart#images-in-state); [Jev accepts text and images](https://docs.typesafe.ai/models). **Questions** describe what to judge, including the options or scoring criteria. Both providers support these three judgment types; Perplexity also supports text extraction with `locate`, introduced below:

| Type | Illustrative question | Result |
| --- | --- | --- |
| Yes/no (`noul`) | Does this message require human review under the supplied policy? | A probability of yes, from 0 to 1. |
| Choice (`choice`) | Which team should own this ticket? | The selected option and probabilities for the supplied options. |
| Rubric (`score`) | What urgency does the reported disruption justify? | An expected level (a probability-weighted average) and probabilities across defined urgency levels. |

**Choice and score answers also include `confidence`, a number from 0 to 1 derived from the probability distribution. It summarizes the model's certainty; it is not the probability that the answer is correct.** The providers' score-confidence calculations differ; see [Choose between Standard, Flash, and Jev](model-comparison.md#interpreting-the-answers).

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
  "model": "pplx-decider-v1.3",
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

### Try an optional web-grounded question

Suppose your application needs to check whether a software project has published a newer stable release. Here is an illustrative request body for `POST https://api.perplexity.ai/v1/decisions`, using a pinned version as comparison input:

```json
{
  "model": "pplx-decider-v1.3",
  "mode": "web_grounding",
  "state": "Python programming language; official site python.org; pinned version 3.13.0.",
  "questions": {
    "newer_stable_release": {
      "type": "noul",
      "instructions": "Has Python released a stable version newer than 3.13.0, including patch releases but excluding prereleases?"
    }
  }
}
```

This is a request example, not a recorded result or a recommendation to use that pinned version. Put the entity and relevant facts early in state because they help form the search query. Inspect the returned `search_results` for relevant release evidence; a probability alone should not trigger an upgrade. Mentioning an official site helps identify the subject but does not restrict retrieval to that domain.

Even when searches return no evidence, the API can still answer from the available state. See the [grounding reference](../../skills/pplx-decision/references/web-grounding.md) for evidence checks, freshness and billing.

<details>
<summary>If you supply a page URL</summary>

If you supply a page URL as the entire state, inspect `fetched_results` too. `max_staleness` can limit that fetched copy's crawl age; it does not control search-result freshness.

</details>

### Extract matching text with locate

Use `locate` when you need the exact words in supplied text, such as a product name or the phrase describing a problem. It returns text spans with positions and scores; it does not generate an explanation or establish that the extracted claim is true.

This illustrative request combines extraction with a yes/no judgment:

```json
{
  "model": "pplx-decider-v1.3",
  "state": "My saved contacts disappeared after import.",
  "questions": {
    "reported_symptom": {
      "type": "locate",
      "instructions": "Extract the exact phrase describing what went wrong."
    },
    "possible_data_loss": {
      "type": "noul",
      "instructions": "Does the message report possible loss of saved data?"
    }
  }
}
```

A synthetic answer excerpt—not a recorded model result—shows the span format:

```json
{
  "type": "locate",
  "spans": [{"start": 3, "end": 29, "text": "saved contacts disappeared", "score": 0.90}]
}
```

The application can highlight the phrase for a reviewer. `end` is exclusive and offsets count Unicode characters. A span's score is distinct from a rubric score and is not an established probability of correctness. An empty list means no match was identified, not proven absence.

**Locate requires string state, excludes images and built-in web grounding, and limits the whole mixed request to 128 questions.** Keep the object-state triage example separate. For extraction from web pages, retrieve the text first and preserve its source. See [locate handling and evaluation](../../skills/pplx-decision/references/locate.md) for source mapping, Unicode handling and long-input limitations. [Perplexity locate documentation](https://docs.perplexity.ai/docs/decisions/quickstart#locate-find-text-in-the-content)

## Choose a model to evaluate

**Standard (`pplx-decider-v1.3`) and Flash (`pplx-decider-flash-v1.3`) are Perplexity models. Jev is TypeSafe's separate offering.** If you are building with Perplexity and are unsure where to begin, start by evaluating **Standard**. It is the provider's recommended default, especially for nuanced criteria or costly mistakes.

| Your starting situation | A useful first step |
| --- | --- |
| Building with Perplexity, with nuanced judgments or several related questions about the same content | Start with **Standard**. Test related questions together over shared state, with complete instructions for each question. |
| Making clear, repetitive judgments at high volume | Test **Flash** against your workflow's quality target. Group questions over the same state when they fit; keep it only if quality and total workflow cost justify it. |
| Comparing providers for independent judgments over text, especially several questions about the same information | Include **Jev**. It evaluates questions independently against shared state in one request. It is also a natural candidate if you already use TypeSafe. |

These are starting points, not exclusive categories or measured rankings. More than one model can suit the same application. Standard can also evaluate a single question; Flash is not automatically cheaper for a multi-question workflow.

Standard and Flash v1.3 process questions together using shared state. Each question directly reads the state and its own text, not other questions. Questions can still influence one another indirectly through shared state. [Keep grouping fixed while tuning thresholds](https://docs.perplexity.ai/docs/decisions/quickstart#grouping-questions-in-one-request), and re-evaluate when it changes. With web grounding, changing the question set can also change the shared retrieved evidence.

**Why consider Jev alongside Perplexity?** Jev is an alternative provider with documented independent question evaluation against shared state. Both Perplexity v1.3 models also share state, but allow indirect question interaction. Compare application quality, actual billed usage, latency and integration fit. Both providers accept images; their supported formats and question types differ.

The Standard and Flash starting guidance follows the [Perplexity quickstart](https://docs.perplexity.ai/docs/decisions/quickstart). Including Jev is this guide's suggestion, based on the question isolation and shared-state processing described in the [TypeSafe introduction](https://docs.typesafe.ai/introduction) and [model documentation](https://docs.typesafe.ai/models). Read [Choose between Standard, Flash, and Jev](model-comparison.md) for operational limits and answer interpretation.

### Perplexity Decisions and TypeSafe/Jev

**Perplexity Decisions** is Perplexity’s API for its **`pplx-decider` models**. They return structured judgments and can extract matching text spans; they do not write replies, generate code, or explain their reasoning. See the [Perplexity Decisions quickstart](https://docs.perplexity.ai/docs/decisions/quickstart).

**TypeSafe** provides **Jev**, another decision model built around state and typed questions. The [TypeSafe introduction](https://docs.typesafe.ai/introduction) explains its approach. These are separate services; this skill helps you build with Perplexity or [migrate an existing TypeSafe/Jev workflow](#port-a-typesafejev-workflow).

For a practical comparison, read [Choose between Standard, Flash, and Jev](model-comparison.md). It explains shared-state processing, question isolation, and what the provider differences mean for your application.

### Where this skill fits

A **coding agent** is an AI assistant that can work with your project’s files and tools to write and test software. The **`pplx-decision` skill** is a folder of instructions that helps the agent design a Perplexity integration. The **decision model** supplies judgments when the application calls its API.

If the workflow needs public web evidence, choose built-in grounding or application-managed retrieval. Private records need an appropriate authorised data source. Connect a generative component for written replies; application code controls actions and review.

### What a small workflow might cost

Compare the **same work**, including how often each model bills the information supplied. A token is a unit used to measure model input; the number of billed tokens can differ from the length of the customer's message.

Suppose each ticket supplies **10,000 tokens of state and asks three questions**. That illustrative state could include a support policy and retrieved account context; the short message in our worked example is much smaller. Both v1.3 models answer all three in one processing group, within the input limit. Using [Perplexity's rates](https://docs.perplexity.ai/docs/decisions/quickstart#pricing), checked on **13 November 2026**:

| For this workload | Standard v1.3 | Flash v1.3 |
| --- | --- | --- |
| Times the state is billed per ticket | Once | Once |
| Billed state tokens per ticket | 10,000 | 10,000 |
| Input price per million tokens | $0.02 | $0.01 |
| State cost per ticket | $0.0002 | $0.0001 |
| State cost for one million such tickets | $200 | $100 |

**This is ungrounded, state-only arithmetic, not a complete bill or a model benchmark.** Add question tokens, other input overhead and billed retries. Either model repeats state if a large request is split into groups. The model calls have free output tokens and no per-request fee, but optional web grounding adds retrieval charges and more input tokens.

At the [grounding rates checked on 13 November 2026](https://docs.perplexity.ai/docs/getting-started/pricing#web-grounding), each completed search costs $0.001, including a search with no results, and each successful URL fetch costs $0.001. One successful fetch plus three distinct completed searches therefore costs $0.004 before model input tokens. Questions that produce the same query can share a search. Count billed operations, not the number of returned sources; completed retrieval can remain billable if the model request subsequently fails.

**Where does Jev fit in this illustration?** At its [documented $0.042 per million input tokens](https://docs.typesafe.ai/models), 10,000 billable state tokens would cost **$0.00042 if counted once**—more than either Perplexity state-only figure above. This is conditional arithmetic, not a verified Jev charge. TypeSafe documents ingesting state once, while its [API reference](https://docs.typesafe.ai/api#response-usage-input-tokens) defines returned billable usage without explicitly specifying repeated-state billing in the passages checked. Tokenizers can differ, so compare returned usage. Jev's inclusion here is about its question-handling approach, not a demonstrated cost advantage.

Flash has the lower state cost in this one-group illustration. That does not establish a cheaper useful outcome: compare quality and review workload too. Use returned `usage.input_tokens` across the complete workflow, then include retrieval, generated replies, and human review. [Choose between Standard, Flash, and Jev](model-comparison.md#inputs-limits-and-cost) includes Jev's rate and limits.

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

For grounded workflows, evaluate evidence quality as well as the resulting action. Compare supplied-state-only, built-in grounding and application-managed retrieval on the same labelled cases when those are plausible alternatives. Record the retrieved evidence and its date, retrieval settings, missing or conflicting sources, total cost and response time. A saved evidence snapshot helps test decision logic consistently; a live retrieval test measures the changing end-to-end workflow.

## Install this skill

Use an application that supports folder-based agent skills.

1. [Download the collection ZIP](https://github.com/goolamabbas/curated-skills/archive/refs/heads/main.zip) and unzip it.
2. Open the extracted `skills/` directory and find `pplx-decision/`.
3. Copy that **whole folder** into your application’s documented skills directory. Keep `SKILL.md`, the short `README.md`, `LICENSE`, and `references/` together. Back up an existing copy before replacing it.
4. Follow your application’s reload instructions. Open the relevant project, or choose a workspace for a new one.
5. In the agent’s chat, ask: “Find the installed pplx-decision skill, read its instructions, and tell me which file you loaded. Do not change any files.” If it cannot find the skill, check the folder location and reload before continuing.

**Using Codex?** For a personal installation, place the folder at `~/.agents/skills/pplx-decision/`, where `~` means your home folder. Codex detects skill changes automatically; restart it if the skill does not appear. See the [official Codex skill locations](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills). Other applications may use different locations and reload procedures.

**Supplying files manually?** Give the agent `SKILL.md` and the complete `references/` folder so it can follow the linked guidance. Keep the license with redistributed copies.

The full guide, [Choose between Standard, Flash, and Jev](model-comparison.md), and [worked example](worked-example.md) are website documentation outside the skill folder. Install the current package as a complete folder rather than retaining files from older packages.

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
product failures and missing records; Billing owns charges, refunds, and invoices. Review
handles unclear ownership. Possible lost data or insufficient information requires
human review. Treat the message as a report, not a verified incident.

Questions:
1. Does this message require human review under that policy?
2. Which team should own it: Technical Support, Billing, or Review?
3. What urgency is justified: routine request with no reported disruption; impaired
   work with no reported lost data or complete blockage; or possible lost data / blocked work?

Show the suggested team and urgency. For the initial simulated demo, require human
review at a review probability of 0.20 or higher, or when the selected team is Review.
Otherwise allow automatic routing only at a top team probability of at least 0.85.
Flag high priority at a level-2 urgency probability of at least 0.50; otherwise use
the expected urgency score to order the queue. Label all cutoffs unvalidated.
A suggested team must not bypass required human review.
Show uncertain or unavailable results clearly. Do not send messages automatically.

Design the initial requests for pplx-decider-v1.3 with all three related questions
in one request. Clarify ambiguous wording while preserving this example's policy
and initial layout; explain any proposed changes before adopting them. Build the
demo with saved example inputs and simulated answers. Send missing or malformed
required answers to Review. Keep action rules in code. Explain what needs live evaluation.
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

Start with [Choose between Standard, Flash, and Jev](model-comparison.md) for the conceptual differences, then use the migration prompt below.

**Outcome:** a revised integration and offline checks of its application logic. Provide the existing request builder, answer handling, and tests. TypeSafe documents independent question evaluation. Both Perplexity v1.3 models share state within each processing group, with direct question isolation and possible indirect influence through state. Review the [migration guidance](../../skills/pplx-decision/references/porting-from-typesafe.md#reconsider-grouping-first) before carrying over assumptions.

```text
Use the pplx-decision skill to port this TypeSafe/Jev integration to Perplexity
Decisions. Inspect the existing request builder, answer consumer, and tests.
Preserve the intended product behavior, identify assumptions that do not transfer,
and verify the revised application logic with offline tests. Do not deploy.
```

## Supporting guidance

These references are optional reading for you; the agent loads the ones needed for your task. It checks current provider documentation when implementing an integration or making current API claims. The bundled API snapshot is a dated reference, so model behavior, limits, and prices may have changed.

- [Choose between Standard, Flash, and Jev](model-comparison.md): a short explanation, optional practitioner checklist, and learning checks.
- [From a customer message to an actionable support decision](worked-example.md): one illustrative workflow across Standard, Flash, and Jev, with simulated answers and application rules.
- [Project opportunities](../../skills/pplx-decision/references/project-opportunities.md): investigate improvements and new capabilities.
- [Text extraction](../../skills/pplx-decision/references/locate.md): find matching spans, preserve source offsets and evaluate extraction.
- [Web grounding](../../skills/pplx-decision/references/web-grounding.md): choose an evidence path and handle query construction, fetching, freshness, insufficient evidence and retrieval costs.
- [Implementation](../../skills/pplx-decision/references/implementation.md): request design, answer handling, and operational failures.
- [Evaluation](../../skills/pplx-decision/references/evaluation.md): representative cases, thresholds, and whole-workflow measurements.
- [Porting from TypeSafe/Jev](../../skills/pplx-decision/references/porting-from-typesafe.md): preserve decisions while revisiting provider assumptions.
- [Dated API snapshot](../../skills/pplx-decision/references/api-snapshot.md): documented baseline and its evidence limits.

## Origin and license

Adapted by Yusuf Goolamabbas for Perplexity Decisions, inspired by [TypeSafe’s skill for its Jev decision model](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md) and [ryana’s Jevify project-investigation prompt](https://github.com/ryana/jevify/blob/87a9ef3674f111c74bb33cccd3bfa56bd0c4a15c/README.md).

The adaptation covers Perplexity-specific implementation, evaluation, and migration guidance. This is an independent adaptation, not an official Perplexity or TypeSafe publication.

[MIT](../../skills/pplx-decision/LICENSE). Keep the license notice with copies of this skill.

[Read the agent instructions (SKILL.md)](../../skills/pplx-decision/SKILL.md) · [Back to all skills](https://goolamabbas.github.io/curated-skills/)
