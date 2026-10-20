# When an extra question changes an application's decision

This experiment records responses from 18 October 2026. As checked on 20 October, Perplexity documents that hosted Flash processes each question separately and bills state per question. How the recorded differences across request arrangements relate to that serving behavior remains unresolved; this study does not rank the models.

**Perplexity Standard, Flash, and TypeSafe's Jev · 24 fictional support tickets · Run on 18 October 2026**

Suppose your support application uses a decision model to choose which team should receive a customer's message. Later, you add a question about whether the customer wants a phone call. The message and routing instructions stay the same. Could the selected team change?

To understand the test, start with a **request**: one submission to the model containing information to assess and one or more questions. Here, **grouping questions** means submitting several questions in that same request; it does not establish that the service evaluated them jointly.

## What the providers say to expect

The [current hosted API documentation](https://docs.perplexity.ai/docs/decisions/quickstart#grouping-questions-in-one-request), checked on October 20, says Standard evaluates questions jointly within a processing group, while Flash answers each separately and bills state per question. The [Flash checkpoint model card](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2#when-to-group-questions) describes a joint-request implementation; it is not the hosted API contract. [TypeSafe documents](https://docs.typesafe.ai/introduction) that Jev evaluates each question independently against the same information. The [model comparison](model-comparison.md) explains the current documented distinctions.

The October 18 experiment was designed under guidance describing joint Flash requests. The newer hosted documentation does not establish whether serving changed or the description was corrected. We retain the original observations without assigning their differences to a confirmed internal mechanism. Keeping an existing answer unchanged may still be an application requirement; evaluate that outcome on the serving path you use.

## What we found

- **Standard and Jev** kept the same team choices across arrangements on all 24 messages.
- **Flash's team choice differed across arrangements** for one message whose expected label is debatable. The pattern repeated in all five trials of each arrangement.
- **Some missing-data probabilities changed, but none crossed the chosen 0.8 review cutoff.** Flash came close on one message: approximately 79.79% against an 80% cutoff.

This is a worked example of checking existing decisions when an application's questions change. Its 24 fictional situations do not establish an overall model winner or how often these effects occur in real support traffic.

## Start with the decisions the application needs

Our fictional application manages contacts. When a customer sends a support message, the application needs three answers:

1. **Does the customer report missing data that was previously saved?** This helps identify cases that might need a missing-data review.
2. **Who should handle the message?** The options are Technical Support, Billing, and Other / Needs Review.
3. **How serious is the current problem?** The scale runs from no disruption, through a blocked task, to possible data loss or a widespread outage.

The model supplies judgments; the application's rules determine what happens next. We defined a team destination and a missing-data review cutoff. We also measured severity scores, but did not define an action rule for them, so changes in severity cannot be translated into application actions in this experiment.

## Asking separately and asking together

The developer can send the customer message three times, asking one question per request, or send it once with all three questions. On Standard, questions that fit in one processing group share the state charge, and related questions can improve some judgments. Current hosted Flash documentation instead specifies a repeated state charge per question. Those distinctions matter when comparing complete workflows.

We compared both arrangements, then added the callback question to the grouped request. Our multi-question arrangements combine missing-data detection, team selection, and severity. They record submitted payloads, not a verified account of the hosted service's internal processing.

| Arrangement | What the application sends |
| --- | --- |
| A · Separate | Three requests, each containing the same customer message and one of the three questions |
| B · Together | One request containing the message and all three questions |
| C · Plus callback | The same request as B, with a fourth question asking whether the customer explicitly requests a phone call |

The application ignored the callback answer, but the added question was still part of the submitted request. On Standard, a question can affect others in its processing group even when its answer is unused. The recorded Flash differences do not establish that the hosted model saw the callback alongside the original questions.

Comparing A with B tests asking separately versus together. Comparing B with C tests adding the callback question to an already-grouped request. The message and original question wording stay fixed. We did not test adding the callback as a separate fourth request.

## What we tested

We used the same **24 fictional customer messages** with three models: Perplexity Standard, Perplexity Flash, and TypeSafe Jev. Each model saw every message under all three arrangements, and we repeated each arrangement five times to see how much the answers varied.

To assess the results, we recorded expected answers under our support policy. These were proposed by Codex, an AI coding assistant, and reviewed and accepted by Yusuf, the maintainer of this case study, before the run. Matching these labels is our quality measure, but the labels remain open to scrutiny—as the routing example below shows.

The full run completed 1,800 requests. That number includes the repeated trials and the three requests needed when asking separately. **There were still only 24 distinct situations.** The repetitions help us examine consistency on those situations; they do not make this a broad test of customer-support accuracy.

## Adding a question changed where one message would go

Here is one of the messages, reproduced exactly:

> I typed a new contact into a form but never clicked Save. The tab closed and that unsaved draft was lost. I entered it again successfully; all previously saved records are intact.

Our routing instructions include: “Route follow-ups about resolved technical incidents to Technical Support too.” We labelled this message **Technical Support**. Perplexity Flash chose:

| Arrangement | Team selected in all five repetitions |
| --- | --- |
| A · Separate | Other / Needs Review |
| B · Together | Technical Support |
| C · Plus callback | Other / Needs Review |

**The routing change does not depend on whether we accept that label.** With three questions together, Flash selected Technical Support; adding the callback question changed it to Other / Needs Review. A program following that answer would send the same message to a different destination.

The label itself is less clear. The message describes losing an unsaved draft and entering it again; it does not clearly establish a technical fault or ask for further help. It sits on a boundary within our policy, and Other / Needs Review is a defensible reading. The recorded rationale explains the missing-data and severity labels but does not explain the team assignment. We preserve the original label and report this ambiguity alongside it.

This was the only message with a team-choice change across arrangements. Flash matched the accepted team labels on 23 of 24 messages in A, all 24 in B, and 23 in C. Standard and Jev matched all 24 under every arrangement. Those totals depend on the accepted labels. The dataset also favors Technical Support: always selecting it would match 18 of 24 labels. That shows class imbalance, not how easy every message is to interpret.

**A changed answer is not automatically a worse answer, and an unchanged answer is not automatically correct.** Here, B matched our accepted label while A and C differed from it. The clearest observation is that the recorded destinations differed across request arrangements; their internal cause remains unresolved. Deciding which destination is preferable also requires a clearer policy for this boundary case.

## A changed number does not always change the action

Some model answers are numbers rather than team names. Our missing-data question returns a probability: a number between 0 and 1 estimating whether the message meets the definition in the instructions. A value of 0.8 corresponds to 80%; it is an estimate about the report, not proof that data was lost.

We set the application to send a case for missing-data review when that number is **at least 0.8**. This cutoff is called a threshold. A number can move while remaining below that cutoff, leaving the review decision unchanged.

Consider this message:

> This workspace list is empty. I cannot remember whether I saved any contacts here or whether this is a new workspace. I cannot continue the import task until support helps me check.

Our instructions say not to infer missing saved data from an empty list without evidence that it previously held saved data. The expected answer to the missing-data question is therefore **no**. The blocked import task can still need Technical Support; that is a separate decision.

| Model | A · Separate | B · Together | C · Plus callback |
| --- | ---: | ---: | ---: |
| Perplexity Standard | 11.39% | 24.53% | 31.15% |
| Perplexity Flash | 77.39% | 79.79% | 79.03% |

Percentages are rounded here; the [per-ticket results](../../examples/pplx-question-grouping/per-ticket.csv) retain the full values. Each value repeated across all five trials of its arrangement.

Standard's estimate rose by about 20 percentage points on this message, its largest shift. Flash's highest value was only about **0.21 percentage points below the 80% cutoff**. None triggered review, but the margin matters: at a hypothetical cutoff of 79%, the recorded separate answer would stay below it while both grouped answers would exceed it. This illustrates the effect of the application rule; it is not a recommendation to change the cutoff.

Our five repeats were identical. In an [earlier September 2026 example](https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-ticket-triage/README.md#reading-the-numbers), Perplexity reported values of 0.29–0.32 that changed a decision at a 0.30 cutoff. That supports checking repeated boundary cases on the model and workflow you use; it does not show that our Flash result would cross 80%. Choose thresholds using the costs of errors and available review capacity, rather than moving a cutoff solely to clear one cluster.

Across the full run, all 1,080 missing-data answers produced the expected yes/no review decision at 0.8, and none changed sides across arrangements. Most observed probabilities were away from that cutoff. This limits what the absence of crossings tells us: it does not establish robustness on messages near the boundary, or that 0.8 is a suitable production threshold.

Flash also assigned a high probability to this accepted “no” case when asked separately. How well its probabilities align with the labels is a quality question distinct from how grouping changes them. Staying below the cutoff does not resolve that question.

We chose these two examples after inspecting the results: the unsaved-draft message had the only team-choice change, and the empty-workspace message had Standard's largest probability shift. They illustrate observed effects, not their typical size or frequency.

## What this tells us about choosing a model

**Evaluate both the model and the questions you plan to send together.** The documented designs suggest different checks:

- **Jev:** question isolation does not guarantee identical answers across repeated calls. Check repeat variation against the margins around your application's cutoffs.
- **Standard:** test whether grouping related questions helps the decisions you need, and recheck existing answers when the question set changes.
- **Hosted Flash:** start with one question per request and account for state billed per question. Verify current response and usage behavior separately from this historical run; do not treat a multi-question API request as joint evaluation.

The same submitted arrangements let us compare recorded outputs, not establish identical internal processing or each model's best possible deployment. Choose using **decision quality on representative cases**, **behavior when questions change**, and **cost, response time, and reliability for the completed workflow**.

## Try the same check in your application

Start with messages representative of your users and write down the expected decisions under an explicit policy, noting any disputed labels. Compare arrangements appropriate to the model: ask separately or together, then add your proposed question in the way you intend to use it. Keep the original wording and action rules fixed during the comparison.

Repeat the same cases to see how much answers vary. Compare the decisions the application would take, as well as the numbers behind them. If the results lead you to change instructions or thresholds, check the revised version on fresh examples you did not use to tune it.

**Food for thought:** If you added a question for analytics tomorrow, would you notice if it changed where today's support tickets were sent?

## Inspect the results and method

The supporting sections below retain the full comparison, numerical discrepancies, and cost accounting. They let you inspect the evidence beyond the two highlighted examples.

<details>
<summary>See quality measures for every model and arrangement</summary>

The severity scale uses 0 for no disruption, 1 for a blocked task, and 2 for possible data loss or a widespread outage.

The **Brier score** is the average squared gap between a missing-data probability and its binary label. **Severity MAE** is the average absolute gap between a severity score and its rubric label. Lower is better for both. Each row covers the same 24 labelled tickets and all five repetitions; repeated calls do not create additional independent tickets. Metrics retain the provider-reported scores, including those flagged below.

| Model | Arrangement | Missing-data Brier | Matches to accepted team labels | Severity MAE |
| --- | --- | ---: | ---: | ---: |
| Standard | A | 0.000547 | 24/24 | 0.025594 |
| Standard | B | 0.002508 | 24/24 | 0.014361 |
| Standard | C | 0.004045 | 24/24 | 0.009760 |
| Flash | A | 0.025266 | 23/24 | 0.039829 |
| Flash | B | 0.026558 | 24/24 | 0.048602 |
| Flash | C | 0.026073 | 23/24 | 0.056789 |
| Jev | A | 0.002596 | 24/24 | 0.046667 |
| Jev | B | 0.002573 | 24/24 | 0.044167 |
| Jev | C | 0.002615 | 24/24 | 0.045583 |

Team choices were consistent across the five repetitions of each ticket/arrangement combination. These measures use the original accepted labels, including the disputed team assignment for T20. Brier and severity MAE summarize numerical error; they do not directly measure how many application actions changed or establish probability calibration on real support traffic.

Standard's increase in missing-data Brier score is driven by T23, the empty-workspace message; changes on the other tickets collectively offset a small part of that increase. Its severity MAE decreased with grouping, but there was no severity action rule. These aggregate movements do not establish a general benefit or disadvantage from grouping.

</details>

<details>
<summary>See how much repeated answers varied</summary>

There are 72 message/arrangement combinations per model: 24 messages under A, B, and C. Within each combination, Standard and Flash returned identical missing-data probabilities and severity scores across the five repetitions. This observation does not establish that their services always return identical answers or explain whether caching was involved.

Jev's missing-data probability varied in 26 of its 72 combinations, with a maximum range of 0.03 (3 percentage points). Its largest absolute difference between arrangement mean probabilities was 0.004 (0.4 percentage points). Those differences sit alongside the observed repeat variation, so this pilot cannot confidently attribute them to asking the questions together. They are consistent with Jev's documented question isolation, but do not independently prove that mechanism. Its severity score varied in 20 combinations, by at most 0.10.

</details>

<details>
<summary>Read about the 34 numerical warnings</summary>

All 1,800 completed responses passed the format checks. Separately, **34 of Jev's 360 severity answers** contained a reported score that differed by 0.01 from the score calculated using the returned probabilities. There were no probability-sum or choice-maximum warnings.

For this check, we calculated a score by multiplying each severity level (0, 1, or 2) by its returned probability and adding the results. That lets us compare the supplied score with the distribution supplied alongside it.

Rounding is a plausible explanation for the discrepancies, but the run does not establish the cause. We kept both values, flagged the differences, and used the original provider-reported scores in the quality measures. The [score comparison file](../../examples/pplx-question-grouping/score-comparison.csv) includes both values for inspection. These warnings identify a numerical consistency issue; by themselves, they do not establish that Jev made worse support decisions.

</details>

<details>
<summary>Read the experiment design and its limits</summary>

The run used these requested model names: Perplexity Standard `pplx-decider-v1.2`, Perplexity Flash `pplx-decider-flash-v1.2`, and TypeSafe `jev-1.13.0`. Request names and returned model fields are preserved with the responses; this experiment does not independently identify the underlying serving implementation.

Codex drafted 24 synthetic tickets: eight clear missing-data reports, eight clear nonmissing cases, and eight difficult cases. Yusuf reviewed all 24 and accepted the proposed labels before the full run. This was not an independently blinded labelling exercise. Labels describe what a fictional message reports under the supplied policy, rather than proving that data was actually lost.

The constructed difficult cases often correspond to explicit instruction clauses: unsaved drafts, filters, hypothetical concerns, another product, an empty list, and conflicting reports. They test those specified distinctions; they do not establish broad performance on unfamiliar ambiguity. The routing ambiguity identified above is a later interpretation of the preserved records, not a change to the accepted labels or reported metrics.

Each model processed every ticket under A, B, and C five times. A needed three requests, while B and C needed one each: **24 tickets × 3 models × 5 repetitions × (3 + 1 + 1) requests = 1,800 planned requests**. The runner shuffled model/ticket/configuration blocks within each repetition using a fixed seed. Question order within grouped requests stayed fixed.

The run completed all planned requests in approximately 16 minutes 13 seconds. One Perplexity Standard request timed out and succeeded on retry, giving 1,801 attempts and no missing result cells. The runner limited requests to two per second, so total runtime is not a model-speed benchmark.

The scope is one contact-manager policy, 24 constructed tickets, one fixed primary questionnaire, one question order, and one extra callback question. Five repetitions help describe variation on those cases; they do not expand the dataset to hundreds of independent examples. The results cannot establish universal grouping behavior or an overall model winner.

Adding the callback question introduces new wording and changes the amount of content and the request structure together. This comparison cannot identify which of those changes caused the observed effect.

</details>

<details>
<summary>See the cost accounting</summary>

| Component | USD |
| --- | ---: |
| Calculated cost from returned usage and the run's recorded rates | 0.025249680 |
| Reserved allowance for the timeout with unknown usage | 0.000163840 |
| Total accounted budget | 0.025413520 |

The total is about **2.54 US cents**, or 5.08% of the authorized $0.50 ceiling. The timeout allowance is not a confirmed charge, and the usage calculation is not an independently checked invoice. These figures cover this full run, excluding earlier connection checks. The recorded rates are historical inputs to this calculation, not a current price quote.

</details>

<details>
<summary>Inspect the inputs and complete results</summary>

The examples above are **T20, the unsaved draft**, and **T23, the empty workspace**, in that order. All other cases remain available alongside them:

- **Frozen inputs:** [24 tickets](../../examples/pplx-question-grouping/tickets.json), [accepted labels and rationales](../../examples/pplx-question-grouping/labels.json), [exact questions and criteria](../../examples/pplx-question-grouping/questions.json), and [protocol](../../examples/pplx-question-grouping/protocol.json).
- **Complete results:** [read the generated report](../../examples/pplx-question-grouping/report.md), [per-ticket probabilities](../../examples/pplx-question-grouping/per-ticket.csv), [summary metrics](../../examples/pplx-question-grouping/summary.json), and [raw response records](../../examples/pplx-question-grouping/results.jsonl).
- **Numerical checks:** [all warnings](../../examples/pplx-question-grouping/numerical-warnings.json) and [reported and calculated scores](../../examples/pplx-question-grouping/score-comparison.csv).
- **Reproducibility:** [request schedule and payloads](../../examples/pplx-question-grouping/requests.jsonl), [run manifest](../../examples/pplx-question-grouping/manifest.json), and [verification record](../../examples/pplx-question-grouping/full-run-verification.json).

The evidence comes from completed Perplexity and TypeSafe API calls in the run conducted for this case study. The verification performed for that run checked the frozen inputs, request schedule, all 1,800 responses, numerical diagnostics, quality calculations, threshold decisions, and cost arithmetic. This presentation revision preserves the original records and does not rerun the experiment. The linked generated report is the frozen October 18 output; its contemporary explanations have not been rewritten to reflect the October 20 hosted API clarification. The protocol retains its historical `draft_for_review` status; the completed run and verification records document what followed.

</details>



[Back to the Perplexity Decisions guide](guide.md#see-a-recorded-experiment) · [Compare Jev, Standard, and Flash](model-comparison.md) · [Plan your own evaluation](guide.md#evaluate-an-existing-workflow)
