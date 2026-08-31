# ShuvoLex

[Open the ShuvoLex website](https://shuvo-nix.github.io/shuvolex/)

ShuvoLex is an academic-first writing editor that reviews all 35 Humanizer patterns and makes conservative local revisions. It runs entirely in the browser and deploys through GitHub Pages.

## Live website

Use the application here: [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/)

## Features

- Academic mode is the default, with General and Blog modes available.
- Reviews all 35 patterns from the Humanizer `SKILL.md` guidance.
- Detects content, language, grammar, style, chatbot, filler, hedging, and drafting patterns.
- Makes conservative local edits for filler, indirect phrasing, selected AI-coded wording, long dash punctuation, and curly quotes.
- Flags vague sources, unsupported guesses, and other high-risk issues for manual review instead of inventing information.
- Shows word and character counts and provides copy and text-download controls.
- Uses no backend, tracking, saved text, or API key.

## Limitations

ShuvoLex is a deterministic editor, not an LLM. It cannot verify evidence, sources, citations, or the full context of an argument. Review every revision carefully and follow your institution's academic-integrity requirements. A pattern flag is a review prompt, not proof of AI authorship.

## Local use

Open `index.html` in a browser. No build process, API key, or backend is needed.

## Publish with GitHub Pages

1. Open repository Settings.
2. Select Pages.
3. Under Build and deployment, select Deploy from a branch.
4. Select branch `main` and folder `/(root)`.
5. Save, then visit [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/).

## Files

- `index.html`: application interface
- `style.css`: responsive styling
- `app.js`: 35-pattern scanner and local revision engine

## License

MIT. See [LICENSE](LICENSE).