# Perplexity Decisions

An agent skill for building, evaluating, and migrating applications that use Perplexity Decisions. Use it to identify suitable judgments, implement integrations, or port a TypeSafe/Jev workflow. It does not provide general Perplexity search or API credentials.

## Install and use

Copy this entire `pplx-decision` folder into your application's supported skills directory. Keep [SKILL.md](SKILL.md), this README, [LICENSE](LICENSE), and all five files in [references/](references/) together. Follow the application's reload instructions.

Before updating, back up the existing installation. Replace the complete folder with the current package so obsolete files are not retained. The reader guide, model comparison, and worked example live on the website, outside the installable skill.

Example request:

```text
Use the pplx-decision skill to assess this project for useful decision-model
integrations. Recommend a focused experiment. Do not change files or make
live API calls yet.
```

[SKILL.md](SKILL.md) contains the agent's operating instructions and selects the references needed for each task.

## Guides and examples

- [Full guide and copyable prompts](https://goolamabbas.github.io/curated-skills/skills/pplx-decision/index.html)
- [How Jev, Standard, and Flash differ](https://goolamabbas.github.io/curated-skills/skills/pplx-decision/model-comparison.html)
- [Support decision worked example](https://goolamabbas.github.io/curated-skills/skills/pplx-decision/worked-example.html)

## Origin and license

Adapted by Yusuf Goolamabbas for Perplexity Decisions, inspired by [TypeSafe's Jev skill](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md) and [ryana's Jevify prompt](https://github.com/ryana/jevify/blob/87a9ef3674f111c74bb33cccd3bfa56bd0c4a15c/README.md). This is an independent adaptation, not an official Perplexity or TypeSafe publication.

[MIT](LICENSE). Keep the license notice with redistributed copies.
