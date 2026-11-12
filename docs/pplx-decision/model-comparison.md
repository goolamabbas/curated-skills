# Choose between Standard, Flash, and Jev

All three return structured judgments that your code can use: a yes/no probability, a choice, or a rubric score. Choose a candidate from the work it must do, then evaluate the resulting application decisions on your own examples.

This page covers Perplexity v1.3. Upgrading from an earlier version? Revalidate thresholds and request grouping.

## Where to start

**Standard and Flash belong to Perplexity; Jev is a separate TypeSafe service.** If you are building with Perplexity and unsure where to begin, evaluate Standard first. Then test Flash if you have clear, repetitive judgments and want to assess its economics at your required quality level. If you are comparing providers for independent judgments on text, include Jev—especially when several questions use the same information.

| Candidate | Consider it when | What to verify |
| --- | --- | --- |
| **Perplexity Standard** (`pplx-decider-v1.3`) | Criteria are nuanced, errors are costly, or several related questions describe one decision. Perplexity recommends it as the default. | Whether the chosen grouping improves your outcomes, and whether cost and latency meet your requirements. |
| **Perplexity Flash** (`pplx-decider-flash-v1.3`) | You have high volumes of clear, focused judgments. | Whether it meets the same quality bar; its lower input rate must translate into a useful outcome at the same quality target. |
| **TypeSafe/Jev** | You are comparing providers for independent judgments on text, especially several questions over shared information, or already use TypeSafe. | Quality on your task, context limits, and provider-specific confidence and version handling. |

