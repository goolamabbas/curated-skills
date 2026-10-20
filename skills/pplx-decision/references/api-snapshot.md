# Perplexity Decisions API baseline

Baseline documentation checked **2026-10-18**, covering `pplx-decider-v1.2` and
`pplx-decider-flash-v1.2`. Grouping, input splitting, pricing, and confidence
rechecked **2026-10-20**. Use this selective baseline for drafting, fixtures,
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
| Questions per request | 1–128 |
| Options per choice | 1–255 |
| Levels per score | 1–10; one level always scores zero |
| Input | State, its images, and each individual question must fit under 256K tokens; Standard splits questions that do not fit together |
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
