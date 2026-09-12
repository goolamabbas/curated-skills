# Minto

Turn a draft or idea into an argument the reader can follow: a clear question, a direct answer, and supporting ideas that actually justify it.

Minto is useful when the facts are present but the takeaway is buried, paragraphs do not build toward a conclusion, or a proposal lists benefits without explaining why they support the recommendation. It can also help develop an unstructured idea.

## When to use it

- Restructure a proposal, memo, article, announcement, or presentation narrative.
- Identify gaps between a recommendation and its supporting evidence.
- Develop a provisional outline from an idea without inventing the author's position.

For spelling, a quick summary, or a tone-only edit, a direct editing request is usually enough. Minto evaluates the argument; it does not automatically verify every factual claim or conduct research.

## Choose the result you want

| Request | Expected result |
| --- | --- |
| Review or audit a draft | Diagnosis and specific restructuring recommendations. |
| Improve, revise, or rewrite a draft | Diagnosis plus the complete revised text within your requested scope. |
| Develop an idea | A proposed answer and outline, with assumptions and evidence needs. |
| Request a visual pyramid | A visual deliverable when supported, with the same underlying argument analysis. |

## Copyable examples

### Review without rewriting

```text
Use the minto skill to review this proposal for a nontechnical founder.
The decision is whether to fund a two-week pilot.
Identify the main structural issue and explain which paragraphs to move,
cut, or strengthen. Give recommendations only; do not rewrite it yet.

[paste proposal]
```

### Improve a complete draft

```text
Use the minto skill to improve this announcement for existing customers.
Show the main structural changes, then give me the complete revised version.
Keep it under 200 words, retain the links, and preserve my conversational voice.
Do not add unsupported claims.

[paste announcement]
```

### Develop a raw idea

```text
Use the minto skill to develop this idea into a short memo:
We should try a paid pilot before building the full product.
The reader is my cofounder. Our budget is limited and demand is uncertain.
Propose an argument and identify what evidence we still need.
```

## Get a better result

Supply the intended reader, the question or decision, the draft or idea, and any length, voice, or format constraints. Include the evidence you want used and identify claims that are provisional. If you want research, say so and specify any source restrictions.

The skill checks whether supporting ideas justify their parent conclusion and whether ideas at the same level belong together. It uses Situation, Complication, Question when helpful, without forcing that introduction onto every message. Branch counts and depth follow the argument.

A precise answer can be conditional. Useful analysis may conclude that the evidence does not yet support the proposed recommendation. An already sound draft may need few changes. Narrative openings can remain when they serve the audience and purpose.

## What to expect

Usually a concise Markdown response with the main diagnosis, proposed argument, suggested opener, and prioritized changes. Narrow requests need fewer sections. Improvement requests also receive the full revised text, with the structural changes visible in it.

Visual output is optional. The agent reads [visual guidance](references/visual-output.md) only when a visual artifact is requested. File creation and preview depend on the environment.

## Origin and adaptations

Adapted from [Ole Lehmann's Minto skill](https://github.com/olelehmann1337/claude-skills/blob/main/skills/minto/SKILL.md).

The underlying framework is Barbara Minto's Pyramid Principle; see [Minto's concept](https://www.barbaraminto.com/concept). This is an independent practical adaptation, not an official Minto publication.

This version replaces fixed branch counts and mandatory HTML with flexible structure and optional visual delivery. It preserves justified uncertainty, distinguishes proposed claims from the author's position, strengthens evidence assessment, and makes improvement requests end with a complete revision.

[Agent instructions](SKILL.md) · [Collection](../../README.md)
