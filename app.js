const input = document.querySelector('#inputText');
const output = document.querySelector('#outputText');
const inputStats = document.querySelector('#inputStats');
const outputStats = document.querySelector('#outputStats');
const patternList = document.querySelector('#patternList');
const strength = document.querySelector('#strength');
const humanize = document.querySelector('#humanize');
const copy = document.querySelector('#copy');
const download = document.querySelector('#download');
const toast = document.querySelector('#toast');
let mode = 'academic';
const sample = `In order to achieve this goal, it is important to note that the implementation of transparent assessment practices serves as a crucial component of the educational landscape. Additionally, educators should leverage innovative methods to foster meaningful engagement, ensuring that students are able to develop valuable critical-thinking skills. Experts argue that these approaches represent a pivotal step toward a more vibrant and inclusive learning environment.`;
const flags = [
  ['Inflated importance', /\b(crucial|pivotal|vital|significant|groundbreaking|testament)\b/gi, 'Prefer the specific fact over claims of importance.'],
  ['Sales language', /\b(vibrant|breathtaking|renowned|stunning|rich cultural heritage|must-visit)\b/gi, 'Replace promotional language with concrete description.'],
  ['Vague attribution', /\b(experts|observers|critics|industry reports) (believe|argue|say|have cited)\b/gi, 'Name a source or state only what the evidence shows.'],
  ['Filler phrase', /\b(in order to|due to the fact that|at this point in time|it is important to note that)\b/gi, 'State the point more directly.'],
  ['AI-coded wording', /\b(additionally|delve|underscore|showcase|fostering|landscape|interplay|tapestry)\b/gi, 'Check whether a simpler word says the same thing.'],
  ['Formulaic outlook', /\b(despite these challenges|the future looks bright|exciting times lie ahead)\b/gi, 'End on a concrete fact, plan, or finding.'],
  ['Long dash punctuation', /[\u2014\u2013]/g, 'Use a sentence, comma, colon, or parentheses when clearer.'],
  ['False contrast', /\b(not just|not merely|not only)\b/gi, 'State the claim without a staged contrast.']
];
function stats(text) { const words = (text.trim().match(/\S+/g) || []).length; return `${words} word${words === 1 ? '' : 's'} | ${text.length} characters`; }
function scan(text) { const found = flags.map(([name, regex, advice]) => { const count = (text.match(regex) || []).length; return count ? {name, count, advice} : null; }).filter(Boolean); patternList.innerHTML = found.length ? found.map(x => `<div class="pattern"><strong>${x.name} | ${x.count}</strong><span>${x.advice}</span></div>`).join('') : '<p class="quiet">No common patterns flagged. That does not confirm authorship or quality. Read the draft for accuracy and voice.</p>'; }
function replace(text, pattern, replacement) { return text.replace(pattern, replacement); }
function rewrite(raw) {
  let text = raw.trim(); if (!text) return '';
  text = replace(text, /\bIn order to\b/gi, 'To');
  text = replace(text, /\bdue to the fact that\b/gi, 'because');
  text = replace(text, /\bat this point in time\b/gi, 'now');
  text = replace(text, /\bit is important to note that\s*/gi, '');
  text = replace(text, /\bhas the ability to\b/gi, 'can');
  text = replace(text, /\bserves as\b/gi, 'is');
  text = replace(text, /\bstands as\b/gi, 'is');
  text = replace(text, /\badditionally\b/gi, 'Also');
  text = replace(text, /\butilize\b/gi, 'use');
  text = replace(text, /\bcommence\b/gi, 'begin');
  text = replace(text, /\bprior to\b/gi, 'before');
  text = replace(text, /\bfor the purpose of\b/gi, 'to');
  text = replace(text, /\bnot only\s+([^,.!?;]+?)\s+but also\s+/gi, '$1 and ');
  text = replace(text, /\bnot just\s+([^,.!?;]+?)\s+but\s+/gi, '$1 and ');
  text = replace(text, /\s*[\u2014\u2013]\s*/g, ', ');
  text = replace(text, /\s{2,}/g, ' ').replace(/,\s*,/g, ',');
  if (strength.value !== 'light') { text = replace(text, /\bExperts (believe|argue|say) that\s*/gi, ''); text = replace(text, /\bThe future looks bright\.?/gi, ''); text = replace(text, /\bexciting times lie ahead\.?/gi, ''); }
  if (mode === 'academic') { text = replace(text, /\bvery\s+(important|significant|crucial)\b/gi, '$1'); text = replace(text, /\bI think\b/gi, 'The evidence suggests'); text = replace(text, /\bwe can see that\b/gi, ''); text = replace(text, /\bkind of\b/gi, 'somewhat'); }
  else if (mode === 'blog') { text = replace(text, /\bthe implementation of\b/gi, 'using'); text = replace(text, /\bthe utilization of\b/gi, 'using'); text = replace(text, /\bindividuals\b/gi, 'people'); }
  if (strength.value === 'direct') { text = replace(text, /\bactually\b/gi, ''); text = replace(text, /\breally\b/gi, ''); text = replace(text, /\bquite\b/gi, ''); text = replace(text, /\s{2,}/g, ' '); }
  return text.replace(/\s+([,.;!?])/g, '$1').replace(/\n{3,}/g, '\n\n').trim();
}
function updateInput() { inputStats.textContent = stats(input.value); scan(input.value); }
function notify(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function run() { const result = rewrite(input.value); output.textContent = result || 'Your revised text will appear here.'; output.classList.toggle('empty', !result); outputStats.textContent = result ? stats(result) : 'Waiting for text'; copy.disabled = !result; download.disabled = !result; if (result) notify('Revision ready. Review it before using it.'); }
document.querySelectorAll('.mode').forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; document.querySelectorAll('.mode').forEach(x => { const active = x === button; x.classList.toggle('active', active); x.setAttribute('aria-pressed', active); }); if (input.value.trim()) run(); }));
input.addEventListener('input', updateInput); humanize.addEventListener('click', run);
document.querySelector('#sample').addEventListener('click', () => { input.value = sample; updateInput(); run(); });
document.querySelector('#clear').addEventListener('click', () => { input.value = ''; output.textContent = 'Your revised text will appear here.'; output.classList.add('empty'); outputStats.textContent = 'Waiting for text'; copy.disabled = true; download.disabled = true; updateInput(); input.focus(); });
copy.addEventListener('click', async () => { await navigator.clipboard.writeText(output.textContent); notify('Copied to clipboard.'); });
download.addEventListener('click', () => { const blob = new Blob([output.textContent], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'shuvollex-revised-draft.txt'; a.click(); URL.revokeObjectURL(a.href); });
document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
updateInput();