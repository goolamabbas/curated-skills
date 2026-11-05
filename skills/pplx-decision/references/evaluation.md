# Evaluate a Decisions workflow

Evaluate the application outcome, not just whether responses parse.

## Define the decision being tested

Identify the baseline and what improvement would justify adoption.
Choose metrics reflecting the task: missed urgent cases, incorrect
automation, ranking quality, review workload, or user-visible latency.

Make asymmetric error costs explicit. A high average accuracy can conceal
unacceptable performance on an important category.

## Build representative evidence

Use labeled examples or independently observed outcomes. Keep model
predictions separate from ground truth.

Include ordinary cases, category overlaps, missing evidence, out-of-scope
inputs, and cases near action thresholds. Add adversarial or conflicting
content when relevant to the application.

Use development cases to refine questions and thresholds, then freeze the design
before assessing held-out cases. Keep representative traffic separate from
deliberately difficult stress cases; report both. Avoid tuning and reporting
success on the same small sample.

## Compare meaningful alternatives

Compare the existing workflow and simpler plausible approaches.
When considering Flash, evaluate it against the standard model using
the intended request shapes.

Record state preparation, question wording, rubric, grouping, requested
model, and policy. Change one factor at a time when diagnosing failures.

Test alternative Standard groupings deliberately. Hosted Flash processes questions
separately; distinguish the submitted request layout from joint model context.
Do not combine results from different configurations as one unchanged predictor.
Keep Standard grouping fixed while tuning thresholds for a configuration;
if grouping changes, re-evaluate those thresholds. Leave input headroom to avoid
automatic splitting unexpectedly changing the evaluated question context.

## Tune policy to consequences

Inspect distributions and resulting actions. Choose thresholds using
the error tradeoffs and review capacity of the application. Compare candidate
workflows against the same acceptance criteria; their numerical thresholds need
not be identical.

Check repeated runs around important boundaries. Where variation causes
unstable actions, consider a review band or other explicit policy.

The [ticket-triage cookbook](https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-ticket-triage/README.md#reading-the-numbers)
reports a 2026-09-29 example ranging from 0.29 to 0.32 across five runs; a 0.30
cutoff changed its route. Test current boundary behavior and check resulting
errors on independently labeled held-out cases, rather than moving a threshold
solely to clear one cluster.

When choice confidence is low, inspect option coverage, overlapping categories,
and missing evidence. A missing category is one explanation, not a conclusion
that follows from low confidence alone.

Do not confuse a high model confidence with demonstrated accuracy.
Assess calibration when probabilities drive consequential thresholds.

For rubric-based decisions, evaluate whether an expected score hides
important probability on extreme levels.

Keep examples from documentation as examples, not universal cutoffs.

### Optional confidence diagnostic

During an already-authorized evaluation, optionally compare returned `choice` and
`score` confidence with the [Perplexity calculation](api-snapshot.md#confidence-calculations)
applied to the returned probabilities. Use numeric rubric order, the documented
single-option/level case, and a rounding tolerance. Where score modes tie,
mark the check inconclusive unless the provider's tie rule is known.

A separate optional statistic can use the [TypeSafe formula](https://docs.typesafe.ai/confidence).
Its score baseline differs from Perplexity's; label it as a comparison statistic,
not corrected Perplexity confidence. Record formulas and source dates. Neither
agreement with a formula nor a different statistic establishes calibration;
evaluate action thresholds against labelled outcomes. These checks need no extra
inference calls and do not test question-grouping effects.

## Evaluate evidence acquisition

When current public evidence matters, compare supplied-state-only, built-in
grounding and application-managed retrieval where each is a plausible design.
Use the same labelled cases and application acceptance criteria; report retrieval
and request-design differences rather than assuming equal evidence.

Include ambiguous entities, changing facts, irrelevant or conflicting sources, and
missing evidence. Inspect evidence sufficiency separately from answer probability.
Record source content, dates and retrieval settings where retention is appropriate.
Keep fixed-evidence decision tests separate from live end-to-end tests, since web
evidence can change between runs. Simulated retrieval failures test application
handling; they do not establish the provider's observed failure rate.

Report retrieval charges separately from the token-based inference subtotal, including completed retrieval in requests that later failed. Sum the token subtotal, retrieval charges and other workflow costs once to obtain the total. Mark unobserved costs as estimates or unknown. See
[web-grounding.md](web-grounding.md) for billing observability and estimate assumptions.

With grounding on either Perplexity model, changing the question set can change the shared retrieved evidence, even though Flash evaluates questions separately. Keep the question set and retrieval configuration fixed while tuning thresholds; test modifications and use saved evidence when isolating decision behaviour.

## Measure the full workflow

Measure end-to-end latency, usage, throughput, retries, fallbacks, and
downstream review or generative work. Report tail behavior where it matters.

Separate first-request setup from steady-state measurements.
Use current pricing and observed usage for cost calculations.

For input-only token billing, compute:

`inference_cost_usd = sum(input_tokens_for_request * usd_per_million_input_tokens / 1_000_000)`

Use the applicable model's rate; [api-snapshot.md](api-snapshot.md#grouping-models-and-billing)
contains dated rates and source links. Recheck billing terms when they change.
Calculate from returned usage; do not add speculative repeated-state charges.
Investigate unexpected usage against the submitted input: Standard repeats state
per processing group when split, and hosted Flash repeats it per question.
Returned usage already counts that repetition; do not charge it twice.
Sum known billed retry usage too,
and mark failed-call costs unknown when usage is absent. Estimate missing costs
explicitly instead of treating them as zero. Keep retrieval, generation, review,
and other downstream costs separate from this inference subtotal.

Document sample size, workload, concurrency, and measurement conditions.

## Decide and preserve evidence

State whether the design meets the acceptance criteria, which errors
remain, and what further evidence would change the recommendation.

Keep raw results and independently obtained labels so policy changes can
be replayed. Re-run inference when evidence, questions, grouping, or
model behavior changes.

Reassess after provider model changes even when the requested model
string stays the same.

If live calls are unavailable, verify request construction and policy behavior
with clearly labeled fixtures and identify the measurements still needed.
