# GitHub Pages Guide

Turn repository content into an educational website that helps readers understand its value, see how it works, and take a useful next step.

Use this skill for explanatory guides, skill collections, and documentation on GitHub Pages. It connects the reading experience with the practical work of maintaining source content, building pages, checking interactions, and verifying an authorized deployment.

## When it helps

- A useful repository is difficult for newcomers to understand.
- A collection needs clear use cases, examples, and easy installation paths.
- A guide has grown into several pages that need coherent navigation.
- A redesign should improve presentation without changing approved wording or duplicating maintained content.

A small link or typo fix should remain small. This skill is not a general application-development workflow or a prescribed visual theme.

## Copyable examples

### Explain a repository

```text
Use the github-pages-guide skill to create an educational site from this repository.
Help newcomers understand the problem it solves, see a concrete example,
and find the setup instructions. Reuse the maintained content.
Prepare a local preview for review; do not publish yet.
```

### Showcase a skill collection

```text
Use the github-pages-guide skill to build a site for this skill collection.
Visitors should understand each skill's purpose, find an example to try,
and install quickly. Use the individual READMEs as the maintained source.
Use these sites as visual references: [URLs].
Prepare a local preview first.
```

### Improve an existing site

```text
Use the github-pages-guide skill to improve this site's mobile navigation
and copy buttons. Preserve approved wording and the existing design.
Inspect the relevant interactions and show me the local result.
```

### Publish an approved change

```text
Use the github-pages-guide skill to publish the approved changes to this
repository's GitHub Pages site. Use the existing deployment workflow,
verify the live result, and report the URL and any remaining limitations.
```

## What to provide

Identify the repository, intended audience, and what visitors should understand or do. Include any visual references, approved copy, and content that must remain unchanged. State whether you want recommendations, a local preview, or publication.

The skill adapts to the project. Newcomer introductions can explain before setup; catalogues and reference pages can provide immediate installation or lookup paths. Visual references guide the design without dictating its content or structure.

## What to expect

A site built around the reader's purpose, with consistent navigation, readable mobile layouts, and appropriate examples or copy controls. The opening explains the subject and audience, and the pages offer a clear next action without unnecessary repetition. Examples clarify the subject when helpful; they are not a required template. Maintained source content remains the authority, and changes to setup or packaging prompt checks of the instructions that depend on them. Checks cover relevant links, content fidelity, interactions, and rendering; publication tasks also check the deployment and live output.

Available filesystem, browser, and deployment capabilities determine what the agent can execute and verify. The skill supplies instructions, not hosting access or credentials. It does not guarantee compatibility with every agent environment.

The Minto skill can help with substantial argument restructuring, but is optional. Installation does not require it or any particular model, framework, or build system.

## Install and invoke

Copy the entire `github-pages-guide` folder into your application's supported skills directory, preserving all files, including `references/`, `agents/`, and the license. Follow that application's reload or discovery procedure. Invoke it in plain language: “Use the github-pages-guide skill to…”

`SKILL.md` contains the operating instructions; this README explains their use. The optional `agents/` metadata supplies a display label for applications that recognize it. Other environments can use the skill without that metadata.

## Origin and license

Developed by Yusuf Goolamabbas from work on the [Separate Intelligence and Search](https://goolamabbas.github.io/separate-intelligence-and-search/) and [Portable LLM Council](https://goolamabbas.github.io/portable-llm-council/) sites. The skill generalizes their lessons about reading flow, source fidelity, and deployment verification without requiring their layouts.

[MIT](LICENSE). Keep the license notice with copies of this skill.
