# Third-party acknowledgments

The implementation is original. Product names are used descriptively; there is no affiliation with or endorsement by a16z.

## Runtime components

| Component | Pinned version | License | Use |
|---|---:|---|---|
| React / React DOM | 19.1.1 | MIT | UI |
| Express | 5.1.0 | MIT | JSON API and static serving |
| ts-fsrs | 5.4.2 | MIT | FSRS-6 card creation and grade transitions |
| Zod | 4.1.5 | MIT | Strict data validation |
| Node.js native SQLite | Node 24+ | Node distribution license; SQLite public domain | Persistent local server database |

The exact dependency graph is pinned in `package-lock.json`. Dependencies retain their upstream license files in their npm distributions. The ts-fsrs MIT copyright and permission notice is additionally retained at `docs/licenses/ts-fsrs-LICENSE.txt`. License texts for React, React DOM, Scheduler, Express, Zod and tsx are also retained in `docs/licenses/`. Build/test tooling (TypeScript, Vite, tsx, Playwright and React plugin) retains its respective MIT/Apache notices through its packages; consult installed LICENSE files before redistributing packaged dependencies. This list is not a security or legal audit.

## Studied, not incorporated

- [KISS Translator](https://github.com/fishjar/kiss-translator), GPL-3.0: interaction reference only; no code/assets copied.
- [Folo](https://github.com/RSSNext/Folo), AGPL-3.0-only with asset restrictions: reference only; no code or restricted icons copied.
- [Mozilla Readability](https://github.com/mozilla/readability), Apache-2.0: future extraction option; not installed or used.
- [Dexie](https://github.com/dexie/Dexie.js), Apache-2.0: future local cache option; not installed or used.

`fixtures/synthetic-library.json` is original synthetic teaching content written for this project. It is not a real a16z article, scraped material, or a representation of an actual company. Source code licenses do not grant rights to third-party article content, translations, logos or trademarks.
