# ShuvoLex

ShuvoLex is an academic-first writing editor for reviewing common AI-writing patterns. It runs entirely in the browser and is designed to deploy directly through GitHub Pages.

## What it does

- Lets users paste a draft and select Academic, General, or Blog writing type.
- Defaults to Academic mode.
- Flags common patterns including filler, inflated claims, vague attribution, sales language, formulaic conclusions, staged contrasts, and long dash punctuation.
- Applies transparent local edits such as simplifying filler phrases and replacing unnecessarily formal wording.
- Provides word and character counts, copy, and download actions.
- Does not send text to a server or external AI provider.

## Important limitations

This is a deterministic rule-based editor, not an LLM. It cannot understand every context, verify sources, preserve every nuance automatically, or guarantee that writing will be judged as human-written. Review every output, especially academic work. Keep citations accurate and follow your school or publisher's academic-integrity rules.

The editing approach is informed by the supplied Humanizer skill and Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). A pattern flag is a prompt to review, not proof that any writing was created by AI.

## Run locally

Open `index.html` in a browser. No install, build system, key, or backend is needed.

## Publish with GitHub Pages

1. Go to the repository Settings.
2. Select Pages from the left sidebar.
3. Under Build and deployment, set Source to Deploy from a branch.
4. Choose branch main, folder /(root), then click Save.
5. GitHub will publish the site at `https://shuvo-nix.github.io/ShuvoLex/` after deployment completes.

## Project files

- `index.html`: application structure and interface
- `style.css`: responsive visual design
- `app.js`: local pattern scanner and rewriting logic

## License

MIT. See [LICENSE](LICENSE).