# Extract matching text with locate

Covers Standard and Flash **v1.3**, checked **13 November 2026** against the
[quickstart](https://docs.perplexity.ai/docs/decisions/quickstart#locate-find-text-in-the-content)
and [endpoint](https://docs.perplexity.ai/api-reference/decisions-post).
No live extraction was run for this reference.

## Choose extraction deliberately

Use `locate` to identify exact text spans: named entities, relevant phrases,
personal information or answers already present in text. Use `choice` to select
among supplied candidates, and `noul` or rubric `score` to judge information.
Extraction does not establish truth, authorize actions or explain internal reasoning.

## Construct a compatible request

- Use `pplx-decider-v1.3` or `pplx-decider-flash-v1.3`.
- State must be a string. Object/array state and images are unsupported when any
  question is locate. Preserve the exact string used for source mapping.
- Set `type: "locate"` and string `instructions` describing what to find. Other
  question members, including criteria, are ignored; omit them.
- Mix locate with noul, choice and score if useful, but cap the entire request
  at 128 questions. Context and body limits still apply.
- Omit `mode`: locate cannot use built-in web grounding. Grounded locate returns
  400 with `param: "questions"`. Other locate compatibility errors can use
  `type: "invalid_request"` without `param`; branch on status, not exact messages.

For source pages, retrieve text separately, retain its URL and retrieval time,
and pass a saved text snapshot as state. Do not send a bare URL expecting locate
to fetch it. See [web-grounding.md](web-grounding.md) for evidence-path choices.

## Validate and map the response

Each locate answer has `type: "locate"` and `spans`, possibly empty. Each span
contains `text`, `start`, `end` and `score`. Offsets count Unicode characters;
`end` is exclusive. In Python, `state[start:end]` must equal `text`.

Validate the required answer ID/type, spans array, integer bounds
`0 <= start < end <= len(state)`, exact substring agreement and a finite numeric
score. A missing/malformed answer is unavailable, not an empty successful result.
The docs describe higher scores as more certain, but do not establish calibrated
correctness probabilities. Do not confuse span score with the rubric `score`
primitive or invent a provider-side threshold field.

JavaScript indexes strings by UTF-16 code units. For Unicode-character offsets,
use code points, for example `Array.from(state).slice(start, end).join('')`,
and test emoji/non-BMP cases. Combining characters still occupy separate code
points; do not normalize or change whitespace between request and highlighting.
Preserve multiple matches by position, including repeated identical text. Do not
assume ordering, overlap or uniqueness guarantees that the contract does not give.

If the app redacts spans, validate against the original snapshot, merge overlapping
ranges according to application policy, and apply edits from the end backwards
so earlier offsets stay valid. Test the resulting text independently.

## Evaluate the application

An empty list means the model found no match, not proof none exists. For PII,
measure missed entities before using results to redact or release text; a high
score on detected entities does not measure recall.

Use labelled spans to measure precision, recall and exact boundaries. Include
absent entities, repeated text, multiple matches, Unicode and misleading content.
Evaluate partial-overlap metrics only if the application accepts partial spans.
Test classification-only versus mixed locate requests before assuming other
judgments remain unchanged. Keep synthetic fixtures distinct from live quality tests.

Locate training used inputs up to 8K tokens and evaluation up to 32K. Longer input
is accepted, but extraction quality there is not measured in the cited docs.
For long documents, evaluate chunking and boundary misses; map local offsets back
to the exact source and deduplicate overlapping chunk results by source position.
