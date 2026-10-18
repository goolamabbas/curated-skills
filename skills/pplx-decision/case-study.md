# If you ask an AI one more question, can it change an answer you already depend on?

**Experiment run on 18 October 2026 · 24 fictional support tickets**

Imagine a support application that uses AI to decide which team should receive a customer's message. Later, you add a question to find out whether the customer wants a phone call. The message is the same. The instructions for choosing a team are the same. Would you expect the selected team to change?

In one case in this experiment, it did. That makes this a useful example of what to check when changing an AI application. It gives us one consideration when choosing a model, but does not tell us which model is best for someone else's application.

## Start with the decisions the application needs

Our fictional application manages contacts. When a customer sends a support message, the application needs three answers:

1. **Does the customer report missing data that was previously saved?** This helps identify cases that might need a missing-data review.
2. **Who should handle the message?** The options are Technical Support, Billing, and Other / Needs Review.
3. **How serious is the current problem?** The scale runs from no disruption, through a blocked task, to possible data loss or a widespread outage.

Here, the AI supplies values the program can use: a team name, a probability, and a severity score. The developer writes the instructions for these judgments and the rules for acting on the answers. For example, the support policy must say whether a resolved technical incident still belongs with Technical Support.

There is another choice to make: **how many questions should the application ask at once?**

## Asking separately and asking together

A request is one submission to the model, containing the information to assess and the question or questions to answer. The developer could send the customer message three times, asking one question in each request. Or send the message once with all three questions.

We call that second arrangement **grouping questions**: putting several questions about the same information into one request. It describes how the application asks, not how it sorts customers or their messages.

| Arrangement | What the application sends |
| --- | --- |
| A · Separate | Three requests, each containing the same customer message and one of the three questions |
| B · Together | One request containing the message and all three questions |
| C · Plus callback | The same request as B, with a fourth question asking whether the customer explicitly requests a phone call |

The callback answer was ignored by our application's decision rules. We added it to find out whether a question the application does not yet use could still affect an answer it already depends on.

The root question is: **can we change which questions we ask together without changing the decisions our application makes?** Comparing A with B tests asking separately versus together. Comparing B with C tests adding one more question. The message and original question wording stay fixed in both comparisons.

## What we tested

We used the same **24 fictional customer messages** with three models: Perplexity Standard, Perplexity Flash, and TypeSafe Jev. Each model saw every message under all three arrangements, and we repeated each arrangement five times to see how much the answers varied.

To assess the results, we recorded expected answers under our support policy. These were proposed by the assistant and reviewed and accepted by Yusuf, the maintainer of this case study, before the run. Throughout this case study, “correct” means matching those accepted answers. The limits of that review are described in the method below.

The full run completed 1,800 requests. That number includes the repeated trials and the three requests needed when asking separately. **There were still only 24 distinct situations.** The repetitions help us examine consistency on those situations; they do not make this a broad test of customer-support accuracy.

## Adding a question changed where one message would go

Here is one of the messages, reproduced exactly:

> I typed a new contact into a form but never clicked Save. The tab closed and that unsaved draft was lost. I entered it again successfully; all previously saved records are intact.

Our policy assigns follow-ups about resolved technical incidents to **Technical Support**. Perplexity Flash chose:

| Arrangement | Team selected in all five repetitions |
| --- | --- |
| A · Separate | Other / Needs Review |
| B · Together | Technical Support |
| C · Plus callback | Other / Needs Review |

When the three questions were asked together, Flash selected the accepted team. When the callback question was added, it selected a different team. A program following that team answer would therefore send the same message to a different destination.

This was the only message with a team-choice change across arrangements. Flash matched the accepted team on 23 of 24 messages in A, all 24 in B, and 23 in C. Standard and Jev matched all 24 under every arrangement. Another organization could use a different policy for resolved incidents, so the expected destination matters when interpreting the result.

Notice that **a changed answer is not automatically a worse answer**. Moving from A to B improved this routing answer under our policy; moving from B to C made it worse. The lesson is to check what changed and whether it still serves the application's purpose.

## A changed number does not always change the action

