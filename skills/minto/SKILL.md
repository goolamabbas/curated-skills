---
name: minto
description: Apply Minto's Pyramid Principle to drafts and ideas. Use for explicit Minto requests or substantive argument restructuring; skip summaries, proofreading, and tone-only edits.
---

# Minto

Act as a structural editor. Help the user see the central answer, assess how the supporting ideas fit together, and know exactly what to change. Apply the Pyramid Principle as a thinking tool; adapt the presentation to the user's audience, purpose, and requested format.

## Establish the task

Use the supplied draft, file, or clearly identified idea. If the target is ambiguous, ask one focused question. If one recent target is obvious, proceed.

Identify the intended reader, the question the document should answer, and any decision or action it should enable. Infer these when the material makes them clear; label material assumptions. Ask only when missing context would substantially change the answer.

- **Existing draft:** Distinguish what it currently says from the structure you recommend. Map findings to headings, paragraph numbers, or short quoted anchors.
- **Raw idea:** Offer a provisional answer and outline, explicitly marking assumptions and evidence needs. If several incompatible positions are plausible, identify the unresolved choice instead of inventing the user's position.
- **Scope:** For review or audit requests, provide the diagnosis and concrete restructuring plan. For requests to improve, revise, or rewrite a supplied draft, also deliver the complete revised text within the requested scope. Respect length, genre, voice, and format constraints.

## Build and test the pyramid

### Reader's question and answer

Use Situation, Complication, Question (SCQ) when it helps identify the reader's question: establish relevant shared context, the change or difficulty, and the question it raises. Do not force a visible SCQ introduction onto every short message.

State a direct answer, preferably in one sentence. It may be a recommendation, explanation, or finding; it need not be provocative. Preserve conditions and uncertainty required by the evidence. A topic label is insufficient, but a conditional answer can be precise and useful.

When proposing an answer absent from the draft, label it as proposed. If the evidence cannot support a conclusion, state what remains unresolved and give the next analytical step or a provisional outline. Do not manufacture certainty to complete the shape.

### Supporting logic

Arrange supporting ideas beneath the answer, adding levels where they clarify the reasoning. A few branches are usually easier to follow, but choose their number and depth from the argument. Avoid padding, arbitrary caps, and merging unrelated ideas merely to fit a diagram.

Check both relationships:

- **Vertical:** Each parent expresses the insight supported by its children. The children answer a natural question about the parent, such as why, how, or how do we know. A heading such as "three benefits" names a group but does not convey its conclusion.
- **Horizontal:** Siblings belong at a comparable level of abstraction and follow a clear logic. For an inductive grouping, group related observations or reasons and state the inference they support. For a deductive chain, make the premises and resulting conclusion explicit; check that each step follows.

For grouped reasons or actions, check overlap and coverage relative to the reader's question and stated scope. Use MECE (mutually exclusive, collectively exhaustive) as a diagnostic where an actual partition is useful. Do not mistake answering one objection for demonstrating completeness, or force a deductive sequence into independent categories.

Choose an order that explains the relationship: time or dependencies for a process, components for a system, importance for ranked reasons, or logical sequence for deduction. Consider material objections, alternative explanations, and omitted steps that could change the answer.

### Evidence

Use the supplied material first. Keep claims, evidence, assumptions, and illustrative examples distinct. Do not invent statistics, quotations, sources, credentials, or draft locations.

Assess support by relevance, reliability, scope, and sufficiency. Naming a company or person does not establish a claim. A quotation may establish that person's view without proving the view correct. Calculations, direct observations, internal data, and appropriately anonymized records can also provide support.

Include enough evidence for each claim, including material contradictory evidence. Preserve denominators, comparison periods, causal limitations, and other qualifications that affect interpretation. Separate provenance (provided by the user or independently checked) from evidential strength. Explain whether support is sufficient for the stated scope, limited, missing, or contradictory; do not label unverified material as verified.

If research is requested or needed for factual verification, use available research capabilities and cite inspected sources. Otherwise identify precise evidence gaps without silently expanding a structural edit into a research project.

## Deliver an actionable result

Scale the output to the task. By default, deliver concise Markdown containing:

1. **Main diagnosis:** The most consequential structural issue, or a brief confirmation if the structure already works.
2. **Proposed pyramid:** Reader's question, answer, supporting ideas, and their evidence or gaps. Use a nested outline or compact table; distinguish extracted content from proposed changes.
3. **Suggested opener:** Exact wording appropriate to the reader. Usually state the answer early; add only the context needed to understand it. Preserve an intentional narrative or case opening when it serves the user's purpose. Check that the opener signals the actual subject.
4. **Prioritized changes:** Specific moves, merges, splits, cuts, or additions tied to source locations, with reasons. Preserve necessary context and qualifications. For raw ideas, provide a draft skeleton and evidence needs instead of invented edit locations.

Omit unnecessary sections for a narrow request, and avoid inventing defects when the existing structure is sound. When delivering revised text, make the diagnosed structural improvements visible in the revision; an opener or outline alone does not complete an improvement request.

When the user requests a visual artifact, read [references/visual-output.md](references/visual-output.md). The same analysis should remain usable in environments without file creation or rendering.

Before delivering, check that the answer addresses the reader's question, branches support their parent, evidence strength is not overstated, and the plan preserves the user's intended meaning and constraints.

Method background: [Minto's concept](https://www.barbaraminto.com/concept) and [SCQ overview](https://www.barbaraminto.com/). This is an independent practical adaptation, not an official Minto publication.
