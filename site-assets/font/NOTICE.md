# Fonts

Served from this site rather than from Google, which removed a third-party DNS
lookup, TLS handshake and render-blocking stylesheet from the critical path —
392ms of first paint on a fast connection.

Each file is the **latin** cut, which is all an English-only site needs.

| File | Family | Licence |
|---|---|---|
| `archivo-latin.woff2` | Archivo (variable, 400–700), Omnibus-Type | SIL Open Font License 1.1 |
| `spacegrotesk-latin.woff2` | Space Grotesk 500, Florian Karsten | SIL Open Font License 1.1 |
| `playfair-italic-latin.woff2` | Playfair Display 600 italic, Claus Eggers Sørensen | SIL Open Font License 1.1 |

The OFL permits redistribution and self-hosting, bundled or not, provided the
licence travels with the fonts. Full text: <https://openfontlicense.org>.
Each family's own copy is on its Google Fonts page under "About".

To refresh them, re-download the latin `woff2` named in the stylesheet that
`https://fonts.googleapis.com/css2?family=…` returns for a modern browser, and
keep the `unicode-range` in `assets/css/site.css` in step with it.
