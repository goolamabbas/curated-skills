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

Reserve held-out cases for evaluating the selected design. Avoid tuning
and reporting success on the same small sample.

## Compare meaningful alternatives

Compare the existing workflow and simpler plausible approaches.
When considering Flash, evaluate it against the standard model using
the intended request shapes.

Record state preparation, question wording, rubric, grouping, requested
model, and policy. Change one factor at a time when diagnosing failures.

Test alternative groupings deliberately. Do not combine results from
different groupings as though they came from one unchanged predictor.

## Tune policy to consequences

Inspect distributions and resulting actions. Choose thresholds using
the error tradeoffs and review capacity of the application.

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
Investigate unexpected usage against the submitted input and grouping, accounting
for the unresolved splitting behavior described in the snapshot. Sum known billed retry usage too,
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