Some model answers are numbers rather than team names. Our missing-data question returns a probability: a number between 0 and 1 estimating whether the message meets the definition in the instructions. A value of 0.8 corresponds to 80%; it is an estimate about the report, not proof that data was lost.

We set the application to send a case for missing-data review when that number is **at least 0.8**. This cutoff is called a threshold. A number can move while remaining below that cutoff, leaving the review decision unchanged.

Consider this message:

> This workspace list is empty. I cannot remember whether I saved any contacts here or whether this is a new workspace. I cannot continue the import task until support helps me check.

Our instructions say not to infer missing saved data from an empty list without evidence that it previously held saved data. The expected answer to the missing-data question is therefore **no**. The blocked import task can still need Technical Support; that is a separate decision.

| Model | A · Separate | B · Together | C · Plus callback |
| --- | ---: | ---: | ---: |
| Perplexity Standard | 0.113854 | 0.245317 | 0.311548 |
| Perplexity Flash | 0.773852 | 0.797922 | 0.790346 |

Standard's estimate rose from about 11% to 31%. Flash came much closer to the cutoff, but even its highest value, 0.797922, stayed below 0.8. Each value repeated across all five trials of its arrangement. None triggered missing-data review.

Across the full run, all 1,080 missing-data answers produced the expected yes/no review decision at this threshold, and none changed sides when the questions were rearranged. This shows why we need to inspect both the model's numbers and the application's actions. It does not establish that 0.8 is a suitable threshold for real customer messages.

We chose these two examples after inspecting the results: the resolved-draft message had the only team-choice change, and the empty-workspace message had Standard's largest probability shift. They show what happened, not how large or common an effect to expect elsewhere.

## What this tells us about choosing a model

**This experiment adds a question to your model evaluation: how does this candidate behave when the application's questionnaire changes?** That matters when you expect to add questions for new features, reporting, or analytics.

It does not settle whether to choose Perplexity Standard, Perplexity Flash, or Jev. We tested one support policy on 24 constructed messages. A different application may have different language, ambiguity, priorities, and consequences for mistakes. The findings do not justify “Jev is always stable,” “Flash is unsuitable,” or “Standard is the best model.”

Jev's missing-data probabilities showed small differences between arrangements, alongside variation when we repeated the same arrangement. This pilot cannot confidently separate those differences from ordinary variation between calls. Standard and Flash repeated the same missing-data probabilities and severity scores within each arrangement in this run; that does not guarantee identical answers in future runs.

Stability also needs to be judged alongside correctness. An answer can stay the same and remain wrong. Our Flash example shows the other possibility: changing the arrangement can produce a better answer. For Standard, asking together brought severity scores closer to the accepted answers while moving missing-data probabilities farther from their expected values. There was no single arrangement that improved every measure.

To choose a model for your application, the next evaluation needs to answer:

- **Does it make the decisions you need on representative examples?** Include difficult cases and decide which mistakes matter most, such as missing a serious problem versus sending too many cases for review.
- **Does it still work with the questions you actually send?** Compare the proposed arrangements and recheck existing answers when you add or change a question.
- **Does the completed workflow fit your needs?** Compare cost, response time, reliability, and integration requirements for the quality you need.

Our run gives a concrete example of the second question and limited evidence on the first. It does not establish those trade-offs for someone else's application. Its most useful contribution is a small evaluation pattern that readers can repeat with their own cases.

## Try the same check in your application

Start with messages representative of your users and write down the expected decisions under an explicit policy. Ask the existing questions separately and together, then add your proposed new question. Keep the original wording and action rules fixed during the comparison.

Repeat the same cases to see how much answers vary. Compare the decisions the application would take, as well as the numbers behind them. If the results lead you to change instructions or thresholds, check the revised version on fresh examples you did not use to tune it.

**Food for thought:** If you added a question for analytics tomorrow, would you notice if it changed where today's support tickets were sent?

## Inspect the results and method

The supporting sections below retain the full comparison, numerical discrepancies, and cost accounting. They let you inspect the evidence beyond the two highlighted examples.

<details>
<summary>See quality measures for every model and arrangement</summary>

The severity scale uses 0 for no disruption, 1 for a blocked task, and 2 for possible data loss or a widespread outage.

