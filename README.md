# ShuvoLex

[Open the ShuvoLex website](https://shuvo-nix.github.io/shuvolex/)

ShuvoLex v2.1 is an academic-first AI text humanizer that runs from GitHub Pages. Paste AI-generated text, choose Academic, General, or Blog, and get natural human writing back with every changed word highlighted.

## Live website

Use the application here: [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/)

## Two engines

1. AI rewrite mode. Click the gear icon, paste your own API key, and ShuvoLex sends your draft plus all 35 Humanizer rules to the model you choose. Supported providers: OpenRouter, Google Gemini, and any OpenAI-compatible endpoint. Your key is used only from your browser tab, is sent only to your provider, and is stored in localStorage only if you tick remember.
2. Local rules mode. A free, offline fallback that runs all 35 pattern checks from the Humanizer `SKILL.md` guidance live as you type, plus a deterministic rewriter: filler removal, AI vocabulary swaps, -ing clause rewrites, staged contrast flattening, dash and quote normalization, chatbot artifact removal, and contraction expansion in Academic mode.

## Features

- Academic mode selected by default; General and Blog also available.
- Light, Balanced, and Deep rewrite strengths.
- Highlighted diff: every changed word is marked in the result, with a percentage of words changed. Toggle it off with the Highlight changes switch.
- Compact one-line controls on desktop; on mobile the Humanize button sits full-width directly under the input.
- Icon toolbar on both panels: paste from clipboard, load sample, clear input, copy result, download as .txt.
- Live 35-pattern review chips with per-pattern advice from the skill.
- Modern dark interface, responsive for mobile.

## About AI detectors

No editor can guarantee a 0% score on an AI detector. Detectors are probabilistic, disagree with each other, and flag genuine human academic writing regularly. ShuvoLex reduces the patterns detectors look for, shows you exactly which words changed, and the AI rewrite mode goes much further than local rules. Treat detector scores as a rough signal, not a verdict, and always review the text yourself.

## Get an API key for AI mode

- OpenRouter: create a key at openrouter.ai/keys, then use a model such as meta-llama/llama-3.1-70b-instruct or openai/gpt-4o-mini.
- Google Gemini: create a key in Google AI Studio, then use gemini-1.5-flash.
- Custom: any OpenAI-compatible chat completions endpoint.

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

- `index.html`: interface with icon toolbar, controls bar, and AI settings modal
- `style.css`: dark responsive design with highlighted diff marks
- `app.js`: 35-pattern engine, local rewriter, word-level diff, and AI provider client

## License

MIT. See [LICENSE](LICENSE).