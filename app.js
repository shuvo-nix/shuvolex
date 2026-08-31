const $=s=>document.querySelector(s);
const input=$('#inputText'),output=$('#outputText'),list=$('#patternList'),strengthSel=$('#strength'),toast=$('#toast');
let mode='academic';
const sample=`In order to achieve this goal, it is important to note that this vibrant approach serves as a crucial component of the educational landscape. Additionally, experts argue that it not only improves engagement but also represents a pivotal step toward a more inclusive future. Let us explore the key findings. I hope this helps!`;
const rules=[
[1,'Inflated importance',/\b(crucial|pivotal|vital|significant|testament|key turning point|indelible mark|deeply rooted)\b/gi,'State the concrete fact instead of claiming broad importance.'],
[2,'Name-dropping',/\b(New York Times|BBC|Financial Times|leading expert|active social media presence)\b/gi,'Keep named sources only when they add relevant, supported context.'],
[3,'Shallow analysis',/\b(highlighting|underscoring|emphasizing|symbolizing|showcasing|fostering)\b/gi,'Replace added interpretation with what the evidence supports.'],
[4,'Sales language',/\b(vibrant|breathtaking|stunning|renowned|must-visit|nestled|groundbreaking)\b/gi,'Use specific, neutral description.'],
[5,'Vague sources',/\b(experts|observers|critics|industry reports) (believe|argue|say|have cited)\b/gi,'Name the source or remove the unsupported attribution.'],
[6,'Formulaic outlook',/\b(despite these challenges|future outlook|continues to thrive)\b/gi,'Keep concrete challenges or plans; remove generic outlook text.'],
[7,'Overused AI wording',/\b(additionally|delve|underscore|showcase|landscape|tapestry|interplay|garner)\b/gi,'Use a simpler word if it preserves the meaning.'],
[8,'Avoiding is or has',/\b(serves as|stands as|boasts)\b/gi,'Prefer direct verbs such as is, has, or includes.'],
[9,'Staged contrast',/\b(not just|not merely|not only)\b/gi,'State the point directly.'],
[10,'Forced group of three',/\b\w+, \w+, and \w+\b/gi,'Review whether every item is needed; use only what the meaning requires.'],
[11,'Repeated openings',/\b(She|He|It|They|We) [^.]{1,90}\. \1\b/g,'Merge or vary repeated sentence openings.'],
[12,'False range',/\bfrom [^,.]{2,40} to [^,.]{2,40}, from\b/gi,'List separate topics rather than presenting a false range.'],
[13,'Passive voice',/\b(has been|have been|had been|is|are|was|were) \w+(ed|en)\b/gi,'Name the actor when it makes the sentence clearer.'],
[14,'Long dash punctuation',/[\u2014\u2013]/g,'Use a comma, colon, parentheses, or a new sentence.'],
[15,'Excessive bold',/\*\*[^*]+\*\*/g,'Reserve emphasis for essential terms.'],
[16,'Label-heavy list',/^\s*[-*]\s*\*\*[^*:]{1,40}:\*\*/gm,'Use prose when labeled list items add no structure.'],
[17,'Title-case heading',/^#{1,6}\s+[A-Z]\w*(\s+[A-Z]\w*){2,}/gm,'Use sentence case for headings.'],
[18,'Decorative emoji',/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'Remove decorative emoji from formal writing.'],
[19,'Curly quotation marks',/[\u201C\u201D\u2018\u2019]/g,'Use the quotation style required by the target format.'],
[20,'Chatbot artifact',/\b(I hope this helps|Of course!|Certainly!|Would you like|Want me to|Let me know)\b/gi,'Remove assistant-style greetings, offers, and closings.'],
[21,'Unsupported guess',/\b(likely (grew up|studied|began)|it is believed that|appears to have|maintains a low profile|not publicly available)\b/gi,'Do not present a guess as a documented fact.'],
[22,'Over-agreeable tone',/\b(Great question!|You are absolutely right|Excellent point)\b/gi,'State the relevant point without routine praise.'],
[23,'Filler phrase',/\b(in order to|due to the fact that|at this point in time|in the event that|has the ability to)\b/gi,'Use a shorter, direct phrase.'],
[24,'Stacked qualifiers',/\b(could potentially|might arguably|may possibly|could possibly)\b/gi,'Keep only the qualifier the evidence needs.'],
[25,'Generic positive ending',/\b(the future looks bright|exciting times lie ahead|journey toward excellence|the possibilities are endless)\b/gi,'End with the last concrete fact or a sourced plan.'],
[26,'Hyphenated word pairs',/\b(cross-functional|data-driven|client-facing|end-to-end|decision-making|high-quality|real-time|long-term|third-party)\b/gi,'Keep the hyphen only where grammar requires it.'],
[27,'Fake deeper truth',/\b(at its core|the real question is|what really matters|the heart of the matter)\b/gi,'State the specific claim.'],
[28,'Announcing the point',/\b(let's dive|let us (dive|explore)|here's what you need to know|without further ado|let's explore)\b/gi,'Start with the content.'],
[29,'Repeated heading',null,'Remove the sentence that merely restates its heading.'],
[30,'Previous-version focus',/\b(was added to replace|previous approach|used to be)\b/gi,'Describe current behavior unless writing a change log.'],
[31,'Dramatic fragments',null,'Combine forced fragments into natural sentences.'],
[32,'Formulaic saying',/\bis the (language|currency|architecture|mirror) of\b|\bbecomes a trap\b/gi,'State the literal claim.'],
[33,'Fake-candid opening',/\b(Honestly\?|Look,|Here's the thing|Real talk|Let's be honest)\b/gi,'State the point directly.'],
[34,'Unneeded objection',/\b(This isn't (mainly|really) about|I'm not (saying|arguing)|To be clear|Don't get me wrong)\b/gi,'Remove defenses that answer no real objection.'],
[35,'Fake alternative',/\b(A tempting (option|approach) would be|One might be tempted to|You might think|It would be easy to just)\b/gi,'State the actual constraint or choice.']
];
function headingRepeats(t){let n=0;const lines=t.split('\n');for(let i=0;i<lines.length;i++){const m=lines[i].match(/^#{1,6}\s+(.+)/);if(m){for(let j=i+1;j<lines.length;j++){const s=lines[j].trim();if(!s)continue;if(s.replace(/[.!?]$/,'').toLowerCase().includes(m[1].trim().toLowerCase()))n++;break}}}return n}
function fragmentRuns(t){const s=t.match(/[^.!?]+[.!?]/g)||[];let run=0,max=0;s.forEach(x=>{const w=(x.trim().match(/\S+/g)||[]).length;if(w>0&&w<=3){run++;max=Math.max(max,run)}else run=0});return max>=3?max:0}
function scan(t){const found=[];rules.forEach(r=>{let n=0;if(r[2]){n=(t.match(r[2])||[]).length}else if(r[0]===29){n=headingRepeats(t)}else if(r[0]===31){n=fragmentRuns(t)}if(n)found.push([r[0],r[1],n,r[3]])});list.innerHTML=found.length?found.map(x=>`<div class="pattern"><strong>#${x[0]} ${x[1]} | ${x[2]}</strong><span>${x[3]}</span></div>`).join(''):'<p class="quiet">No common patterns flagged. That does not confirm authorship or quality. Review accuracy, sources, and voice.</p>'}
function revise(raw){let t=raw.trim();if(!t)return '';const basic=[
[/\bIn order to\b/g,'To'],[/\bin order to\b/g,'to'],
[/\b[Dd]ue to the fact that\b/g,m=>m[0]==='D'?'Because':'because'],
[/\bat this point in time\b/gi,'now'],
[/\bin the event that\b/gi,'if'],
[/\bhas the ability to\b/gi,'can'],
[/\bit is important to note that\s*/gi,''],
[/\b[Ss]erves as\b/g,m=>m[0]==='S'?'Is':'is'],
[/\b[Ss]tands as\b/g,m=>m[0]==='S'?'Is':'is'],
[/\bboasts\b/gi,'has'],
[/\bAdditionally,\s*/g,'Also, '],[/\badditionally\b/gi,'also'],
[/\butilize\b/gi,'use'],[/\butilizes\b/gi,'uses'],
[/\bprior to\b/gi,'before'],
[/\bcommence\b/gi,'begin'],
[/\bnot only\s+([^,.!?;]+?)\s+but also\s+/gi,'$1 and '],
[/\s*[\u2014\u2013]\s*/g,', '],
[/[\u201C\u201D]/g,'"'],[/[\u2018\u2019]/g,"'"]
];basic.forEach(x=>{t=t.replace(x[0],x[1])});
if(strengthSel.value!=='light'){t=t.replace(/\s*\b(I hope this helps!?|Of course!|Certainly!|Great question!|Let me know if you[^.!?]*[.!?]?)/gi,' ');t=t.replace(/\b(The future looks bright|Exciting times lie ahead)\.?\s*/gi,'')}
if(mode==='academic'){t=t.replace(/\bI think\b/g,'The evidence suggests');t=t.replace(/\bwe can see that\b/gi,'');t=t.replace(/\bvery\s+(important|significant|crucial)\b/gi,'$1');t=t.replace(/\bkind of\b/gi,'somewhat')}
if(mode==='blog'){t=t.replace(/\bthe implementation of\b/gi,'using');t=t.replace(/\bthe utilization of\b/gi,'using');t=t.replace(/\bindividuals\b/gi,'people')}
if(strengthSel.value==='direct'){t=t.replace(/\b(actually|really|quite)\s*/gi,'')}
t=t.replace(/\s+([,.;!?])/g,'$1').replace(/,\s*,/g,',').replace(/([.!?])\s*,\s*/g,'$1 ').replace(/(^|[.!?]\s+)also\b/g,(m,p)=>p+'Also').replace(/\s{2,}/g,' ').replace(/\n{3,}/g,'\n\n').trim();return t}
function stat(t){const n=(t.trim().match(/\S+/g)||[]).length;return n+' word'+(n===1?'':'s')+' | '+t.length+' characters'}
function refresh(){$('#inputStats').textContent=stat(input.value);scan(input.value)}
function note(m){toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
function run(){const r=revise(input.value);output.textContent=r||'Your revised text will appear here.';output.classList.toggle('empty',!r);$('#outputStats').textContent=r?stat(r):'Waiting for text';$('#copy').disabled=!r;$('#download').disabled=!r;if(r)note('Revision ready. Review it before using it.')}
document.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('.mode').forEach(x=>{const a=x===b;x.classList.toggle('active',a);x.setAttribute('aria-pressed',a)});if(input.value.trim())run()}));
input.addEventListener('input',refresh);
$('#humanize').addEventListener('click',run);
$('#sample').addEventListener('click',()=>{input.value=sample;refresh();run()});
$('#clear').addEventListener('click',()=>{input.value='';output.textContent='Your revised text will appear here.';output.classList.add('empty');$('#outputStats').textContent='Waiting for text';$('#copy').disabled=true;$('#download').disabled=true;refresh();input.focus()});
$('#copy').addEventListener('click',async()=>{await navigator.clipboard.writeText(output.textContent);note('Copied to clipboard.')});
$('#download').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([output.textContent],{type:'text/plain'}));a.download='shuvolex-revised-draft.txt';a.click();URL.revokeObjectURL(a.href)});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();run()}});
refresh();