The **Brier score** is the average squared gap between a missing-data probability and its binary label. **Severity MAE** is the average absolute gap between a severity score and its rubric label. Lower is better for both. Each row covers the same 24 labelled tickets and all five repetitions; repeated calls do not create additional independent tickets. Metrics retain the provider-reported scores, including those flagged below.

| Model | Arrangement | Missing-data Brier | Correct team labels | Severity MAE |
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

Team choices were consistent across the five repetitions of each ticket/arrangement combination. A simple rule that always selected Technical Support would match 18 of 24 team labels, or 75%, on this dataset. These results describe performance against the supplied labels; they do not establish probability calibration or production accuracy.

</details>

<details>
<summary>See how much repeated answers varied</summary>

There are 72 message/arrangement combinations per model: 24 messages under A, B, and C. Within each combination, Standard and Flash returned identical missing-data probabilities and severity scores across the five repetitions. This observation does not establish that their services always return identical answers or explain whether caching was involved.

Jev's missing-data probability varied in 26 of its 72 combinations, with a maximum range of 0.03. Its largest absolute difference between arrangement mean probabilities was 0.004. Those differences sit alongside the observed repeat variation, so this pilot cannot confidently attribute them to asking the questions together. Its severity score varied in 20 combinations, by at most 0.10.

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

The assistant drafted 24 synthetic tickets: eight clear missing-data reports, eight clear nonmissing cases, and eight difficult cases. Yusuf reviewed all 24 and accepted the proposed labels before the full run. This was not an independently blinded labelling exercise. Labels describe what a fictional message reports under the supplied policy, rather than proving that data was actually lost.

Each model processed every ticket under A, B, and C five times. A needed three requests, while B and C needed one each: **24 tickets × 3 models × 5 repetitions × (3 + 1 + 1) requests = 1,800 planned requests**. The runner shuffled model/ticket/configuration blocks within each repetition using a fixed seed. Question order within grouped requests stayed fixed.

The run completed all planned requests in approximately 16 minutes 13 seconds. One Perplexity Standard request timed out and succeeded on retry, giving 1,801 attempts and no missing result cells. The runner limited requests to two per second, so total runtime is not a model-speed benchmark.

The scope is one contact-manager policy, 24 constructed tickets, one fixed primary questionnaire, one question order, and one extra callback question. Five repetitions help describe variation on those cases; they do not expand the dataset to hundreds of independent examples. The results cannot establish universal grouping behavior or an overall model winner.

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

The exact example messages above are tickets T23 and T20. All other cases remain available alongside them:

- **Frozen inputs:** [24 tickets](../../examples/pplx-question-grouping/tickets.json), [accepted labels and rationales](../../examples/pplx-question-grouping/labels.json), [exact questions and criteria](../../examples/pplx-question-grouping/questions.json), and [protocol](../../examples/pplx-question-grouping/protocol.json).
- **Complete results:** [read the generated report](../../examples/pplx-question-grouping/report.md), [per-ticket probabilities](../../examples/pplx-question-grouping/per-ticket.csv), [summary metrics](../../examples/pplx-question-grouping/summary.json), and [raw response records](../../examples/pplx-question-grouping/results.jsonl).
- **Numerical checks:** [all warnings](../../examples/pplx-question-grouping/numerical-warnings.json) and [reported and calculated scores](../../examples/pplx-question-grouping/score-comparison.csv).
- **Reproducibility:** [request schedule and payloads](../../examples/pplx-question-grouping/requests.jsonl), [run manifest](../../examples/pplx-question-grouping/manifest.json), and [verification record](../../examples/pplx-question-grouping/full-run-verification.json).

The evidence comes from completed Perplexity and TypeSafe API calls in the user's run. Offline verification checked the frozen inputs, request schedule, all 1,800 responses, numerical diagnostics, quality calculations, threshold decisions, and cost arithmetic. The original run records were preserved.

</details>



[Back to the Perplexity Decisions guide](README.md#see-a-recorded-experiment) · [Compare Jev, Standard, and Flash](model-comparison.md) · [Plan your own evaluation](README.md#evaluate-an-existing-workflow)
