# Fonts

Served from this site rather than from Google, which removes a third-party DNS
lookup, TLS handshake and render-blocking stylesheet from the critical path.

Two families, the ones TIBECO Group's site is set in, each in its **latin**
cut, which is all an English-only site needs (the few Arabic sub-labels fall
back to the system's Arabic face, as they do on TIBECO's site).

| File | Family | Licence |
|---|---|---|
| `playfair-display-latin.woff2` | Playfair Display (variable, 400–700), Claus Eggers Sørensen | SIL Open Font License 1.1 |
| `raleway-latin.woff2` | Raleway (variable, 300–700), Matt McInerney, Pablo Impallari, Rodrigo Fuenzalida | SIL Open Font License 1.1 |

The OFL permits redistribution and self-hosting, bundled or not, provided the
licence travels with the fonts. Full text: <https://openfontlicense.org>.
Each family's own copy is on its Google Fonts page under "About".

To refresh them, re-download the latin `woff2` named in the stylesheet that
`https://fonts.googleapis.com/css2?family=…` returns for a modern browser, and
keep the `unicode-range` in `assets/css/site.css` in step with it.
