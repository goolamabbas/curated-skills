# Curated Skills

A growing collection of agent skills selected, adapted, and maintained by Yusuf Goolamabbas for practical use.

Each skill provides focused instructions for an AI agent. Choose the skill that fits your task; the collection does not need to be used as a bundle.

| Skill | What it helps you do | Guide |
| --- | --- | --- |
| **Minto** | Structure an argument around the reader's question, a clear answer, and supporting logic. | [Use Minto](skills/minto/README.md) |
| **Xray** | Examine public news through incentives, evidence, competing explanations, and possible next events. | [Use Xray](skills/xray/README.md) |
| **AGENTS.md Author** | Create, audit, or prune a project’s AGENTS.md. | [Use AGENTS.md Author](skills/agents-md-author/README.md) |
| **GitHub Pages Guide** | Build educational sites that explain repository content and help readers get started. | [Use GitHub Pages Guide](skills/github-pages-guide/README.md) |

Read the [Curated Skills website](https://goolamabbas.github.io/curated-skills/) for examples, guided introductions, and installation help.

## Installation

1. [Download the collection ZIP](https://github.com/goolamabbas/curated-skills/archive/refs/heads/main.zip) and unzip it.
2. Open `skills/` and choose one folder: `minto`, `xray`, `agents-md-author`, or `github-pages-guide`.
3. Copy that **whole folder** into your application's documented skills directory. Keep `SKILL.md`, the license, and any `references/` or `agents/` subfolders together. Back up an existing copy before replacing it.
4. Follow your application's reload instructions, then ask for the skill by its slug using an example from its guide.

Your application must support folder-based agent skills. Its documentation determines the installation location and reload procedure; these vary by application. The collection itself needs no additional runtime packages.

The README in each folder is the human guide; `SKILL.md` contains the agent instructions. Downloading `SKILL.md` alone is not a complete installation.

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
