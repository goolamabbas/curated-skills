# Implementation and publication notes

Consult the relevant portions when changing links, interactive content, or deployment. A small copy edit does not require every check below.

## Links

Resolve relative URLs against each page's actual URL. Classify links using both origin and the site's repository path; another project on the same GitHub Pages domain is not automatically internal. Preserve fragments, download semantics, and non-web links. Avoid duplicating link attributes or labels during rebuilds. Do not force a new tab for downloads or mail links merely because they are links.

## Tables and interactive content

- Keep two-column tables readable on phones; put genuinely wide tables in labelled, keyboard-accessible horizontal scroll regions without overflowing the page.
- Copy the complete source block, preserving characters and line breaks; visual wrapping must not alter copied content. Label controls for their actual content: prompt, endpoint, configuration, or instructions. Verify success and provide a usable fallback.
- Give repeated headings unique stable IDs. Direct links into collapsed content should reveal it. Preserve native mobile anchor behaviour; do not close a navigation disclosure in a way that shifts the destination unexpectedly.
- Reserve image dimensions to avoid anchor shifts. Keep visible focus, meaningful link labels, status announcements, and reduced-motion support.

## Page identity and sharing

For new pages or changes affecting publication metadata, check descriptive page titles, descriptions, and a working favicon. Use canonical URLs that match the deployed location, including the project base path. Where social previews serve the project, check Open Graph and card metadata and any preview image’s public URL. Missing tags alone do not prove that a platform shows no preview; report only behavior actually checked. Keep these checks proportionate to the change.

## GitHub Pages deployment

Inspect the existing publishing configuration and output directory. Respect the repository's chosen build and deployment method. Account for project-site base paths, custom domains where present, and static-hosting constraints; do not assume a server runtime or that root-relative paths work under a repository subpath. Keep credentials and private source records out of published output.

## Publication checks

Before publication, inspect the diff and run the existing build when the project uses one. Verify internal links and fragments, assets, canonical URLs, and new-tab classification. Compare copied/source-derived blocks to the maintained source. Check desktop and phone rendering, the main reading journey, and relevant interactions in a real browser. For new-tab links, verify that the source page retains its location and expanded state.

After authorized publication, confirm the correct commit and deployment succeeded. Verify live output matches the tested build and follow the main live navigation. If a browser shows old content, distinguish cached state from a failed deployment; refresh before changing correct source. Stop after bounded checks pass unless new evidence warrants more work.

Report the live or local URL, what changed, verification limits, and whether anything remains unpublished. Explain which existing links need updating; unchanged canonical URLs usually need no updates to existing shared links. Keep a straightforward Git rollback path.
