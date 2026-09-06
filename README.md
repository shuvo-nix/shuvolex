# ShuvoLex

[Open the ShuvoLex website](https://shuvo-nix.github.io/shuvolex/)

ShuvoLex v2.3 is an academic-first AI text humanizer that runs from GitHub Pages. Paste AI-generated text, choose Academic, General, or Blog, and get natural human writing back with every changed word marked automatically.

## Live website

Use the application here: [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/)

## Two engines

1. AI rewrite mode. Open settings (gear icon) and either paste your API key or paste the whole code snippet your provider shows you (OpenRouter, Gemini, or any OpenAI-compatible one). ShuvoLex extracts the key, model, and endpoint automatically. The OpenRouter model list loads live, so retired model names are not suggested. Your key is sent only to your provider, never to the repository, and is stored in localStorage only if you tick remember. Closing settings without a key falls back to Local rules.
2. Local rules mode. A free, offline engine that runs all 35 pattern checks from the Humanizer `SKILL.md` guidance live as you type, including the words-to-watch lists inside each pattern. The rewriter handles filler removal, AI vocabulary swaps, -ing clause rewrites, staged contrast flattening, dash and quote normalization, chatbot artifact removal, contraction expansion in Academic mode, and sentence-rhythm restructuring that splits long uniform sentences at Balanced and Deep strengths.

## Features

- Academic mode selected by default; General and Blog also available.
- Light, Balanced, and Deep rewrite strengths.
- Always-on change marking: every rewritten word is marked in amber, with a percentage of words changed in the footer.
- Humanize sits in the controls bar on desktop and full-width under the input on mobile.
- Independent clear buttons: the original and rewritten panels each have their own trash icon and never clear each other.
- Icon toolbar on both panels: paste from clipboard, load sample, clear, copy result, download as .txt.
- Live 35-pattern review chips with per-pattern advice from the skill.
- Smart key setup: paste the provider's example code and the app fills in key, model, and endpoint.
- AI errors persist in the output panel with the exact provider message instead of a vanishing notice.
- A visible error notice if the script ever fails, instead of silent failure.
- Modern dark interface, responsive for mobile.

## About the 35 patterns

The Humanizer `SKILL.md` defines exactly 35 numbered patterns. Each pattern also carries a words-to-watch list, which is why the total number of watched terms is much higher. ShuvoLex scans the patterns and those sub-terms, and shows each hit with its pattern number so you can trace it back to the skill.

## About AI detectors

No editor can guarantee a 0% score on an AI detector. Detectors are probabilistic, disagree with each other, and flag genuine human academic writing regularly. ShuvoLex reduces the patterns detectors look for, shows you exactly which words changed, and the AI rewrite mode goes much further than local rules. Treat detector scores as a rough signal, not a verdict, and always review the text yourself.

## Limitations

Local mode is a deterministic editor, not an LLM. AI mode rewrites fully but depends on your provider and key. Always review output, keep citations accurate, and follow your institution's academic-integrity rules. A pattern flag is a review prompt, not proof of AI authorship.

## Local use

Open `index.html` in a browser. No build step or backend is needed. AI mode also works locally because calls go directly from your browser to your provider.

## Publish with GitHub Pages

1. Open repository Settings.
2. Select Pages.
3. Under Build and deployment, select Deploy from a branch.
4. Select branch `main` and folder `/(root)`.
5. Save, then visit [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/).

## Files

- `index.html`: interface with icon toolbars, controls bar with Humanize, and AI settings modal with smart paste
- `style.css`: dark responsive design with amber change marks
- `app.js`: 35-pattern engine, local rewriter with rhythm restructuring, always-on word diff, and AI provider client

## License

MIT. See [LICENSE](LICENSE).