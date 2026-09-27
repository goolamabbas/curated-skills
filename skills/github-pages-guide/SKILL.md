---
name: github-pages-guide
description: Build or refine educational GitHub Pages sites from repository content. Use for explanatory guides, skill catalogues, and documentation sites where reading flow and source fidelity matter.
---

# GitHub Pages Guide

Help readers understand the subject and take a useful next step. Adapt the site to its audience, maintained content, and existing visual conventions. Inspect only what the requested change needs; preserve approved copy during layout-only changes.

## Choose the reader journey

Make the opening answer what this is, who it is for, and what the reader can do here. Prefer concrete descriptions to slogans; explain unfamiliar terms where they first matter. Choose an information structure suited to the task:

- Introductions explain the idea with enough context, examples, and limitations to make the next action meaningful.
- Catalogues help visitors choose a relevant item, understand its use case, and reach an example or installation instructions quickly.
- Reference pages prioritize lookup and navigation; procedures follow dependencies.

Provide a clear route to the reader’s first useful action, whether reading, comparing, downloading, setting up, or contributing. Put necessary prerequisites beside that action and optional depth elsewhere. Offer shortcuts for experienced readers without crowding the introduction. Choose page count, navigation, and calls to action from the content rather than copying another site’s sequence.

For explanatory arguments, group supporting ideas beneath clear conclusions, check logical order and evidence, and preserve justified uncertainty. Use the Minto skill when explicitly requested or when a substantial argument needs its fuller method and the skill is available. It is not a dependency for ordinary copy, layout changes, or a working site.

## Reader experience

Give each section a distinct job. Consolidate repeated explanations and caveats, retaining essential context on pages that readers may reach directly. Use consistent names and headings that help readers predict the content. Prefer a concrete, audience-appropriate example when it explains more than additional prose; distinguish illustrative examples from observed results. Do not require an example or fixed section layout on every site.

Put optional depth behind progressive disclosure without hiding essential qualifications. Add search, filtering, or interactive builders only when a reader need justifies their implementation and upkeep.

Treat reference sites as visual direction, not permission to copy their claims, branding, or content. Reuse approved project conventions; otherwise choose typography, spacing, contrast, and responsive layouts for legibility. Avoid imposing a fixed palette or page template.

## Navigation and links

Link wording and visual indicators should match the destination and action; distinguish on-page jumps, other pages, external sources, and downloads. Ordinary internal navigation and section links stay in the same tab. Prefer the site's rendered edition for reading, with separately labelled repository source links where useful.

Follow the user's preference or a consistent existing convention for external links. Without one, use normal same-tab navigation unless readers need a supporting resource alongside the current page. Clearly indicate new-tab links and use `rel="noopener noreferrer"` with `target="_blank"`. Preserve downloads, fragments, and non-web links.

## Maintained content

Identify the authoritative content and existing build approach before changing the site. Derive repeated prompts, tables, commands, and outputs from their maintained source where practical. Avoid separately maintained copies that can drift. When packaging, setup, or supported behavior changes, inspect the affected guides, examples, and links for stale instructions. Prefer links to authoritative procedures over repeated copies. Source content may be Markdown, structured records, templates, or another project format; do not introduce a new framework just to use this skill.

Keep presentation copy distinguishable from source material. Preserve dates, attribution, licenses, limitations, and the distinction between fictional scenarios, actual outputs, and editorial summaries. An editorial or visual revision does not establish fresh factual verification. Make clear what verification dates cover, and do not imply that one observed example establishes broader compatibility or reliability. Flag missing or conflicting source material rather than silently inventing it.

## Finish the authorized task

Infer scope and completion from the request. For a preview-only task, finish the implementation, inspect it, fix relevant problems, and provide a working local preview without publishing. For authorized publication, continue through deployment and live verification without an extra approval pause. Earlier publication approval does not override a later preview-only request.

Use incremental previews when requested or useful to resolve design uncertainty; do not impose approval for each page on an authorized whole-site task. Before completion, read the changed pages as the intended visitor: can they identify the purpose, understand unfamiliar terms, and reach the intended action without contradictory instructions or unnecessary detours? Check source fidelity, links, and interactions proportionately. Correct misleading content and broken journeys before optional enhancements; stop once the authorized outcome is verified rather than expanding a modest guide into a comprehensive product. Report the URL, material limitations, and whether the result is local or published.

## Conditional references

- Read the relevant sections of [implementation.md](references/implementation.md) for link handling, copy controls, anchors, accessibility, GitHub Pages deployment, and publication checks.
- Read [project-lessons.md](references/project-lessons.md) only when examples of the originating design decisions would help. Those examples do not prescribe a new site's design.
