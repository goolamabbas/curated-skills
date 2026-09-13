# Curated Skills

A growing collection of agent skills selected, adapted, and maintained by Yusuf Goolamabbas for practical use.

Each skill provides focused instructions for an AI agent. Choose the skill that fits your task; the collection does not need to be used as a bundle.

| Skill | What it helps you do | Guide |
| --- | --- | --- |
| **Minto** | Structure an argument around the reader's question, a clear answer, and supporting logic. | [Use Minto](skills/minto/README.md) |
| **Xray** | Examine public news through incentives, evidence, competing explanations, and possible next events. | [Use Xray](skills/xray/README.md) |
| **agents-md-author** | Create, audit, or prune useful standing instructions for agents. | [Use agents-md-author](skills/agents-md-author/README.md) |

## Installation

Copy the entire folder for the skill you want from `skills/` into your application's supported skills directory. Preserve any `references/` subfolder. Compare or back up an existing installation before replacing it.

Use your application's documented skills location and reload procedure. Install the inner skill folder containing `SKILL.md`, not the collection folder; discovery varies by environment.

The skill-specific README is a human guide. `SKILL.md` contains the agent instructions, and any linked references support that workflow. No additional runtime scripts or packages are included. Research and visual delivery depend on tools available to your agent.

## Usage

Ask in plain language:

```text
Use the minto skill to improve this draft for [audience]:
[paste draft]
```

Use the same plain-language pattern for any skill: ‘Use the [skill name] skill to…’. The guides provide complete examples and explain what to expect. These requests assume the skill is installed and available to your agent; no application-specific command syntax is required by the examples.

## Origins

Curation includes selecting existing ideas, adapting instructions, and maintaining useful boundaries. Each skill guide records its origin and substantive adaptations. Attribution does not imply endorsement by the original author.

## License

[MIT](LICENSE). Each skill folder includes a copy of the license so it travels with independent installations. See [attribution](ATTRIBUTION.md) for upstream credits.
