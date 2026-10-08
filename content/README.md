# Portable knowledge archive

`articles/` holds reviewed article JSON and readable Markdown in Git. The initial entry is **original synthetic demonstration content**, not a real a16z article. No real scheduled content has been imported or published.

- JSON is the portable source of truth for knowledge content; Markdown is a derived reading copy.
- Local SQLite imports the archive for queries and reading. Personal vocabulary, favorites, learning progress and review history stay in the ignored local database, never in Git.
- Staging is separate from acceptance/publication. Upstream ChatGPT collects/generates material; a reviewer checks the structured output and content rights; then an authorized publisher makes a normal Git commit.
- No ChatGPT account access, scheduled task, GitHub credential, automatic push, or Feishu integration is embedded in the app.

See [knowledge workflow](../docs/knowledge-workflow.md) for validation, staging, importing and publishing boundaries.
