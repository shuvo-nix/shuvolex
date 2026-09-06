# ShuvoLex

[Open the ShuvoLex website](https://shuvo-nix.github.io/shuvolex/)

ShuvoLex v2.4 is an academic-first AI text humanizer that runs from GitHub Pages. Paste AI-generated text, press Humanize, and get natural human writing back with every changed word marked. A free built-in AI model works out of the box with no key, no account, and no setup.

## Live website

Use the application here: [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/)

## How it works

1. AI rewrite mode (default). Sends your draft plus the 35 Humanizer rules from `SKILL.md` (based on Wikipedia's Signs of AI writing) to a model and returns a full rewrite in Academic, General, or Blog tone. The free built-in provider works with zero setup. For better quality and privacy, open settings (gear icon) and add your own OpenRouter, Google Gemini, or OpenAI-compatible key. You can also paste the provider's example code snippet and the key, model, and endpoint are extracted automatically. Typed values apply immediately. Keys are sent only to your provider, never to the repository.
2. Local rules mode. A free, fully offline engine: all 35 pattern checks run live as you type, plus a deterministic rewriter with filler removal, AI vocabulary swaps, sentence-rhythm restructuring, dash and quote normalization, chatbot artifact removal, and contraction expansion in Academic mode.

## Privacy

- Local rules mode: text never leaves your browser.
- Free AI mode: text goes to a public model endpoint (text.pollinations.ai). Do not paste secrets there.
- Your own key: text goes only to the provider you configured.

## Features

- Works on first load with no key, no signup, no backend.
- Academic mode selected by default; General and Blog also available.
- Light, Balanced, and Deep rewrite strengths.
- Always-on change marking: every rewritten word is marked in amber, with a percentage of words changed in the footer.
- Humanize sits in the controls bar on desktop and full-width under the input on mobile.
- Independent clear buttons: the original and rewritten panels each have their own trash icon and never clear each other.
- Live 35-pattern review chips with per-pattern advice from the skill.
- Smart key setup from pasted provider code; settings apply as you type.
- Persistent, exact error messages in the output panel if a provider call fails.

## About the 35 patterns

The Humanizer `SKILL.md` defines exactly 35 numbered patterns, each with a words-to-watch sub-list. ShuvoLex scans both the patterns and the sub-terms, and every chip in the review panel shows the pattern number it belongs to.

## About AI detectors

No editor can guarantee a 0% score on an AI detector. Detectors are probabilistic, disagree with each other, and flag genuine human academic writing regularly. ShuvoLex reduces the patterns detectors look for and shows you exactly which words changed. Treat detector scores as a rough signal, not a verdict, and always review the text yourself.

## Limitations

Local mode is a deterministic editor, not an LLM. The free AI provider can be rate-limited at busy times; add your own key for reliability. Always review output, keep citations accurate, and follow your institution's academic-integrity rules.

## Local use

Open `index.html` in a browser. No build step or backend is needed.

## Publish with GitHub Pages

1. Open repository Settings.
2. Select Pages.
3. Under Build and deployment, select Deploy from a branch.
4. Select branch `main` and folder `/(root)`.
5. Save, then visit [https://shuvo-nix.github.io/shuvolex/](https://shuvo-nix.github.io/shuvolex/).

## Files

- `index.html`: interface with icon toolbars, controls bar with Humanize, and AI settings modal with smart paste
- `style.css`: dark responsive design with amber change marks
- `app.js`: 35-pattern engine, local rewriter, always-on word diff, and AI provider client (free built-in, OpenRouter, Gemini, custom)

## License

MIT. See [LICENSE](LICENSE).