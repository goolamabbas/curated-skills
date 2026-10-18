# Perplexity Decisions API baseline

Documentation verified **2026-10-18**, covering `pplx-decider-v1.2` and
`pplx-decider-flash-v1.2`. Use this selective baseline for drafting, fixtures,
and comparison with current documentation.

Sources: [quickstart](https://docs.perplexity.ai/docs/decisions/quickstart.md),
[endpoint schema](https://docs.perplexity.ai/api-reference/decisions-post.md),
[index](https://docs.perplexity.ai/llms.txt), and
[model-change notices](https://docs.perplexity.ai/docs/resources/changelog.md).

## Evidence limits

- This baseline was checked against documentation, without live inference.
  Current docs take precedence; report material drift or conflicting source sections.
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

Required top-level fields: `model`, `state`, `questions`. Unknown top-level fields
return 400. `state` is a string, object, or array, not null. `questions` maps
non-empty names to questions; answers use those names.

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

## Limits and images

| Constraint | Documented value |
| --- | --- |
| Questions per request | 1–128 |
| Options per choice | 1–255 |
| Levels per score | 1–10; one level always scores zero |
| Input | Under 256K tokens, including state, questions, and images |
| Request body | 32 MiB |
| Images | Up to 8 per question; PNG, JPEG, or WebP data URLs |
| Image size | At most 2,048 tiles of 32 × 32 pixels per image |
| Request rate | 10 requests/second per organization, shared across both models; an additional token limit applies to large bursts |

Place an image part anywhere in state:
`{"type":"image_url","image_url":{"url":"data:image/png;base64,..."}}`.
The API does not fetch HTTP(S) image URLs. State is read as serialized JSON, with
images in place; preserve meaningful ordering.

The quickstart describes rounding dimensions to the nearest multiple of 32 before
counting tiles. It lists 1440 × 1440 and 2048 × 1024 as fitting, and 1600 × 1310
as too large. Oversized images can wait about a minute and return 504 rather than
400. Validate dimensions before sending; any stricter local rounding rule is a
conservative client policy, not a claimed server algorithm.

For rough planning, the quickstart reports about 1,000 input tokens per megapixel
from tests on earlier decision models: estimated image tokens ≈ width × height /
1,000,000 × 1,000. Check actual usage on representative images. This estimate
does not establish whether a request near the token limit will fit; tile count,
encoded body size, and total input limits require separate checks.

## Grouping, models, and billing

Both v1.2 models see all questions in a request. Standard benefits from related
facets; isolate independently scored candidates. Intentional comparison on Standard
can justify grouping (for example duplicate detection or multi-hop evidence).
Flash defaults to one question per request. Its documented grouping exceptions
are select-all-that-apply decisions or steps of one routing decision; evaluate
those on the actual task.
Do not treat adding an unused question as behaviorally neutral.

The grouping section describes state being billed once per group and automatic
consecutive question groups with repeated state when aggregate input is too large.
The limits/error sections and endpoint schema also describe an input limit and
limit-related 400 responses. The conditions distinguishing rejection from
automatic splitting are unverified. Keep each request below the documented limit
with headroom, and correct limit-related 400s rather than retrying unchanged.
Do not depend on server splitting to accept a request or preserve grouping. If
splitting occurs, grouping and billed input may change; the inspected response
schema has no explicit split indicator.

| Model | Alias | USD per million input tokens |
| --- | --- | --- |
| `pplx-decider-v1.2` | `pplx-decider-latest` | 0.02 |
| `pplx-decider-flash-v1.2` | `pplx-decider-flash-latest` | 0.01 |

Output tokens are free; there is no request fee. Aliases follow newer models and
bill at the selected model's rate. Retired version names reroute to replacements;
neither an alias nor a versioned name proves immutable serving identity.

The schema's generic Usage description lists a single rate, while its model
descriptions and the quickstart distinguish Standard/Flash. Use model-specific
pricing and check announced changes. See [evaluation.md](evaluation.md) for cost
calculation and [implementation.md](implementation.md) for operational policy.

## Errors and headers

| Status | Documented interpretation |
| --- | --- |
| 400 | Invalid JSON, fields, model, types, limits, or unsupported image URL |
| 401 | Missing/invalid key or incorrect authentication header |
| 404 / 405 | Wrong path / method; empty body |
| 413 | Body too large |
| 429 | Request/token rate limit; `Retry-After` is seconds |
| 5xx | Service failure or timeout; 504 can also result from oversized images and may contain HTML |

Read `error.message` and `error.type` when available. `error.code` may be a string,
number, or null; do not use it as the stable dispatch field. Status precedes JSON
parsing. `x-request-id` is documented on success and most errors, absent on 401,
404, and 504. Successful responses carry `x-ratelimit-limit`, `-remaining`,
`-used`, and `-reset` (Unix seconds).

## Timeout starting values

Preserve an established project timeout policy. Otherwise start with configurable
10-second client timeouts for small inputs and 30 seconds for large inputs near
the input limit, then measure and adjust. These starting values come from the
quickstart's 2026-09-30 tests on an earlier model. Choose intermediate settings
from input size and the application's response-time budget; keep the retry budget
within the overall deadline. See [implementation.md](implementation.md) for retries.
