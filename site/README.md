# Site development

The educational site is a static reading layer over the collection. Skill guides and copyable prompts normally come from `skills/*/README.md`. Perplexity Decisions instead uses `docs/pplx-decision/guide.md`, selected by its `guideSource` in `build.mjs`; its skill README is only a short package overview. These guide files remain the maintained content sources for introductions and prompt examples. `build.mjs` contains the homepage presentation and skill catalogue labels. `style.css` and `app.js` supply layout and interactions.

From this directory, install the pinned build dependency with `npm ci`, then run `npm run build`. Output goes to `../_site/`, which is not tracked. From the repository root, preview with `python3 -m http.server 8873 --bind 127.0.0.1 --directory _site` and open `http://127.0.0.1:8873/`.

The skill packages themselves do not require Node or the site dependency. The Pages workflow builds and deploys the site when changes are pushed to `main`, or when manually triggered in GitHub Actions. Only generated site content should be deployed, never the project parent or private maintainer records.

The build generates guide, supporting reference, and attribution pages and preserves relative navigation for a GitHub Pages repository subpath. External reading links open in a labelled new tab, following the visual references. Downloads retain normal browser behavior. Copy controls fall back to selecting the text if clipboard access is unavailable.

The Perplexity Decisions reader pages live in `docs/pplx-decision/`: `guide.md`, `model-comparison.md`, and `worked-example.md`. They are excluded from the installable skill folder. The `documentationPages` map in `build.mjs` preserves their public paths under `skills/pplx-decision/`: `index.html`, `model-comparison.html`, and `worked-example.html`. The guide is rendered once through the skill-guide template; the supporting-page loop skips that source. Preserve existing section anchors and copyable prompts when changing source locations.

The short skill README links to the published documentation so installed copies do not depend on files outside their folder. The site renderer turns links within this site into relative, same-tab navigation. Update repository and documentation cross-links when moving a source; the public URL need not change with its source path.

Historical experiment records remain in `examples/pplx-question-grouping/`, with the retired narrative in `records/pplx-question-grouping/`. Neither directory is an input to the published site. Preserve those records and their hashes when editing the reader guides. The build clears generated `_site/` before rendering so removed pages and evidence downloads cannot survive a local rebuild. Only explicitly selected documentation, skill files, and site assets are published.
