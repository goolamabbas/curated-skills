# How Jev, Standard, and Flash differ

Jev and Perplexity Decisions share a useful pattern: give a model some information and focused questions, then use its structured answers in your application. Their handling of several questions differs, and Perplexity’s Standard (`pplx-decider-v1.2`) and Flash (`pplx-decider-flash-v1.2`) models need different starting assumptions.

## How questions influence each other

Suppose a customer says, “After importing a CSV, my saved contacts disappeared.” Your application asks whether this reports lost data, which team should handle it, and how serious the disruption is.

**Jev is like separate assessors working from the same case file.** Each evaluates its own question against the shared state. Sending the questions together does not make them part of one another’s context. The state itself is still shared: if it contains several documents, those documents are available to each evaluation. This is the question-isolation behavior described in the [TypeSafe introduction](https://docs.typesafe.ai/introduction).

**Perplexity’s v1.2 models are like an assessor who can see the whole questionnaire.** Each question can be influenced by the other questions in the request. Adding a question about severity can therefore change another answer, even when the customer’s message stays the same. Grouping related judgments may help; grouping competing documents or tools can hurt. See the [Perplexity grouping guidance](https://docs.perplexity.ai/docs/decisions/quickstart#grouping-questions-in-one-request).

The assessors are an analogy, and this ticket is illustrative—not a recorded model test.

## Where to start with each model

| Model | A practical starting point |
| --- | --- |
| TypeSafe Jev | Submit questions together when useful; they are evaluated independently against the same state. |
| Perplexity Standard | Test related questions together. Start with separate requests when independently scoring competing candidates. |
| Perplexity Flash | Start with one question per request. Test exceptions such as select-all-that-apply or routing decisions. |

**Flash is a different, smaller model.** It was trained to learn the probability distributions of larger decision models. It is not simply Standard with a faster execution setting, and a question grouping that helps Standard may hurt Flash. The [Flash model card](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) documents this distinction. Evaluate both on examples representative of your application.

## Two other distinctions

Two other distinctions matter:

- **Grouping questions and batching requests are different.** A shared questionnaire lets questions influence one another. Processing several separate requests together for efficiency does not inherently combine their question contexts. The [Standard model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) describes its serving implementation; consult the hosted API documentation for API features.
- **Probability and confidence are different signals.** Confidence is not simply the selected answer’s probability. [TypeSafe publishes its calculation from the probability distribution](https://docs.typesafe.ai/confidence). [Perplexity describes a certainty estimate](https://docs.perplexity.ai/docs/decisions/quickstart), but that wording does not establish a different calculation. Do not assume a formula or threshold transfers without checking the target provider and task.

## Practitioner checklist

<details>
<summary>Before building or migrating an integration</summary>

- **Define what you are comparing.** Keep each configuration’s state, questions, and grouping fixed across repeated runs of the same case. Compare alternative configurations on the same held-out cases. To isolate model differences, use identical request content and grouping; to compare complete workflows, allow different request designs and report them. Evaluate related groups on Standard and a one-question baseline on Flash; test any proposed grouped Flash exception. The [migration reference](references/porting-from-typesafe.md#reconsider-grouping-first) explains why unused speculative questions matter.
- **Check what each number means.** A score is a probability-weighted rubric index, so the same average can hide different distributions. Use the returned probabilities and confidence according to the documented contract. Perplexity’s published choice example is consistent with TypeSafe’s confidence formula; this does not prove that every answer type or model uses the same calculation. Reevaluate thresholds and **calibration**—how well predicted probabilities match observed outcomes—on representative labelled examples.
- **Distinguish a requested model name from serving identity.** [TypeSafe says its response identifies the version that answered](https://docs.typesafe.ai/models). [Perplexity echoes the requested name](https://docs.perplexity.ai/api-reference/decisions-post), and [retired version names can route to replacements](https://docs.perplexity.ai/docs/decisions/quickstart#model-names). A versioned Perplexity name is therefore not an immutable serving guarantee. Record request names and evaluation dates, follow retirement notices, and reevaluate after routing changes.
- **Compare the completed workflow.** Measure errors, review rates, latency, and total billed input at the thresholds your application uses. Include repeated state, retries, retrieval, and any generative calls. A lower token rate alone does not establish a cheaper useful outcome. See the [cost example](README.md#what-a-small-workflow-might-cost) and [evaluation guidance](references/evaluation.md).
- **Check the operational contract.** Use the [dated API snapshot](references/api-snapshot.md) and current provider docs for limits, errors, and prices. Do not rely on automatic splitting to accept an oversized request or preserve grouping. TypeSafe currently lists text input; Perplexity documents native image input. An image-to-text step can supply Jev with textual state, but it is an additional component. Input support does not establish judgment quality on your images.

</details>

## Check your understanding

<details>
<summary>Can an unused fourth question change the first answer?</summary>

Both Perplexity v1.2 models expose the original questions to the new question’s context. Jev documents isolated question evaluation. That distinction does not guarantee numerically identical responses across repeated calls.

</details>

<details>
<summary>Does a score of 1 mean the model confidently chose the middle of three levels?</summary>

No. Probabilities `(0, 1, 0)` and `(0.5, 0, 0.5)` both average to 1 on levels 0, 1, and 2. One puts all probability on the middle; the other splits it between the extremes. Inspect the distribution when it matters to your action rule.

</details>

<details>
<summary>Does the same Perplexity version name in two responses prove the same model served both?</summary>

No. Perplexity echoes the requested name, and a retired version name can route to its replacement. Check model-change notices and reevaluate affected behavior.

</details>

Provider documentation for the behavior and contracts described here was checked on **18 October 2026**. This was a documentation check, not a live model evaluation. Recheck the linked provider pages when updating an integration; use the [API snapshot](references/api-snapshot.md) for dated operational details.

[Back to the Perplexity Decisions guide](README.md) · [Choose a prompt](README.md#choose-a-starting-point)
