# Xray

Examine a public story by asking who benefits, what actually changed, and what may happen next. Xray helps distinguish a persuasive narrative from the evidence supporting it.

Its value is in comparing explanations. A routine process, an honest error, or an inconclusive finding can be the best answer. The skill does not start from the assumption that somebody planted the story.

## When to use it

Use Xray for a public announcement, policy move, company story, or media narrative when you want to understand incentives, competing explanations, or likely consequences. It is especially useful when a headline invites a strong inference about intent that the reporting may not establish.

For a simple summary or standalone fact check, ask directly. Xray is not for medical images or speculation about private personal disputes.

## Two distinctions that matter

**Benefiting is not causing.** A competitor gaining from bad news does not establish that it arranged the coverage. Xray separates observed or projected benefits from evidence of influence, intent, or control.

**Truth is separate from placement.** A documented announcement can be true and deliberately distributed through a coordinated communications campaign. Coordination does not by itself establish deception. Conversely, a false story can spread without a coordinated campaign.

When relevant, the assessment uses separate ratings:

| Question | Ratings | Interpretation |
| --- | --- | --- |
| Are the core claims supported? | VERIFIED, PARTIALLY VERIFIED, UNVERIFIED, CONTRADICTED | Ratings apply to specified claims. Lack of verification is not proof of falsity. |
| Is deliberate seeding or coordination established? | NOT ESTABLISHED, POSSIBLE, SUPPORTED | POSSIBLE needs concrete suggestive evidence; SUPPORTED needs specific evidence of the activity. |

Convenient timing, anonymous sources, outrage, or similar headlines alone do not establish placement. Normal syndication, embargoes, and a shared source can explain similar coverage. These ratings are the skill's analytical conventions, not an external certification.

## Choose a mode

| Mode | Focus |
| --- | --- |
| Default / xray | The event, beneficiaries, and best-supported explanation; other lenses as useful. |
| Quick take | A brief assessment of the event and beneficiaries, including uncertainty or an alternative. |
| Predict | Checkable forecasts or conditional scenarios based on explanations and incentives. |
| Is this planted? | Evidence for the story and for deliberate coordination, assessed separately. |

Modes guide emphasis rather than force a fixed sequence. Unassessed areas stay omitted or are labeled NOT ASSESSED. A quick take does not need a forecast or a game-theory section.

## Copyable examples

### Understand a story

```text
Use the xray skill on this public announcement: [URL or full text].
What materially changed, who benefits, and which explanation is best supported?
Consider the strongest ordinary explanation and show what remains uncertain.
```

### Get a quick take from supplied text

```text
Use the xray skill for a quick take on the article below.
Use only the supplied text; do not browse. Keep it under 250 words.
Make clear which conclusions would need external verification.

[paste article]
```

### Assess possible placement

```text
Use the xray skill to assess whether this story was deliberately planted:
[URL or full text]
Assess the factual claims separately from coordination of coverage.
Compare the coordination explanation with syndication or a shared source.
```

### Make useful predictions

```text
Use the xray skill in predict mode on this announcement: [URL or full text].
Focus on what could happen before the next scheduled board meeting on [date].
Give observable outcomes, deadlines, key conditions, and what would weaken
the leading explanation. If no defensible forecast follows, say so.
```

## Get a better result

Provide the actual article or announcement, its date if known, and the question you care about. Specify the period or actors of interest and any research restrictions. A headline alone supports questions and conditional scenarios, not a confident conclusion about hidden motives.

External verification depends on available research tools. The agent should report access gaps and distinguish supplied material from independently checked evidence. Repeated coverage of one source is not independent corroboration.

The output should identify the assessment, supporting evidence, strongest alternative, uncertainty, and what would change the conclusion. Confidence about an event can be much higher than confidence about its motive or future effects. Forecasts can be conditional; a scheduled event is not itself a novel prediction.

Deeper analysis uses [strategic guidance](references/strategic-analysis.md) when needed and [forecasting guidance](references/forecasting.md) when making predictions. The skill does not require all eight analytical lenses or eight output headings in every response.

## Origin and adaptations

Adapted from [Alex Prompter's /xray prompt](https://x.com/alex_prompter/status/2097339435260272829).

This version separates factual verification from placement, beneficiaries from instigators, and evidence from inference. It permits ordinary explanations, flexible analytical coverage, conditional forecasts, and explicit access limitations.

Treat the assessment as an aid to judgment, not proof of coordination or a guarantee of future events.

## License

[MIT](LICENSE). Keep the license notice with copies of this skill.

[Agent instructions](SKILL.md) · [Collection](../../README.md)
