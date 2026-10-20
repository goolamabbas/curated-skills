# Port a TypeSafe or Jev workflow

Preserve the application's intended decisions, not merely its JSON structure.
Read the actual request builder, answer consumer, thresholds, and tests before
choosing changes. A migration request does not require a separate whole-project
opportunity audit.

## Verify both contracts

Consult the current [TypeSafe API](https://docs.typesafe.ai/api.md), installed SDK
types, and [Perplexity schema](https://docs.perplexity.ai/api-reference/decisions-post.md).
Use the [Perplexity baseline](api-snapshot.md) as a dated fallback. Verify both
providers' field names, criteria shapes, limits, and missing-answer behavior.

## Reconsider grouping first

TypeSafe's [state guide](https://docs.typesafe.ai/concepts/state.md) describes
independent question evaluation; its [fan-out guide](https://docs.typesafe.ai/patterns/fan-out.md)
encourages speculative branch questions whose unused results code ignores.
Perplexity's [v1.2 guidance](https://docs.perplexity.ai/docs/decisions/quickstart.md#grouping-questions-in-one-request)
says Standard questions see the others in their processing group. An unused
speculative question can therefore change an answer the application consumes.
Hosted Flash evaluates each question separately, repeating and billing state
per question. Do not infer joint hosted behavior from the Flash checkpoint card.

Classify the original questions by their relationship:

- Related facets of one decision may form a useful group on Standard.
- Independently scored candidates should start in separate requests.
- Intentional comparisons on Standard can benefit from joint context; justify and evaluate them.
- Hosted Flash should start with one question per request. Sending several together does not create joint context or shared-state savings.
- A branch needing newly retrieved evidence or generated options is a later stage.

Review speculative fan-out for Standard context effects and Flash's repeated-state
cost. Keep request composition fixed during comparison and retune policy on the new model.
Isolation is a baseline for independent judgments, not a universal prohibition
on comparisons.

## Recalculate state, capacity, and cost

Client-side candidate fan-out repeats the shared context actually sent to each
request. Keep only relevant state without discarding necessary relationships;
N candidates need not mean N copies of the entire original state. Consider a
cheap prefilter before model scoring when quality permits.

Account for requests per user action, shared organizational traffic, retries,
concurrency, and input-token bursts using the [current limits](api-snapshot.md#limits-and-images).
Do not transfer TypeSafe batching latency or billing assumptions. Compare the
whole path using [evaluation.md](evaluation.md), including any retrieval and
generative work that remains.

## Adapt transport and interpretation

Use a verified supported Perplexity SDK interface if one exists for the installed
version; otherwise write a thin wrapper around the documented HTTP endpoint.
The reviewed cookbook uses HTTP for Decisions and a separate SDK for Agent API
calls; that is not evidence for a `client.decisions.*` method.

Put complete question meaning in instructions. The [Standard](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)
and [Flash](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) model cards
say question IDs are hidden and question order is visible in their documented
implementation. The [hosted API reference](https://docs.perplexity.ai/api-reference/decisions-post)
does not specify either behavior; do not treat the model-card description as a
hosted-API guarantee. Keep question order fixed when comparing runs.
Use meaningful choice-option names, particularly when their descriptions are null.
Structured instructions can clarify definitions and exclusions, but preserve each
primitive's outer criteria shape.

Treat response similarities as interface conveniences, not calibrated equivalence.
Noul has no separate confidence; choice/score confidence is distinct from the
selected probability. TypeSafe [publishes its confidence formulas](https://docs.typesafe.ai/confidence).
Perplexity's [published choice formula](https://docs.perplexity.ai/docs/decisions/quickstart)
matches TypeSafe's for more than one option. Their score formulas normalize
distance differently: Perplexity's baseline is the average distance of all levels
from the most likely level; TypeSafe's is measured from the rubric midpoint.
Both are normalized. Perplexity's three-level example has spread about 0.2161:
dividing by 1 gives confidence about 0.78, while TypeSafe's baseline of 2/3 gives
about 0.68. See the [exact Perplexity formulas](api-snapshot.md#confidence-calculations).
Matching formulas do not establish matching predictions or calibration;
reevaluate probability and confidence thresholds on the target provider and model.
Check score-index meaning, string probability keys, answer
IDs, and required values explicitly. Follow [implementation.md](implementation.md)
for invalid responses, splitting, image checks, and retry handling.

## Establish behavioral equivalence or an intentional change

Compare old and new application outcomes on independently labeled cases. Include
unused speculative questions, candidate-set changes, missing context, and cases
near action boundaries. Reevaluate thresholds even if names and numeric ranges
match. Measure end-to-end cost and latency under realistic shared capacity.

Report preserved and changed behavior, test results, and outstanding measurements.
Respect the requested review/deployment boundary and existing inference budget.
