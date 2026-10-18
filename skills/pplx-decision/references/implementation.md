# Implement Perplexity Decisions

Verify the relevant [endpoint schema](https://docs.perplexity.ai/api-reference/decisions-post.md)
and [model guidance](https://docs.perplexity.ai/docs/decisions/quickstart.md) before
coding; reuse documentation already checked in this task. The
[dated API snapshot](api-snapshot.md) provides an offline baseline.

## Connect to the API

Send JSON to POST https://api.perplexity.ai/v1/decisions with bearer
authentication. Supply model, state, and named questions; consume answers
by question ID.

Use the project's HTTP client or a verified SDK interface. Do not assume
chat-completions compatibility or invent client methods.

Keep credentials server-side. Validate required configuration before
requests, and avoid exposing sensitive inputs in diagnostics.

## Design the decision

Define the downstream behavior before writing questions.

Supply the evidence needed for the judgment. Separate trusted policy from
untrusted content and distinguish missing evidence from negative evidence.
For example, state can contain `{"trusted_context": {"account_tier": "paid"},
"user_content": {"message": "Please refund my order"}}`. Set those fields from
their actual sources; labels alone do not confer trust. Keep behavioral instructions
and rubric definitions separate from quoted content. Policy documents needed as
evidence may belong in labeled context. Serialized state and image order reach the
model in place; preserve meaningful ordering. JSON separation is not a security
boundary—permissions and action validation remain in code.

Use structured instructions when definitions or exclusions need clarity, while
preserving each type's criteria shape. Do not hide a complex reasoning task in a
vague classification question; show that decomposition retains the needed evidence.

For choice, describe category boundaries and include an appropriate
no-match outcome. For score, define observable ordered levels.
For multi-label behavior, consider a noul question per label.

When extracting a value through selection, construct candidates first
and preserve their source mapping. Check candidate coverage.

## Choose grouping and model

For standard v1.2, group related facets; isolate independent candidates.
For Flash v1.2, default to one question, testing multi-label or routing
groups where useful. Intentional comparisons, such as duplicate detection,
can warrant grouping; evaluate that choice explicitly.

Grouping affects predictions. Changing it requires reevaluation.

Prefer a selected versioned name for evaluated deployments. Use an alias when
automatic upgrades are intentional and evaluated. Retired versions can also
reroute; the returned name echoes the request and does not establish immutable
serving identity. Check change notices and revalidate affected thresholds.

Budget state, questions, and images together below the documented input limit
with headroom. The [snapshot](api-snapshot.md#grouping-models-and-billing) records
unresolved rejection-versus-splitting guidance; do not rely on server splitting.
Split deliberately when needed, preserve related groups, and reevaluate changed
grouping. If state alone is too large, splitting questions cannot fix it. Correct
limit-related 400s before resubmission. Compare usage with input size and grouping;
elevated usage is a diagnostic signal, not proof of server splitting.

## Consume answers explicitly

Keep transport, decision interpretation, policy, and execution separable.

For score, distinguish the expected rubric index from probability on
individual levels. Choose the statistic that matches the policy.

Validate required answer IDs, types, and numeric values. A missing answer
is an integration failure, not probability zero.

Keep application explanations traceable to the rule and evidence used.
Do not label these explanations as the model's internal reasoning.

## Small offline example

This synthetic request asks one rubric question. Its versioned model is from the
[snapshot](api-snapshot.md); check current availability before sending it.

```json
{
  "model": "pplx-decider-v1.2",
  "state": {
    "trusted_context": {"service": "team workspace"},
    "user_content": {"message": "All of our team's saved reports disappeared."}
  },
  "questions": {
    "severity": {
      "type": "score",
      "instructions": "Rate the impact described in user_content.message.",
      "criteria": ["No disruption", "A workflow is blocked", "Data loss or widespread outage"]
    }
  }
}
```

The consumer checks the expected rubric distribution before using its highest
level. It returns a route from a parsed HTTP success body, using an illustrative
0.25 action threshold. The configurable sum tolerance of 1e-3 is an application
starting value for this small rubric, separate from the action threshold. It accepts
small rounding differences while rejecting materially inconsistent distributions.

```python
import math

PROBABILITY_SUM_TOLERANCE = 1e-3

def route(body, *, sum_tolerance=PROBABILITY_SUM_TOLERANCE):
    if (type(sum_tolerance) not in (int, float) or sum_tolerance < 0
            or not math.isfinite(sum_tolerance)):
        raise ValueError("Expected a finite nonnegative sum tolerance")
    answer = body["answers"]["severity"]  # missing fields fail, never become zero
    if answer["type"] != "score":
        raise ValueError("Expected a score answer")
    probabilities = answer["probabilities"]
    if not isinstance(probabilities, dict) or set(probabilities) != {"0", "1", "2"}:
        raise ValueError("Incomplete or unexpected rubric probabilities")
    values = list(probabilities.values())
    if any(type(p) not in (int, float) or not 0 <= p <= 1
           or not math.isfinite(p) for p in values):
        raise ValueError("Invalid probability")
    if not math.isclose(sum(values), 1.0, rel_tol=0.0, abs_tol=sum_tolerance):
        raise ValueError("Probabilities do not sum to one")
    return "escalate" if probabilities["2"] >= 0.25 else "review"
```

Integration code normalizes structural and value failures (`KeyError`, `TypeError`,
`ValueError`) into its unavailable-result path; catching only `ValueError` misses
absent fields. Record validation failures so fallback use is visible. Tune the sum
tolerance to observed precision and rubric size; the API specifies approximately
normalized distributions without a numeric tolerance. Accepted values remain
unchanged: renormalizing could move a probability across the action threshold.
This policy reads the critical-level probability; validate any additional fields
consumed by other policies.

## Handle operational failures

Use shared rate throttling across workers and models, plus bounded concurrency.
Concurrency alone does not enforce requests per second. Budget other organization
traffic and token bursts against the [published limits](api-snapshot.md#limits-and-images).

| Response | Handling |
| --- | --- |
| 400, 401, 404, 405, 413 | Correct request, configuration, or size; do not retry unchanged. |
| 429 | Respect Retry-After; bound attempts and total elapsed time. |
| 504 or response timeout after sending an image request | Verify dimensions/tile limits first; correct invalid images before resubmission. If valid, use the transient-failure policy. |
| Other transient 5xx/network failure, or an image failure after valid size checks | Back off within a retry/time budget; avoid duplicate downstream actions. |

Apply image validation before sending and before retrying an image response
failure. A client may time out before the server's delayed 504 arrives; do not
extend its deadline merely to wait for that status. Connection-establishment and
connection-pool timeouts do not identify an image-processing fault. Treat them
according to their cause and the retry budget. A response timeout or 504 alone
also does not prove that an image is oversized.

Check status before parsing JSON; 404/405 may be empty and 504 may be HTML.
Read `error.message` and `error.type` where available; do not dispatch on the
inconsistently typed `error.code`. Use the project's timeout policy or the
[configurable starting values](api-snapshot.md#timeout-starting-values), then
adjust from measured workload behavior.

Use an explicit unavailable-result path. Ensure retries of inference
cannot duplicate downstream actions.

Check current request and image limits. Supply supported image data URLs,
not remote image links. Check dimensions and tile count before sending; see the
[snapshot](api-snapshot.md#limits-and-images) for formats, limits, and documented
rounding. Label stricter client checks as conservative. If resizing is needed,
preserve evidence required by the question rather than silently removing detail.

Record available request IDs, usage, timing, requested model, question
version, grouping, and policy version. Retain only appropriate input data.

## Compose a larger workflow when needed

The ticket-triage cookbook illustrates using probabilities to choose a
route and invoking a generative component only on selected cases:
https://docs.perplexity.ai/docs/cookbook/examples/decisions-api-ticket-triage/README.md

Adapt its policy to the application. For consequential routing, consider
urgent impact before label uncertainty and ordinary automation.

Use a separate call when earlier results determine new evidence.
Validate selected actions and arguments before execution.

Deliver the integration with sufficient configuration and usage guidance to run it.
