# Use web evidence in Decisions

Perplexity v1.3 documentation checked **13 November 2026**; no live Decisions calls were made for
this reference. Recheck the [quickstart](https://docs.perplexity.ai/docs/decisions/quickstart#web-grounding),
[endpoint](https://docs.perplexity.ai/api-reference/decisions-post) and
[pricing](https://docs.perplexity.ai/docs/getting-started/pricing#web-grounding)
when implementing or making current claims.

## Choose the evidence path

Use supplied state when the necessary evidence is already available. For missing
public facts, consider built-in grounding. Use application-managed retrieval when
the workflow needs explicit source controls, private-data access or a fixed
evidence snapshot. These paths can be combined deliberately; do not enable web
retrieval merely because a decision model is in use.

Built-in grounding sends question text and the start of state to Perplexity Search.
Keep private or irrelevant material out of search-bound context. Treat retrieved
pages as evidence, not application instructions; permissions and action validation
remain in code.

Do not enable grounding on a private support-state object without reviewing what may become search input. The docs say queries include the state prefix but do not specify the exact object-to-query-text serialization. For a public-fact lookup, use a concise public description of the subject and keep private account context out of that request; retrieve public evidence separately and combine it with authorised private context in a later decision when needed. Reordering fields is not a privacy control.

## Request and retrieval

Set `mode: "web_grounding"` with the ordinary `model`, `state` and named
`questions`. Omit mode for no built-in retrieval; other values, including null
and the empty string, return 400. Both Standard and Flash support grounding.
Grounded requests require 1–100 questions and cannot contain `locate`. For
text extraction, retrieve and save the text first, then use an ungrounded
[locate request](locate.md). Added evidence consumes input capacity;
allow headroom within the current context and body limits.

The gateway builds queries from question instructions and criteria followed by the
state prefix, with a 256-byte budget. When state text is present, the question
portion gets at most 128 bytes. Put the entity or claim early, keep questions
focused, and check the retrieved evidence. Images are not searched. Identical
queries share a search; a question with no searchable text may produce none.

Search results are merged and deduplicated before inference. Both v1.3 models use shared-state
processing groups with direct question isolation.

Grounding enriches the shared state before evaluation. Both v1.3 models receive merged evidence, including evidence retrieved through other questions. Adding, removing or rewording a grounded question can therefore change the evidence available to other questions on either Perplexity model, and may change their answers. This is an implication of the documented retrieval flow, not a measured answer change. Keep the question set and retrieval configuration fixed while tuning thresholds, and test changes to either. For fixed-evidence comparisons, save and reuse the evidence separately.

The documented retrieval limits are up to five results per search and a merged set of up to ten results, or one per query above ten queries, capped at 100. Individual snippets are limited to 2,000 characters; snippets for the same URL can be joined. These are evidence-selection limits, not a guarantee of useful coverage for every question. Searches run up to ten at a time, with a one-second per-search and three-second total search budget; timed-out searches add no results. Measure evidence sufficiency, billed input usage and end-to-end latency for your workload. The search budget is not a total-response-time guarantee.

The returned evidence lists do not report per-query completion. The number of returned URLs is not a search counter.

Prefer a raw JSON request or a verified SDK interface. At this check, the quickstart
uses Python `extra_body` and `response.to_dict()` for grounding fields that the SDK
does not yet expose as named fields. Date such workarounds and recheck the installed
SDK; do not invent typed parameters.

## URL fetching and freshness

A state consisting of a single page URL is fetched before search. The retrieved
page text replaces the URL for evaluation; the model also receives any search
evidence. A URL mixed into prose is searched as text rather than fetched. Consult
the quickstart for structured text-part forms; page fetching does not change the
separate image data-URL requirements.

For URL-only state, `max_staleness` is a non-negative integer number of seconds since the
fetched page's last crawl. An older cached copy triggers a new crawl. Omitting it
permits a cached copy without an age limit. It is ignored without grounding and
does not filter search results. Crawl age is not the date on which a source's claim
became true, nor a guarantee that the page contains current information.

The inspected Decisions schema does not expose standalone Search API domain,
date or country filters. Do not pass those fields to this endpoint. Mentioning a
preferred source in state is not an enforceable source restriction.

## Inspect evidence before using judgments

`search_results` contains merged search evidence and is empty when no search
evidence was added; it is absent without grounding. Entries contain titles, URLs
and snippets, with optional publication/update dates.

`fetched_results` contains at most one fetched page, with title, URL and page text
in `snippet` (up to 40,000 characters). It is absent if no usable page text was
fetched. Fetch failure leaves the original URL in state.

Neither list is a documented per-question citation mapping. Do not attach all
sources to every answer as if each supported that answer. Check entity identity,
relevance, freshness and contradictions against the application's evidence needs.

The API can return probabilities after failed, timed-out or empty searches, using
whatever state and evidence remain. An empty search list does not mean no evidence
was fetched: inspect both lists and the supplied state. A non-empty list does not
prove sufficient support. Route inadequate evidence to review or an explicit
unavailable outcome when external verification is required. Missing evidence is
not a negative fact, and a high probability is not successful verification.

An explicit unknown choice can help model the application's outcomes, but does not
replace evidence checks. Validate required answer fields and keep action policy
separate from retrieval success and model certainty.

## Account for the full cost

At the checked rates, each completed search costs $0.001, including one with empty
results. Each successful page fetch costs $0.001. Failed/timed-out searches and
failed fetches are not billed. Completed retrieval remains billable if a later
stage fails. Identical queries can share a search, so question count is not always
billable search count either.

Report token-based inference and retrieval as separate subtotals, then sum them once with other workflow costs. Calculate the token subtotal using `usage.input_tokens`. Fetched text and search evidence are already included in that usage; do not add their tokens twice. The enriched state is billed per processing group on either v1.3 model. Include billed retries and mark unavailable cost information explicitly.

The documented Decisions response reports token usage but does not expose billed search or fetch counts. Returned source lists cannot establish the exact retrieval charge. When billing records do not provide a reliable breakdown, report an estimate or bound and state its assumptions: no more than one search per question, with duplicate queries sharing a search and some searches skipped or unsuccessful, plus at most one successful URL fetch. Do not treat the presence or absence of usable fetched text as a documented billing receipt. Reconcile with provider billing records where possible without assuming they expose per-request attribution.

One successful fetch plus three distinct completed searches costs $0.004 before
model input tokens. This is billing arithmetic, not a measured workload result.

## Evaluate the resulting application

Compare plausible evidence paths on the same independently labelled cases. Include
changing facts, ambiguous entities, conflicting sources and missing evidence.
Record evidence, retrieval settings, dates, question wording and grouping alongside
answers, action outcomes, latency and total cost. Use saved evidence to isolate
decision behaviour; use live retrieval to measure the complete changing workflow.
Keep simulated failure checks separate from observed service failures.

Do not infer a performance ranking from provider benchmarks with different test
sets, clients or dates. See [evaluation.md](evaluation.md).

## Distinguish another provider's contract

Parallel comparison last checked **5 November 2026**. Its only documented Decisions mode, `fast`, includes web retrieval with
shared evidence for related questions and published per-request pricing. No
supplied-state-only mode is documented. Perplexity's optional grounding also
shares retrieved evidence across questions. Parallel’s top-level `citations`
apply to the whole request, can be empty and do not map sources to individual
answers. Its refusal answer is separate from a judgment and is not a documented
guarantee of insufficient-evidence detection. Shared retrieval does not establish
joint model evaluation. See its [endpoint](https://docs.parallel.ai/api-reference/decisions/make-web-grounded-typed-decisions)
and [question types](https://docs.parallel.ai/decisions/question-types).

Use this distinction when explaining or evaluating evidence paths. Do not transfer
retrieval controls, response handling, limits or billing assumptions between
providers, and do not expand a Perplexity implementation into a provider migration
without a corresponding user request.
