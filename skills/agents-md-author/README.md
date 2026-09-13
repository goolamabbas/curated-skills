# agents-md-author

Create, audit, or prune standing instructions that help an agent make recurring decisions in a project. The aim is useful project guidance that stays concise enough to apply consistently.

Use it when an AGENTS.md has accumulated overlapping rules, when starting a project's standing instructions, or when deciding whether a lesson from completed work belongs in those instructions.

## What belongs where?

Standing instructions are useful for recurring working rules, project constraints, and essential commands with clear triggers. Detailed architecture or procedures can live in maintained documentation, with a pointer explaining when to read them. Temporary progress usually belongs in a task note or handoff.

These are defaults. You can name your own destinations and content boundaries. A custom filename does not automatically make a document load as agent instructions, and a link does not guarantee that an application will load it.

## Copyable examples

### Audit before editing

```text
Use the agents-md-author skill to audit this project's AGENTS.md.
Recommend which rules to keep, merge, move, or remove, with reasons.
Check for unnecessary prerequisite reading and repeated approval requests.
Do not change any files yet.
```

### Apply a focused cleanup

```text
Use the agents-md-author skill to clean up this project's AGENTS.md.
Apply the edits, preserve explicit project constraints, and explain substantive
changes. Keep the scope to this file and check any command guidance you change
against the project sources.
```

### Create guidance from project evidence

```text
Use the agents-md-author skill to draft an AGENTS.md for this project.
Inspect relevant project documentation and scripts. Include only useful recurring
rules and commands supported by the project. Save the draft for my review;
do not change application code or configuration.
```

### Preserve lessons in named destinations

```text
Use the agents-md-author skill to review the lessons from this task.
Put durable working rules in AGENTS.md, operational details in fullbar.md,
and unresolved findings in snafu.md. Apply the relevant documentation changes.
Keep hypotheses distinct from established lessons and add reading pointers
only where they help future work.
```

## Get a better result

Specify the target file or project, whether you want recommendations or applied edits, and any requirements that must remain. Include the incident or evidence behind a new rule when relevant. The skill can also author initial instructions without requiring a prior failure.

The review asks whether each instruction has recurring value, a clear trigger and action, supporting evidence, and a reasonable maintenance cost. It checks whether a procedure prevents a concrete failure or needlessly constrains the agent. Exact procedures remain useful for fragile workflows.

For approval rules, the skill looks for premature stopping and repeated requests within already authorized work. It preserves explicit approval requirements and flags proposed changes to those boundaries for review. Auditing a boundary does not grant permission to relax it.

## What to expect

For an audit, expect concrete recommendations and their reasons. For applied edits, expect updated files plus a concise explanation of substantive changes, moved content, and verification limits.

The skill checks relevant command guidance against project sources. It does not run a deployment or destructive command just because the document mentions it. It also avoids turning a focused edit into a documentation reorganization.

It is unnecessary for ordinary prose editing or a routine session summary that has no bearing on standing instructions.

## Origin

Maintained in this collection by Yusuf Goolamabbas. This version reflects local revisions emphasizing user-selected destinations, evidence-backed conventions, conditional reading, flexible methods, and explicit completion boundaries.

The skill is designed to work across agent environments. It checks the applicable instruction scope and loading rules rather than assuming one application's behavior.

## License

[MIT](LICENSE). Keep the license notice with copies of this skill.

[Agent instructions](SKILL.md) · [Collection](../../README.md)
