# Fonts

Served from this site rather than from Google, which removed a third-party DNS
lookup, TLS handshake and render-blocking stylesheet from the critical path —
392ms of first paint on a fast connection.

One family, Inter, in its **latin** cut, which is all an English-only site
needs. Headings are the same file set bold; the variable font carries 400
to 700. (Newsreader, the serif of the first design, left when the site was
redrawn to the TIBECO reference; it is in git history.)

| File | Family | Licence |
|---|---|---|
| `inter-latin.woff2` | Inter (variable, 400–700), Rasmus Andersson | SIL Open Font License 1.1 |

The OFL permits redistribution and self-hosting, bundled or not, provided the
licence travels with the fonts. Full text: <https://openfontlicense.org>.
Its own copy is on its Google Fonts page under "About".

To refresh them, re-download the latin `woff2` named in the stylesheet that
`https://fonts.googleapis.com/css2?family=…` returns for a modern browser, and
keep the `unicode-range` in `assets/css/site.css` in step with it.
