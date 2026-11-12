# Perplexity Decisions API baseline

Baseline checked **13 November 2026** for `pplx-decider-v1.3` and
`pplx-decider-flash-v1.3`: models, grouping, pricing, limits, locate, grounding,
errors and documented timing observations. This is a dated documentation baseline,
not a live inference test or a promise about future releases. Preserve explicitly
selected versions; check their current contract before applying this baseline.
Upgrading from an earlier version requires threshold and grouping revalidation.

Sources: [quickstart](https://docs.perplexity.ai/docs/decisions/quickstart.md),
[endpoint schema](https://docs.perplexity.ai/api-reference/decisions-post.md),
[index](https://docs.perplexity.ai/llms.txt), and
[model-change notices](https://docs.perplexity.ai/docs/resources/changelog.md).

## Evidence limits

- This baseline was checked against documentation, without live inference.
  Use the documented contract for supported inputs; flag conflicting evidence.
- Image-size guidance remains uncertain: older developer-relations correspondence
  conflicts with the current quickstart. Neither behavior was independently tested
  on v1.3; use conservative resizing and measured usage as described below.

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

Omit `temperature`: it is not a documented request field. Do not use it to
control decision variability.

`instructions` may be a string, object, array, or null where the question's
criteria supply its meaning. Outer `criteria` shapes remain type-specific:

| Type | Criteria and requirements | Answer fields |
| --- | --- | --- |
| `noul` | Supply instructions or criteria (or both). Criteria is an object defining `true`/`false`; those definitions may be strings, objects, arrays, or null. Do not rely on empty definitions to convey meaning. | `type`, `noul` (probability of yes); no separate confidence |
| `choice` | Required option-name map; descriptions can be strings, objects, arrays, or null. Null lets the option name carry meaning. | `type`, `choice`, `confidence`, `probabilities` keyed by option |
| `locate` | String instructions describing matching text; criteria and other question members are ignored. String state only, no images or grounding; at most 128 total questions. | `type`, `spans`, each with `text`, `start`, `end`, `score`; see [locate.md](locate.md) |
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
| Questions per request | At least one; maximum 100 with web grounding; maximum 128 total if any question is locate (which cannot be grounded). No universal cap is stated for other ungrounded requests. Context, body and rate limits still apply. |
| Options per choice | 1–255 |
| Levels per score | 1–10; one level always scores zero |
| Input | State, its images, and each individual question must fit under 256K tokens; both v1.3 models split questions that do not fit together |
| Request body | 32 MiB |
| Images | Up to 8 per question; PNG, JPEG, or WebP data URLs; none with locate |
| Image size | Quickstart still specifies at most 2,048 tiles of 32 × 32 pixels; see the uncertainty below |
| Request rate | 10 requests/second per organization, shared across both models; an additional token limit applies to large bursts |

Place an image part anywhere in state:
`{"type":"image_url","image_url":{"url":"data:image/png;base64,..."}}`.
The API does not fetch HTTP(S) image URLs. State is read as serialized JSON, with
images in place; preserve meaningful ordering.

The locate cap applies to the entire mixed request, not just its locate questions.
Other ungrounded requests still have context, body and rate constraints. Label
stricter batching caps as client policy rather than provider limits.

The current quickstart specifies rounding image dimensions to multiples of 32,
then limiting images to 2,048 tiles. Its oversized-image timeout description
conflicts with older staff correspondence about server-side resizing. That
correspondence predates this baseline and does not establish v1.3 behavior.
Use conservative client resizing while preserving required detail; check formats,
encoded body size and total-input limits separately. Do not assume server resizing
or a particular failure for oversized images. Budget from returned usage, not
historical megapixel estimates. No image billing formula was verified for v1.3.

## Grouping, models, and billing

Both v1.3 models process questions together using shared state. Each question
attends directly to state and its own tokens; shared state permits indirect
interaction. Supply complete question meaning and keep grouping fixed while
comparing runs or tuning thresholds. Do not infer fully independent predictions
or reusable question-independent prompt caching.

If state plus all questions exceeds the input limit, both models split questions
into consecutive groups, repeating and billing state per group. Returned usage
already includes repetition. Groups run sequentially, increasing latency. State
plus any single question that cannot fit returns 400. Leave headroom and evaluate
changes to grouping; the inspected response has no explicit split indicator.

| Model | Alias | USD per million input tokens |
| --- | --- | --- |
| `pplx-decider-v1.3` | `pplx-decider-latest` | 0.02 |
| `pplx-decider-flash-v1.3` | `pplx-decider-flash-latest` | 0.01 |

Output tokens are free; there is no request fee. Aliases follow newer models and
bill at the selected model's rate. Retired version names reroute to replacements;
neither an alias nor a versioned name proves immutable serving identity.

The latest aliases currently select the v1.3 models above; their `perplexity/`
prefixed forms are also accepted. Response `model` echoes the requested name,
not a resolved serving version. Revalidate after model-routing changes.

Compare complete billed usage and quality rather than token rates alone. Both
models bill state once when the request fits one group. Default token limits are
15 million/minute and 900 million/hour for Standard, and 4 million/minute and
240 million/hour for Flash. The organization-wide 10 requests/second limit is
shared across models. See [evaluation.md](evaluation.md).

With grounding, retrieval charges are separate from inference. Fetched text and
search evidence are already included in input usage and repeat per processing
group on either model. Evidence lists are not billing counters. See
[grounding costs](web-grounding.md#account-for-the-full-cost).

## Errors and headers

| Status | Documented interpretation |
| --- | --- |
| 400 | Invalid JSON, fields, model, types, limits, unsupported image URL, invalid `mode` (including null or empty), more than 100 grounded questions, or invalid locate model/state/mode/count combination |
| 401 | Missing/invalid key or incorrect authentication header |
| 404 / 405 | Wrong path / method; empty body |
| 413 | Body too large |
| 429 | Request/token rate limit; `Retry-After` is seconds |
| 5xx | Service failure or timeout; 504 may contain HTML. Oversized-image behavior is unverified; see the uncertainty above. |

Branch on HTTP status and use `error.message` for diagnosis. The schema lists both
`invalid_request` and `invalid_request_error`; tolerate both rather than depending
on one `error.type` spelling. Exact message wording is not a stable machine
contract. `error.code` may be a string, number, or null; do not use it as the
dispatch field. Check status and content before parsing JSON.
`x-request-id` is documented on success and most errors, absent on 401,
404, and 504. Successful responses carry `x-ratelimit-limit`, `-remaining`,
`-used`, and `-reset` (Unix seconds).

## Timeout starting values

Preserve the project's timeout policy and choose deadlines from workload and
response-time requirements. In documentation tests dated **12 November 2026**,
about 243,000 input tokens took 16 seconds on Standard v1.3 and 5 seconds on Flash
v1.3; about 135,000 took 7 and 2 seconds respectively. These are provider-reported
observations, not service guarantees or measurements by this guide. Splitting,
retrieval and load can add time. The docs describe a gateway timeout at about a
minute; increasing the client deadline cannot prevent it.

Use bounded backoff within an overall deadline. For repeated heavy-request
timeouts, reduce input or questions and re-evaluate changed grouping. See
[implementation.md](implementation.md) for failure handling.
