# ShuvoLex

[Open the ShuvoLex website](https://shuvo-nix.github.io/shuvolex/)

ShuvoLex v2 is an academic-first AI text humanizer that runs from GitHub Pages. Paste AI-generated text, choose Academic, General, or Blog, and get natural human writing back.

## Live website

Use the application here: [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/)

## Two engines

1. AI rewrite mode. Click the gear icon, paste your own API key, and ShuvoLex sends your draft plus all 35 Humanizer rules to the model you choose. Supported providers: OpenRouter, Google Gemini, and any OpenAI-compatible endpoint. Your key is used only from your browser tab, is sent only to your provider, and is stored in localStorage only if you tick remember. It never touches the repository or any other server.
2. Local rules mode. A free, offline fallback that runs all 35 pattern checks from the Humanizer `SKILL.md` guidance live as you type, plus a conservative deterministic rewriter (filler removal, AI vocabulary swaps, dash and quote normalization, chatbot artifact removal, contraction expansion in Academic mode).

## Features

- Academic mode selected by default; General and Blog also available.
- Light, Balanced, and Deep rewrite strengths.
- Icon toolbar on both panels: paste from clipboard, load sample, clear input, copy result, download as .txt.
- Live 35-pattern review chips with per-pattern advice from the skill.
- Strict output rules in AI mode: no invented facts, names, numbers, or citations; no em dashes or en dashes; straight quotes; source claims preserved.
- Modern dark interface, responsive for mobile.

## Get an API key for AI mode

- OpenRouter: create a key at openrouter.ai/keys, then use a model such as meta-llama/llama-3.1-70b-instruct or openai/gpt-4o-mini.
- Google Gemini: create a key in Google AI Studio, then use gemini-1.5-flash.
- Custom: any OpenAI-compatible chat completions endpoint.

## Limitations

Local mode is a deterministic editor, not an LLM, so it makes conservative edits and flags the rest for review. AI mode rewrites fully but depends on your provider and key. Always review output, keep citations accurate, and follow your institution's academic-integrity rules. A pattern flag is a review prompt, not proof of AI authorship.

## Local use

Open `index.html` in a browser. No build step or backend is needed. AI mode also works locally because calls go directly from your browser to your provider.

## Publish with GitHub Pages

1. Open repository Settings.
2. Select Pages.
3. Under Build and deployment, select Deploy from a branch.
4. Select branch `main` and folder `/(root)`.
5. Save, then visit [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/).

## Files

- `index.html`: v2 interface with icon toolbar and AI settings modal
- `style.css`: dark responsive design
- `app.js`: 35-pattern engine, local rewriter, and AI provider client

## License

MIT. See [LICENSE](LICENSE).