The Standard and Flash guidance follows the [Perplexity quickstart](https://docs.perplexity.ai/docs/decisions/quickstart). The Jev suggestion is this guide's, based on the question isolation described in the [TypeSafe introduction](https://docs.typesafe.ai/introduction). These are not measured rankings. The categories overlap: all three can serve the support workflow below. None removes the need to evaluate your workflow.

Both Perplexity v1.3 models share state within each processing group. Jev documents independent evaluation against shared state. Perplexity isolates direct question attention but still permits indirect influence through state. These distinctions alone do not prove a quality, speed or cost advantage.

## How the requests differ

A **request** is one API call containing state and questions. A **processing group** is the set of questions either Perplexity model evaluates together; a large request can be split into several groups.

Imagine a support message with three questions: does it need human review, which team should own it, and how urgent is it?

**Standard and Flash v1.3 share state across these questions.** Each question directly sees state and its own text, not the other questions. Shared state still allows indirect influence. Supply complete question meaning and shared policy explicitly; questions are not a sequential program.

Keep the question set and grouping fixed while tuning thresholds. If state plus all questions exceeds the input limit, the API splits questions into consecutive groups and bills state again per group. State plus any one question must fit. Leave headroom and re-evaluate changed grouping. Compare grouped and separate requests when interaction could change an important action.

**Jev evaluates questions independently against shared state.** Questions can be submitted together, but each is evaluated in isolation. TypeSafe recommends atomic questions—one specific judgment per question—whose results your code combines. Put the necessary evidence in state; do not expect one question's instructions or answer to supply another's missing context.

Question isolation does not mean responses are guaranteed to be numerically identical across repeated calls. Measure whether variation changes important application actions.

See the [same support workflow across all three](worked-example.md#choose-the-request-layout). These descriptions concern the hosted services. A downloadable model checkpoint or a different serving implementation can have a different contract.

## Inputs, limits, and cost

Documentation checked **13 November 2026**. Prices below are USD per million input tokens; all three currently have free output tokens.

| Hosted option | Inputs and default context | Input rate and shared state |
| --- | --- | --- |
| Standard v1.3 | Text and images; state plus each question must fit under 256K tokens. Oversized collections of questions are split into groups. | **$0.02/M**; state billed once per processing group. |
| Flash v1.3 | Text and images; state plus each question must fit under 256K tokens. | **$0.01/M**; state billed once per processing group. |
| Jev 1.13 / 1.14 | Text and images; 64K per request and 32K for state plus each question by default. | **$0.042/M**; TypeSafe describes ingesting state once for a multi-question request. Measure returned usage for the complete request. |

Sources: [Perplexity models, grouping, and pricing](https://docs.perplexity.ai/docs/decisions/quickstart), [TypeSafe models and limits](https://docs.typesafe.ai/models). Jev has an opt-in 262K-token long-context mode; TypeSafe warns it is slower and less accurate, so assess it separately rather than treating its expanded limits as the default. Perplexity image input has additional format, size, and request-body limits; see the [API reference](../../skills/pplx-decision/references/api-snapshot.md#limits-and-images).

For **three questions over a 10,000-token state**, the state alone costs about **$0.0002 on Standard** in one group versus **$0.0001 on Flash**. This is arithmetic from documented rates and repetition rules, excluding questions, other overhead, and retries. Tokenization and usage can differ by provider. Compare actual billed usage, quality, latency, and review workload—not rates alone. The [guide's cost explanation](guide.md#what-a-small-workflow-might-cost) shows how to estimate a complete workflow.

For Jev, **10,000 billable state tokens at $0.042/M would cost $0.00042 if counted once**, above both Perplexity figures in this illustration. This is a conditional estimate, not verified billing: TypeSafe documents ingestion once, but the inspected [API usage definition](https://docs.typesafe.ai/api#response-usage-input-tokens) does not explicitly specify repeated-state billing. Compare actual returned usage and account for different tokenizers.

**High-volume suitability is not a throughput guarantee:** Perplexity's [documented default limits](https://docs.perplexity.ai/docs/decisions/quickstart#rate-limits) are 4 million tokens per minute for Flash versus 15 million for Standard, with 10 requests per second shared across both; check your workload and account limits, and request higher limits if needed.

### Account for optional web grounding

Grounding rules checked **13 November 2026**.

Standard and Flash both support optional built-in web grounding. This adds retrieval before inference; shared-state processing still applies. Fetched page text and search evidence count as input tokens, repeated per processing group on either model. The state-only examples above exclude these retrieval charges and added evidence tokens. See [where evidence comes from](guide.md#where-does-the-evidence-come-from) and the [grounding reference](../../skills/pplx-decision/references/web-grounding.md).

On both Perplexity models, changing the grounded question set can change the shared retrieved evidence and potentially other answers. Direct question isolation does not isolate retrieved evidence. Keep the grounded question set and retrieval configuration fixed while tuning thresholds; this retrieval implication has not been measured here.

Compare the complete evidence-and-decision workflow. A model's input-token rate does not establish which grounded workflow is cheapest or most accurate, and a separate service's shared retrieval does not establish joint model evaluation.

Perplexity also supports [locate text extraction](../../skills/pplx-decision/references/locate.md), returning spans rather than classification distributions.

## Interpreting the answers

- **Yes/no probability** estimates whether the supplied statement is true. Near 0.5 means uncertainty, not medium urgency. `noul` has no separate confidence field.
- **Choice** selects among the options you supplied. Good option coverage matters: a confident answer cannot repair a missing category.
- **Score** averages over ordered rubric levels. The average can hide uncertainty between extremes, so inspect the distribution when it matters.
- **Confidence** summarizes a distribution; it is not a demonstrated accuracy rate. Perplexity and TypeSafe use different score-confidence normalization, so thresholds should not be transferred blindly.

The [worked example](worked-example.md#turn-answers-into-application-behavior) connects these signals to rules. Exact formulas, version identity, and migration checks are optional detail below.

## Practitioner checklist

<details>
<summary>Before building or migrating an integration</summary>

- **Define what you are comparing.** Keep each configuration’s state, questions, and grouping fixed across repeated runs of the same case. Compare alternative configurations on the same held-out cases. Identical request payloads do not guarantee identical processing across providers. To compare complete workflows, allow documented model-specific request designs and report them. Evaluate grouped requests on both v1.3 models and compare separate requests when interaction matters. The [migration reference](../../skills/pplx-decision/references/porting-from-typesafe.md#reconsider-grouping-first) explains why unused speculative questions matter.
- **Check what each number means.** A score is a probability-weighted rubric index, so the same average can hide different distributions. The providers’ published choice formulas agree for more than one option: `(p_top - 1/n) / (1 - 1/n)`. Their score formulas both normalize probability-weighted distance from the most likely level, but use different baselines. [Perplexity](https://docs.perplexity.ai/docs/decisions/quickstart) averages distances from that most likely level; [TypeSafe](https://docs.typesafe.ai/confidence#score) averages distances from the rubric midpoint. In Perplexity’s three-level example, spread is about 0.2161. Perplexity’s baseline of 1 gives confidence about **0.78**; TypeSafe’s baseline of 2/3 gives about **0.68**. A cutoff of 0.7 would produce different actions. These are calculations from a published example, not new inference results. The [API snapshot](../../skills/pplx-decision/references/api-snapshot.md#confidence-calculations) gives the exact formulas and single-level case. Do not transfer confidence thresholds or code that recomputes confidence without evaluation. Reevaluate thresholds and **calibration**—how well predicted probabilities match observed outcomes—on representative labelled examples.
- **Distinguish a requested model name from serving identity.** [TypeSafe says its response identifies the version that answered](https://docs.typesafe.ai/models). [Perplexity echoes the requested name](https://docs.perplexity.ai/api-reference/decisions-post), and [retired version names can route to replacements](https://docs.perplexity.ai/docs/decisions/quickstart#model-names). A versioned Perplexity name is therefore not an immutable serving guarantee. Record request names and evaluation dates, follow retirement notices, and reevaluate after routing changes.
- **Compare the completed workflow.** Measure errors, review rates, latency, and total billed input at the thresholds your application uses. Include repeated state, retries, retrieval, and any generative calls. A lower token rate alone does not establish a cheaper useful outcome. See the [cost example](guide.md#what-a-small-workflow-might-cost) and [evaluation guidance](../../skills/pplx-decision/references/evaluation.md).
- **Check the operational contract.** Use the [dated API snapshot](../../skills/pplx-decision/references/api-snapshot.md) and current provider docs. Both Perplexity models split questions that do not fit together, repeating state per group. Both providers accept images, with provider-specific restrictions. Perplexity `locate` requires text-only string state and cannot use built-in grounding; Jev 1.14 lists Box, a different primitive whose contract needs its own review. Input support does not establish quality on your inputs.

</details>

## Check your understanding

<details>
<summary>Can an unused fourth question change the first answer?</summary>

Yes. On either Perplexity v1.3 model, an added question can indirectly influence answers through shared state. With grounding it can also change the retrieved evidence. Jev documents independent question evaluation, but no such description guarantees numerically identical responses across repeated calls. Test both interaction and variation where they affect application actions.

</details>

<details>
<summary>Does a score of 1 mean the model confidently chose the middle of three levels?</summary>

No. Probabilities `(0, 1, 0)` and `(0.5, 0, 0.5)` both average to 1 on levels 0, 1, and 2. One puts all probability on the middle; the other splits it between the extremes. [TypeSafe’s published score formula](https://docs.typesafe.ai/confidence#score) gives these confidence values of 1 and 0, respectively. Inspect the distribution when it matters to your action rule.

</details>

<details>
<summary>Does the same Perplexity version name in two responses prove the same model served both?</summary>

No. Perplexity echoes the requested name, and a retired version name can route to its replacement. Check model-change notices and reevaluate affected behavior.

</details>

This comparison covers Perplexity v1.3. Models, grouping, limits, pricing and the cited TypeSafe state/confidence guidance were checked on **13 November 2026**. No model-quality or latency comparison was run for this guide. Recheck linked provider documentation before implementation and evaluate thresholds on your own data.

[Back to the guide](guide.md) · [Follow the worked example](worked-example.md) · [Choose a prompt](guide.md#choose-a-starting-point)
