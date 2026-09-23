# Site development

The educational site is a static reading layer over the collection. Skill guides and copyable prompts come from `skills/*/README.md`; those files remain the content source. `build.mjs` contains the homepage presentation and skill catalogue labels. `style.css` and `app.js` supply layout and interactions.

From this directory, install the pinned build dependency with `npm ci`, then run `npm run build`. Output goes to `../_site/`, which is not tracked. From the repository root, preview with `python3 -m http.server 8873 --bind 127.0.0.1 --directory _site` and open `http://127.0.0.1:8873/`.

The skill packages themselves do not require Node or the site dependency. The Pages workflow builds and deploys the site when changes are pushed to `main`, or when manually triggered in GitHub Actions. Only generated site content should be deployed, never the project parent or private maintainer records.

The build generates guide, supporting reference, and attribution pages and preserves relative navigation for a GitHub Pages repository subpath. External reading links open in a labelled new tab, following the visual references. Downloads retain normal browser behavior. Copy controls fall back to selecting the text if clipboard access is unavailable.
