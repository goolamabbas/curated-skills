# Perplexity Decisions API baseline

Baseline documentation checked **2026-10-18**, covering `pplx-decider-v1.2` and
`pplx-decider-flash-v1.2`. Grouping, input splitting, pricing, and confidence
rechecked **2026-10-20**. Model names, grouping, pricing, question limits, request
fields, image guidance, errors, and timeouts rechecked **2026-10-27**. Use this
selective baseline for drafting, fixtures, and comparison with current documentation.
Web grounding, retrieval billing, optional request fields and question-count limits
rechecked **2026-11-05**; unrelated provisional observations retain their earlier dates.

Sources: [quickstart](https://docs.perplexity.ai/docs/decisions/quickstart.md),
[endpoint schema](https://docs.perplexity.ai/api-reference/decisions-post.md),
[index](https://docs.perplexity.ai/llms.txt), and
[model-change notices](https://docs.perplexity.ai/docs/resources/changelog.md).

## Evidence limits

- This baseline was checked against documentation, without live inference.
  Use the documented contract for supported inputs; flag conflicting evidence.
- **Provisional staff observations** below come from Perplexity developer-relations
  correspondence received on **2026-10-27**. They have not been independently
  reproduced, may change, and are not API guarantees. Receipt date is not test date.
- Fixtures verify request construction and application logic. Measure model quality,
  calibration, cost, and serving performance on the target workload.
- Published timings and probability examples come from specific earlier runs.
  Use them as starting points, then evaluate the current model and application.

State relevant limits once in the task's results; retain inline qualifications
where they change an implementation decision.

## Endpoint and request

`POST https://api.perplexity.ai/v1/decisions`, JSON body, with
`Authorization: Bearer <key>`. A trailing slash returns 404; `x-api-key` is not
accepted and returns 401. Keep credentials outside source and diagnostics.

Required top-level fields: `model`, `state`, `questions`. The schema disallows
unknown top-level fields; the quickstart documents a 400 response. `state` is a
string, object, or array, not null. `questions` maps non-empty names to questions;
answers use those names.

Optional `mode: "web_grounding"` adds retrieval before inference. Optional
`max_staleness` controls the crawl age of a page fetched from URL-only state, not
search-result freshness. The response can add `search_results` and
`fetched_results`. See [web-grounding.md](web-grounding.md) for evidence handling,
failure behaviour and billing; the ordinary answer types remain unchanged.

Omit `temperature`: it is not a documented request field. **Provisional staff
observation (received 2026-10-27):** it is currently accepted but ignored and may
later be rejected. Do not use it to control decision variability or treat future
rejection as a scheduled change.

`instructions` may be a string, object, array, or null where the question's
criteria supply its meaning. Outer `criteria` shapes remain type-specific:

| Type | Criteria and requirements | Answer fields |
| --- | --- | --- |
| `noul` | Supply instructions or criteria (or both). Criteria is an object defining `true`/`false`; those definitions may be strings, objects, arrays, or null. Do not rely on empty definitions to convey meaning. | `type`, `noul` (probability of yes); no separate confidence |
| `choice` | Required option-name map; descriptions can be strings, objects, arrays, or null. Null lets the option name carry meaning. | `type`, `choice`, `confidence`, `probabilities` keyed by option |
| `score` | Required ordered array; each level is a string, object, or array, never null. Use at least two meaningful levels. | `type`, `score`, `confidence`, `legend`, `probabilities` |

`score` is the expected zero-based rubric index. `legend` and its probability map
use string keys (`"0"`, `"1"`, ...). Choice/score confidence is not the top
probability or demonstrated accuracy. Distributions sum approximately to one.
Top-level responses contain `model`, `answers`, and
`usage: {input_tokens, output_tokens}`. `model` echoes the requested name.

### Confidence calculations

The [quickstart](https://docs.perplexity.ai/docs/decisions/quickstart.md) and
[schema](https://docs.perplexity.ai/api-reference/decisions-post.md) define:

- `choice`, for `n > 1` options: `(p_top - 1/n) / (1 - 1/n)`,
  where `p_top` is the largest probability.
- `score`, for `n > 1` levels: `max(0, 1 - spread / baseline)`,
  where `m` is the most likely level, `spread = sum(p_i * abs(i - m))`,
  and `baseline = sum(abs(i - m)) / n` across every rubric level.
- One choice option or one score level has confidence 1.

For scores, use numeric level order. The most likely level is not necessarily
the highest rubric level. Tie selection is not specified in these passages;
do not invent a tie rule for an exact consistency check.
TypeSafe's score normalization instead uses distances from the rubric midpoint
for its baseline; see [porting-from-typesafe.md](porting-from-typesafe.md).

## Limits and images

| Constraint | Documented value |
| --- | --- |
| Questions per request | At least one; maximum 100 with web grounding. The documentation checked 2026-11-05 does not specify a universal ungrounded question-count cap. Context, body and rate limits still apply. |
| Options per choice | 1–255 |
| Levels per score | 1–10; one level always scores zero |
| Input | State, its images, and each individual question must fit under 256K tokens; Standard splits questions that do not fit together |
| Request body | 32 MiB |
| Images | Up to 8 per question; PNG, JPEG, or WebP data URLs |
| Image size | Quickstart still specifies at most 2,048 tiles of 32 × 32 pixels; see the conflicting staff observation below |
| Request rate | 10 requests/second per organization, shared across both models; an additional token limit applies to large bursts |

Place an image part anywhere in state:
`{"type":"image_url","image_url":{"url":"data:image/png;base64,..."}}`.
The API does not fetch HTTP(S) image URLs. State is read as serialized JSON, with
images in place; preserve meaningful ordering.

The earlier 128-question guidance is superseded by the documented grounding-specific
limit above. Do not infer unlimited practical capacity for ungrounded calls; apply
context, body, rate and workload constraints. Label any stricter batching cap as a
client policy rather than a provider limit.

The quickstart still describes rounding dimensions to the nearest multiple of 32
before counting tiles, with 1440 × 1440 and 2048 × 1024 fitting and 1600 × 1310
too large. It says oversized images wait about a minute and return 504.
**Provisional staff observation (received 2026-10-27):** oversized images are now
resized server-side with aspect ratio preserved and return 200. This conflicts
with the published guidance; do not present oversized-image failure or automatic
resizing as an independently verified current behavior.

Use conservative client resizing to control input size while preserving the detail
needed for the question. Treat the documented tile boundary as a conservative
client policy while the discrepancy remains unresolved, not proof that the current
backend rejects larger images. Formats, encoded body size, and total input limits
still require separate checks.

Budget from returned `usage.input_tokens`. The quickstart's estimate of about
1,000 input tokens per megapixel comes from earlier models and is not a reliable
current billing formula. **Provisional staff measurements (received 2026-10-27):**
1440 × 1440 billed about 6,100 input tokens and 4000 × 4000 about 25,000; the exact
formula was still being established. These observations are not a token estimator
or a guarantee for other requests. Measure representative inputs and do not add
estimated image charges again to returned usage.

## Grouping, models, and billing

Standard v1.2 evaluates questions jointly within a processing group. Related
facets can benefit; isolate independently scored candidates. Intentional comparison
can justify grouping (for example duplicate detection or multi-hop evidence).
An unused question in the same group can still influence another answer.

If Standard's state plus all questions exceeds the input limit, the hosted API
splits questions into consecutive groups. Each group includes and bills the state
again; returned `usage.input_tokens` includes that repetition. Groups run
sequentially, increasing latency and potentially reaching a timeout. State plus
any single question that cannot fit produces an input-limit 400. Correct that
input rather than retrying unchanged.

Choose groups deliberately and keep headroom when joint context matters:
automatic splitting can change which questions see each other. This is a client
design recommendation, not a claim that splitting is unsupported. The inspected
hosted response schema has no explicit split indicator.

Hosted Flash v1.2 answers each question separately, even when several are sent
in one request. State is repeated and billed for every question. Start with one
question per request; a multi-question request does not create joint context or
shared-state savings. The Flash checkpoint model card describes a joint-request
implementation; its grouping exceptions are not the hosted API's processing policy.

| Model | Alias | USD per million input tokens |
| --- | --- | --- |
| `pplx-decider-v1.2` | `pplx-decider-latest` | 0.02 |
| `pplx-decider-flash-v1.2` | `pplx-decider-flash-latest` | 0.01 |

Output tokens are free; there is no request fee. Aliases follow newer models and
bill at the selected model's rate. Retired version names reroute to replacements;
neither an alias nor a versioned name proves immutable serving identity.

The schema's Usage description and quickstart agree on these model-specific rates.
Compare total billed input: repeated state can make a multi-question Flash workflow
costlier than Standard despite Flash's lower token price. See
[evaluation.md](evaluation.md) for cost calculation and
[implementation.md](implementation.md) for operational policy.

With web grounding, report retrieval charges alongside the token subtotal. Fetched page text
and search evidence already count in `usage.input_tokens`, with the same Standard
group and Flash question repetition rules. Returned evidence lists are not billing
counters. See [grounding costs](web-grounding.md#account-for-the-full-cost).

## Errors and headers

| Status | Documented interpretation |
| --- | --- |
| 400 | Invalid JSON, fields, model, types, limits, unsupported image URL, invalid `mode` (including null or empty), or more than 100 grounded questions |
| 401 | Missing/invalid key or incorrect authentication header |
| 404 / 405 | Wrong path / method; empty body |
| 413 | Body too large |
| 429 | Request/token rate limit; `Retry-After` is seconds |
| 5xx | Service failure or timeout; 504 may contain HTML. The quickstart's oversized-image explanation conflicts with the staff observation above. |

Branch on HTTP status and use `error.message` for diagnosis. The schema lists both
`invalid_request` and `invalid_request_error`; tolerate both rather than depending
on one `error.type` spelling. Exact message wording is not a stable machine
contract. `error.code` may be a string, number, or null; do not use it as the
dispatch field. Check status and content before parsing JSON.
`x-request-id` is documented on success and most errors, absent on 401,
404, and 504. Successful responses carry `x-ratelimit-limit`, `-remaining`,
`-used`, and `-reset` (Unix seconds).

## Timeout starting values

Preserve an established project timeout policy and choose client deadlines from
the workload and application's response-time budget. The quickstart's 10-second
small-input and 30-second large-input examples came from an earlier model. Its
2026-10-19 tests report about 53 seconds on Standard and 16 seconds on Flash for
roughly 248,000 input tokens: 30 seconds is not sufficient for every valid request.
These are specific observations, not latency guarantees.

**Provisional staff observation (received 2026-10-27):** under load, multi-question
Flash requests can be split into sequential queries, with large states reaching
an approximately 55-second gateway timeout (HTML 504, no request ID). Staff report
that Standard does not split because of load, although very long requests can
also time out. This differs from Standard's documented input-size-triggered
grouping; the load-dependent behavior has not been independently reproduced.

Keep large-state Flash requests to one or a few questions. Use bounded backoff
within an overall deadline; if timeouts recur, reduce input or questions rather
than retrying the same heavy request indefinitely. Changing Standard groups can
change answers, so re-evaluate affected thresholds. Extending a client deadline
cannot prevent a gateway timeout. See [implementation.md](implementation.md) for
failure handling.
