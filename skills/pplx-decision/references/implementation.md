# Implement Perplexity Decisions

Verify the relevant [endpoint schema](https://docs.perplexity.ai/api-reference/decisions-post.md)
and [model guidance](https://docs.perplexity.ai/docs/decisions/quickstart.md) before
coding; reuse documentation already checked in this task. The
[dated API snapshot](api-snapshot.md) provides an offline baseline.

## Connect to the API

Send JSON to POST https://api.perplexity.ai/v1/decisions with bearer
authentication. Supply model, state, and named questions; consume answers
by question ID.

Enforce the documented 1–128-question limit. Send only supported fields and omit
`temperature`; the [snapshot](api-snapshot.md#endpoint-and-request) distinguishes
the documented contract from provisional staff reports of ignored fields.

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

Preserve an explicitly selected model. Otherwise start evaluation with Standard,
Perplexity's documented default, especially for nuanced judgments or costly errors.
Consider Flash for clear, repetitive judgments at volume when it meets the same
application quality target. Compare complete billed usage and review workload;
a lower token rate does not establish a cheaper useful outcome.

For standard v1.2, group related facets; isolate independent candidates.
Intentional comparisons, such as duplicate detection, can warrant grouping
on Standard; evaluate that choice explicitly.
For hosted Flash v1.2, start with one question per request. The API processes
each question separately and bills state per question even in a multi-question
request. The checkpoint's joint-request implementation is a different serving path.

Standard grouping affects predictions. Reevaluate changes to joint context.

Prefer a selected versioned name for evaluated deployments. Use an alias when
automatic upgrades are intentional and evaluated. Retired versions can also
reroute; the returned name echoes the request and does not establish immutable
serving identity. Check change notices and revalidate affected thresholds.

Keep state, images, and each question below the input limit with headroom.
Standard automatically splits questions into consecutive groups if they do not
fit together, repeating and billing state per group. Choose groups deliberately
when joint context matters; automatic splitting need not preserve the intended
relationships. State plus a single question that cannot fit produces an
input-limit 400; shorten that input before resubmission. Also enforce the body
size limit. See the [snapshot](api-snapshot.md#grouping-models-and-billing).
Compare returned usage with expected grouping and Flash's per-question state
repetition; elevated usage alone is not proof of a Standard split.

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
| 504 or response timeout | Check workload size and question count; use bounded backoff. If repeated, reduce input or questions. A timeout alone does not identify an oversized image. |
| Other transient 5xx/network failure | Back off within a retry/time budget; avoid duplicate downstream actions. |

Keep large-state Flash requests to one or a few questions; see the
[dated staff observation](api-snapshot.md#timeout-starting-values) about sequential
processing under load. Treat that mechanism and its approximate timeout as
provisional, not a service guarantee. Reducing Standard question groups changes
joint context and requires re-evaluating thresholds. A client may time out before
the gateway; extending its deadline cannot prevent a gateway timeout.
Connection-establishment and connection-pool timeouts need handling according to
their cause and the overall retry budget.

Check status before parsing JSON; 404/405 may be empty and 504 may be HTML.
Branch on HTTP status. Read `error.message` for diagnosis and tolerate both
`invalid_request` and `invalid_request_error`; do not dispatch on one `type`
spelling, exact message wording, or the inconsistently typed `error.code`.
Use the project's timeout policy and the
[dated timing evidence](api-snapshot.md#timeout-starting-values), then adjust from
measured workload behavior; 30 seconds is not sufficient for every valid request.

Use an explicit unavailable-result path. Ensure retries of inference
cannot duplicate downstream actions.

Check current request and image limits. Supply supported image data URLs,
not remote image links. The [snapshot](api-snapshot.md#limits-and-images) records
the conflict between documented tile limits and provisional staff reports of
server-side resizing. Use conservative client resizing to control input size;
preserve evidence required by the question. Do not assume either resizing or
failure on the server. Use returned `usage.input_tokens` for billing rather than
an image-size formula, and keep body and total-input checks separate.

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
