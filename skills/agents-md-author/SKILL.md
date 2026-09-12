---
name: agents-md-author
description: Draft, audit, or prune standing agent instructions such as AGENTS.md. Use when creating or revising these files, or evaluating task lessons for inclusion in them.
---

# AGENTS.md Author

Standing instructions can repeatedly consume context and influence later work. Keep what
helps a future agent make a recurring decision; remove noise without discarding useful
project knowledge. Do not assume a particular harness's loading or precedence behavior.

## Establish scope

- Identify the target file and whether the user wants suggestions, a draft, or applied edits.
- Read the target file and instructions that apply to its scope. Inspect linked documentation
  only when a proposed rule depends on it. Check the applicable harness's scope rules when
  they matter; do not assume all parent or nested files apply to the target.
- Inspect enough project evidence to support the proposed instructions: existing documentation,
  configuration, scripts, and explicit user requirements. Do not invent commands or conventions.
- Preserve explicit user requirements. Resolve conflicts using applicable instruction priority
  and evidence; ask only when a material ambiguity remains. Do not silently treat a conflicting
  preference as stale or edit unrelated preference files.

## Choose the destination

Follow the user's named files and content boundaries first. Otherwise use existing project
conventions and authoritative sources before creating new documents. These are defaults,
not mandatory filenames:

| Content | Usual destination |
| --- | --- |
| Recurring working rules, project constraints, essential setup or validation commands | `AGENTS.md`, scoped to the relevant work |
| Detailed setup, architecture, specifications, or operational procedures | Existing README, technical documentation, or runbook; link from instructions when useful |
| A compatibility discovery or implementation rationale worth preserving | Relevant test, code comment, decision record, or maintained technical note |
| Temporary progress, session outcomes, or unresolved investigations | Task notes or a handoff document, if useful and within scope |
| Duplicated, unsupported, or obsolete material with no remaining value | Remove or omit |

Filenames do not determine content categories. Custom files are not assumed to be automatically
loaded as instructions. Add a useful pointer from AGENTS.md when appropriate, stating when to
read it; do not imply that a link guarantees loading.

When relocating material, preserve useful content and update relevant links within the
authorized scope. If only an audit was requested, recommend the move without performing it.

## Evaluate candidate instructions

**Future value.** Will this help an agent make a recurring decision in this project? Does it
add something beyond obvious advice or readily available authoritative guidance? A rule may
be project-specific or learned from one incident and still be valuable.

**Actionability and evidence.** State the trigger and expected action clearly enough to
guide behavior. Ground conventions in user intent or inspected project evidence. For a rule
learned from a failure, check that it would have changed the outcome, then check a nearby
case where it should not apply. Initial authoring does not require a prior incident.

**Necessity and flexibility.** Does the instruction supply project knowledge or a constraint
the agent needs, or prescribe a method without a concrete reason? Check mandatory sequences,
fixed output templates, blanket reading requirements, and repeated testing instructions.
Prefer outcomes and decision criteria when several approaches are valid. Retain exact
procedures for fragile workflows. Consider the models and environments that will use the
file before removing guidance as redundant.

**Completion and approval boundaries.** Check whether instructions cause premature stopping
or repeated approval requests within already authorized work. Recommend a clear completion
condition and bounded continuation where appropriate. Preserve explicit user approval
requirements; flag proposed changes to those boundaries for review rather than silently
relaxing them.

**Maintenance.** Distinguish an intentional standing convention from an observation about
the current environment. Changeable information is not automatically disposable: keep a
concise instruction or pointer when its future value justifies upkeep. Prefer an authoritative
source over duplicated details; include a verification trigger when freshness matters.

## Draft or prune

For initial authoring, derive guidance from the user's requirements and inspected project
practices. For post-task learning, use observed evidence and distinguish unresolved hypotheses
from established lessons. Neither mode requires finishing an unrelated task first.

- Keep each instruction focused and place it where its scope applies. Use only as many
  sections as help readers find the guidance.
- Merge genuine duplicates without erasing distinct triggers, exceptions, or obligations.
- Remove restatements of automatic enforcement when they add no guidance. Retain useful
  instructions about when to run checks, how to interpret failures, or what tooling misses.
- Correct stale details from current evidence. Repeated past verification does not prove
  continued validity, and proximity does not make two rules duplicates.
- Preserve valuable findings in an appropriate destination instead of forcing future agents
  to rediscover them. Avoid expanding a focused edit into a documentation reorganization.

## Verify and report

- Re-read edited files from disk and review the diff for accidental deletions, changed scope,
  broken links, duplication, and conflicts with applicable instructions.
- Verify changed paths and command guidance against project sources. Run relevant safe checks
  when practical and authorized; do not execute a deployment or destructive command merely
  because the document names it. If no executable check is relevant, review the text directly.
- Describe substantive changes and reasons, content moved and its destination, and any checks
  not performed or uncertainty that remains. Distinguish structural validation from demonstrated
  behavior; do not claim that reviewing instructions proves agents will follow them.
