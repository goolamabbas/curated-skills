# How Jev, Standard, and Flash differ

Jev and Perplexity Decisions share a useful pattern: give a model some information and focused questions, then use its structured answers in your application. Their handling of several questions differs, and Perplexity’s Standard (`pplx-decider-v1.2`) and Flash (`pplx-decider-flash-v1.2`) models need different starting assumptions.

## How questions influence each other

Suppose a customer says, “After importing a CSV, my saved contacts disappeared.” Your application asks whether this reports lost data, which team should handle it, and how serious the disruption is.

**Jev is like separate assessors working from the same case file.** Each evaluates its own question against the shared state. Sending the questions together does not make them part of one another’s context. The state itself is still shared: if it contains several documents, those documents are available to each evaluation. This is the question-isolation behavior described in the [TypeSafe introduction](https://docs.typesafe.ai/introduction).

**Perplexity Standard is like an assessor who can see the whole questionnaire.** Each question can be influenced by the others in its processing group. Adding a severity question can therefore change another answer, even when the customer’s message stays the same. Grouping related judgments may help; grouping competing documents or tools can hurt.

**Hosted Perplexity Flash answers each question separately.** Sending several in one request does not give them joint context: the API repeats and bills the state for every question. This is the hosted behavior in the [Perplexity grouping guidance](https://docs.perplexity.ai/docs/decisions/quickstart#grouping-questions-in-one-request), checked on October 20.

The assessors are an analogy, and this ticket is illustrative—not a recorded model test.

For an observed example, read [When an extra question changes an application's decision](https://goolamabbas.github.io/curated-skills/skills/pplx-decision/case-study.html). The case study records October 18 responses on 24 fictional support tickets; a dated note distinguishes those observations from the updated hosted Flash documentation. It distinguishes a change in routing from agreement with a debatable expected label, and a change in probability from crossing an application's review cutoff. It does not establish an overall model winner.

## Where to start with each model

| Model | A practical starting point |
| --- | --- |
| TypeSafe Jev | Submit questions together when useful; they are evaluated independently against the same state. |
| Perplexity Standard | Test related questions together. Start with separate requests when independently scoring competing candidates. |
| Perplexity Flash | Start with one question per request. Hosted Flash processes questions separately and bills state per question even when several are submitted together. |

**Flash is a different, smaller model.** It was trained to learn the probability distributions of larger decision models. The [Flash model card](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) describes a checkpoint implementation capable of joint evaluation, with limited recommended uses for grouping. That implementation differs from the hosted API’s per-question processing. Use the hosted contract when building against the API, and evaluate both models on examples representative of your application.

## Two other distinctions

Two other distinctions matter:

- **Grouping questions and batching requests are different.** Joint evaluation, as on Standard, lets questions influence one another. Multiple questions in one API request do not necessarily share model context, as hosted Flash illustrates. Processing separate requests together for efficiency also need not combine their contexts. The [Standard model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) describes its serving implementation; consult the hosted API documentation for API features.
- **Probability and confidence are different signals.** Confidence is not simply the selected answer’s probability. [TypeSafe publishes its calculation from the probability distribution](https://docs.typesafe.ai/confidence). [Perplexity now publishes its formulas](https://docs.perplexity.ai/docs/decisions/quickstart): choice uses the same formula for more than one option, while score uses a different normalization baseline. The [practitioner checklist](#practitioner-checklist) compares their documented choice and score examples. Do not assume a formula or threshold transfers without checking the target provider and task.

## Practitioner checklist

<details>
<summary>Before building or migrating an integration</summary>

- **Define what you are comparing.** Keep each configuration’s state, questions, and grouping fixed across repeated runs of the same case. Compare alternative configurations on the same held-out cases. Identical request payloads do not guarantee identical processing across providers. To compare complete workflows, allow documented model-specific request designs and report them. Evaluate related groups on Standard and a one-question baseline on hosted Flash; treat multi-question Flash submission as a request-layout check, not joint evaluation. The [migration reference](../../skills/pplx-decision/references/porting-from-typesafe.md#reconsider-grouping-first) explains why unused speculative questions matter.
- **Check what each number means.** A score is a probability-weighted rubric index, so the same average can hide different distributions. The providers’ published choice formulas agree for more than one option: `(p_top - 1/n) / (1 - 1/n)`. Their score formulas both normalize probability-weighted distance from the most likely level, but use different baselines. [Perplexity](https://docs.perplexity.ai/docs/decisions/quickstart) averages distances from that most likely level; [TypeSafe](https://docs.typesafe.ai/confidence#score) averages distances from the rubric midpoint. In Perplexity’s three-level example, spread is about 0.2161. Perplexity’s baseline of 1 gives confidence about **0.78**; TypeSafe’s baseline of 2/3 gives about **0.68**. A cutoff of 0.7 would produce different actions. These are calculations from a published example, not new inference results. The [API snapshot](../../skills/pplx-decision/references/api-snapshot.md#confidence-calculations) gives the exact formulas and single-level case. Do not transfer confidence thresholds or code that recomputes confidence without evaluation. Reevaluate thresholds and **calibration**—how well predicted probabilities match observed outcomes—on representative labelled examples.
- **Distinguish a requested model name from serving identity.** [TypeSafe says its response identifies the version that answered](https://docs.typesafe.ai/models). [Perplexity echoes the requested name](https://docs.perplexity.ai/api-reference/decisions-post), and [retired version names can route to replacements](https://docs.perplexity.ai/docs/decisions/quickstart#model-names). A versioned Perplexity name is therefore not an immutable serving guarantee. Record request names and evaluation dates, follow retirement notices, and reevaluate after routing changes.
- **Compare the completed workflow.** Measure errors, review rates, latency, and total billed input at the thresholds your application uses. Include repeated state, retries, retrieval, and any generative calls. A lower token rate alone does not establish a cheaper useful outcome. See the [cost example](guide.md#what-a-small-workflow-might-cost) and [evaluation guidance](../../skills/pplx-decision/references/evaluation.md).
- **Check the operational contract.** Use the [dated API snapshot](../../skills/pplx-decision/references/api-snapshot.md) and current provider docs for limits, errors, and prices. Standard automatically splits questions that do not fit together, repeating state per group; state plus each individual question must fit. Plan groups deliberately when joint context matters. Hosted Flash repeats state per question. TypeSafe currently lists text input; Perplexity documents native image input. An image-to-text step can supply Jev with textual state, but it is an additional component. Input support does not establish judgment quality on your images.

</details>

## Check your understanding

<details>
<summary>Can an unused fourth question change the first answer?</summary>

On Standard, questions in the same processing group can see the added question, so an answer can change. Hosted Flash and Jev document separate question evaluation. That distinction does not guarantee numerically identical responses across repeated calls; test variation and resulting actions separately.

</details>

<details>
<summary>Does a score of 1 mean the model confidently chose the middle of three levels?</summary>

No. Probabilities `(0, 1, 0)` and `(0.5, 0, 0.5)` both average to 1 on levels 0, 1, and 2. One puts all probability on the middle; the other splits it between the extremes. [TypeSafe’s published score formula](https://docs.typesafe.ai/confidence#score) gives these confidence values of 1 and 0, respectively. Inspect the distribution when it matters to your action rule.

</details>

<details>
<summary>Does the same Perplexity version name in two responses prove the same model served both?</summary>

No. Perplexity echoes the requested name, and a retired version name can route to its replacement. Check model-change notices and reevaluate affected behavior.

</details>

The original documentation review was on **18 October 2026**; Perplexity grouping, input splitting, pricing, and both providers’ confidence formulas were rechecked on **20 October 2026**. This page explains documented contracts; the separate [case study](https://goolamabbas.github.io/curated-skills/skills/pplx-decision/case-study.html) preserves live responses from October 18 and explains the subsequent documentation clarification. The experiment does not validate every documented behavior. Recheck the linked provider pages when updating an integration; use the [API snapshot](../../skills/pplx-decision/references/api-snapshot.md) for dated operational details.

[Back to the Perplexity Decisions guide](guide.md) · [Choose a prompt](guide.md#choose-a-starting-point)
