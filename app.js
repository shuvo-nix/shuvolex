const $=s=>document.querySelector(s);
const input=$('#inputText'),output=$('#outputText'),list=$('#patternList'),strengthSel=$('#strength'),toast=$('#toast');
let mode='academic',engine='local';
const sample=`In order to achieve this goal, it is important to note that the implementation of transparent assessment practices serves as a crucial component of the modern educational landscape. Additionally, experts argue that this approach not only fosters engagement but also plays a pivotal role in shaping outcomes. The system boasts a wide range of features, showcasing its vibrant potential. In conclusion, the future looks bright. I hope this helps!`;
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
[10,'Forced group of three',/\b\w+, \w+, and \w+\b/gi,'Review whether every item is needed.'],
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
function headingRepeats(t){let n=0;const L=t.split('\n');for(let i=0;i<L.length;i++){const m=L[i].match(/^#{1,6}\s+(.+)/);if(m){for(let j=i+1;j<L.length;j++){const s=L[j].trim();if(!s)continue;if(s.replace(/[.!?]$/,'').toLowerCase().includes(m[1].trim().toLowerCase()))n++;break}}}return n}
function fragmentRuns(t){const s=t.match(/[^.!?]+[.!?]/g)||[];let r=0,mx=0;s.forEach(x=>{const w=(x.trim().match(/\S+/g)||[]).length;if(w>0&&w<=3){r++;mx=Math.max(mx,r)}else r=0});return mx>=3?mx:0}
function scan(t){const f=[];rules.forEach(r=>{let n=0;if(r[2]){n=(t.match(r[2])||[]).length}else if(r[0]===29){n=headingRepeats(t)}else if(r[0]===31){n=fragmentRuns(t)}if(n)f.push(r.concat(n))});list.innerHTML=f.length?f.map(r=>`<span class="chip" title="${r[3]}"><span class="id">#${r[0]}</span>${r[1]}<span class="n">${r[4]}</span></span>`).join(''):'<p class="quiet">No common patterns flagged. Review accuracy, sources, and voice.</p>'}
const expand=[[/\bcan't\b/gi,'cannot'],[/\bwon't\b/gi,'will not'],[/\bdon't\b/gi,'do not'],[/\bdoesn't\b/gi,'does not'],[/\bdidn't\b/gi,'did not'],[/\bisn't\b/gi,'is not'],[/\baren't\b/gi,'are not'],[/\bwasn't\b/gi,'was not'],[/\bweren't\b/gi,'were not'],[/\bcouldn't\b/gi,'could not'],[/\bshouldn't\b/gi,'should not'],[/\bwouldn't\b/gi,'would not'],[/\bit's\b/gi,'it is'],[/\bthat's\b/gi,'that is'],[/\bthere's\b/gi,'there is'],[/\bI'm\b/g,'I am'],[/\bwe're\b/gi,'we are'],[/\bthey're\b/gi,'they are'],[/\byou're\b/gi,'you are'],[/\bwe've\b/gi,'we have'],[/\bI've\b/g,'I have']];
function revise(raw){let t=raw.trim();if(!t)return '';
const basic=[
[/\bIn order to\b/g,'To'],[/\bin order to\b/g,'to'],
[/\b[Dd]ue to the fact that\b/g,m=>m[0]==='D'?'Because':'because'],
[/\bat this point in time\b/gi,'now'],[/\bin the event that\b/gi,'if'],
[/\bhas the ability to\b/gi,'can'],[/\bit is important to note that\s*/gi,''],
[/\bit goes without saying that\s*/gi,''],[/\bneedless to say,?\s*/gi,''],
[/\b[Ss]erves as\b/g,m=>m[0]==='S'?'Is':'is'],[/\b[Ss]tands as\b/g,m=>m[0]==='S'?'Is':'is'],
[/\bboasts\b/gi,'has'],[/\bis home to\b/gi,'has'],[/\bare home to\b/gi,'have'],
[/\bplays? a (crucial|vital|key|pivotal|significant|critical|major) role in\b/gi,'is important for'],
[/\bAdditionally,\s*/g,'Also, '],[/\badditionally\b/gi,'also'],
[/\butilize\b/gi,'use'],[/\butilizes\b/gi,'uses'],[/\bprior to\b/gi,'before'],[/\bcommence\b/gi,'begin'],
[/\bdelves? into\b/gi,m=>m[0]==='d'?'examines':'Examine'],[/\bdelving into\b/gi,'examining'],
[/\bcrucial\b/gi,'essential'],[/\bpivotal\b/gi,'decisive'],[/\bvibrant\b/gi,'lively'],
[/\bunderscores?\b/gi,'shows'],[/\bunderscored\b/gi,'showed'],[/\bshowcases?\b/gi,'shows'],[/\bshowcasing\b/gi,'showing'],
[/\bgarnered?\b/gi,'attracted'],[/\bfostering\b/gi,'encouraging'],[/\bfosters?\b/gi,'encourages'],
[/\benhances?\b/gi,'improves'],[/\bintricate\b/gi,'complex'],[/\binterplay\b/gi,'interaction'],
[/\btapestry\b/gi,'mix'],[/\btestament\b/gi,'sign'],[/\bvaluable\b/gi,'useful'],
[/\brenowned\b/gi,'well-known'],[/\bgroundbreaking\b/gi,'novel'],[/\bbreathtaking\b/gi,''],[/\bstunning\b/gi,''],
[/\bmust-visit\b/gi,''],[/\bnestled\b/gi,'located'],
[/\ba wide range of\b/gi,'many'],[/\ba plethora of\b/gi,'many'],[/\ba wide array of\b/gi,'many'],
[/\bfirst and foremost\b/gi,'first'],[/\beach and every\b/gi,'every'],
[/\bnot only\s+([^,.!?;]+?)\s+but also\s+/gi,'$1 and '],
[/\s*[\u2014\u2013]\s*/g,', '],
[/[\u201C\u201D]/g,'"'],[/[\u2018\u2019]/g,"'"]
];basic.forEach(x=>{t=t.replace(x[0],x[1])});
if(strengthSel.value!=='light'){t=t.replace(/\s*\b(I hope this helps!?|Of course!|Certainly!|Great question!|Let me know if you[^.!?]*[.!?]?)/gi,' ');t=t.replace(/\b(The future looks bright|Exciting times lie ahead)\.?\s*/gi,'');t=t.replace(/\bIn conclusion,\s*/gi,'')}
if(mode==='academic'){expand.forEach(x=>{t=t.replace(x[0],x[1])});t=t.replace(/\bI think\b/g,'The evidence suggests').replace(/\bI believe\b/gi,'The evidence suggests').replace(/\bwe can see that\b/gi,'').replace(/\bvery\s+(important|significant|crucial)\b/gi,'$1').replace(/\bkind of\b/gi,'somewhat')}
if(mode==='blog'){t=t.replace(/\bthe implementation of\b/gi,'using').replace(/\bthe utilization of\b/gi,'using').replace(/\bindividuals\b/gi,'people').replace(/\bdo not\b/gi,"don't").replace(/\bcannot\b/gi,"can't").replace(/\bit is\b/gi,"it's")}
if(strengthSel.value==='deep'){t=t.replace(/\b(actually|really|quite)\s*/gi,'').replace(/\bvery\s+/gi,'')}
t=t.replace(/\s+([,.;!?])/g,'$1').replace(/,\s*,/g,',').replace(/([.!?])\s*,\s*/g,'$1 ').replace(/(^|[.!?]\s+)also\b/g,(m,p)=>p+'Also').replace(/\s{2,}/g,' ').replace(/\n{3,}/g,'\n\n').trim();return t}
const settings={provider:'openrouter',key:'',model:'meta-llama/llama-3.1-70b-instruct',endpoint:''};
try{const saved=JSON.parse(localStorage.getItem('shuvolex.settings')||'null');if(saved)Object.assign(settings,saved)}catch(e){}
function systemPrompt(){const tone=mode==='academic'?'Use a formal academic register. Expand all contractions. State claims directly instead of first-person hedges like I think. Keep citations, technical terms, numbers, and names exactly as given. Neutral and precise.':mode==='blog'?'Use a conversational blog voice. Contractions are welcome. First person is allowed. Keep personality and asides, but remove sales fluff and AI stock phrases.':'Use plain, natural everyday English. Balanced formality. Clear and direct.';
const depth=strengthSel.value==='light'?'Make minimal edits. Fix only obvious AI patterns and keep the original sentences.':strengthSel.value==='deep'?'Rewrite freely for natural human flow. Restructure sentences and merge or split them, but keep every fact.':'Rewrite moderately. Keep the structure but fix phrasing, rhythm, and stock wording.';
return `You are ShuvoLex, an expert human-writing editor. Rewrite the user text so it reads like a person wrote it, without changing what it says.

Hard rules:
- Never invent facts, names, numbers, dates, quotes, or citations. Keep every claim from the source.
- Never use em dashes or en dashes. Use commas, colons, parentheses, or new sentences. Use straight quotes only.
- Remove chatbot artifacts: greetings, offers, closings like I hope this helps.
- Remove sales language, inflated importance claims, vague attributions like experts say, formulaic conclusions, and stock AI words such as delve, crucial, pivotal, underscore, showcase, tapestry, landscape, vibrant, foster, garner, intricate, interplay, additionally, testament.
- Prefer plain verbs: is, has, shows. Avoid serves as, boasts, not only but also, and forced groups of three.
- Replace filler: in order to becomes to, due to the fact that becomes because.
- Vary sentence length naturally. No dramatic fragment runs. No heading repeated as the first sentence.
- End on the last concrete fact, not on generic optimism.
- Return only the rewritten text. No explanations, no preface.

Tone: ${tone}
Depth: ${depth}`}
async function callAI(text){const sys=systemPrompt();
if(settings.provider==='gemini'){const url=`https://generativelanguage.googleapis.com/v1beta/models/${settings.model||'gemini-1.5-flash'}:generateContent?key=${encodeURIComponent(settings.key)}`;
const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:sys}]},contents:[{role:'user',parts:[{text}]}],generationConfig:{temperature:0.7}})});
const data=await res.json();if(!res.ok)throw new Error(data.error&&data.error.message||'Gemini request failed');
return (data.candidates&&data.candidates[0]&&data.candidates[0].content.parts||[]).map(p=>p.text||'').join('').trim()}
const url=settings.provider==='custom'&&settings.endpoint?settings.endpoint:'https://openrouter.ai/api/v1/chat/completions';
const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+settings.key},body:JSON.stringify({model:settings.model,messages:[{role:'system',content:sys},{role:'user',content:text}],temperature:0.7})});
const data=await res.json();if(!res.ok)throw new Error(data.error&&(data.error.message||data.error)||'Request failed');
return (data.choices&&data.choices[0]&&data.choices[0].message.content||'').trim()}
function stat(t){const n=(t.trim().match(/\S+/g)||[]).length;return n+' word'+(n===1?'':'s')+' | '+t.length+' chars'}
function refresh(){$('#inputStats').textContent=stat(input.value);scan(input.value)}
function note(m){toast.textContent=m;toast.classList.add('show');clearTimeout(note.t);note.t=setTimeout(()=>toast.classList.remove('show'),2600)}
function show(r,src){output.textContent=r||'Your humanized text will appear here.';output.classList.toggle('empty',!r);$('#outputStats').textContent=r?stat(r):'Waiting';$('#engineNote').textContent=r?src:'';$('#copyBtn').disabled=$('#downloadBtn').disabled=!r}
function setBusy(b){$('#humanize').disabled=b;$('#humanizeLabel').textContent=b?'Humanizing...':'Humanize'}
async function run(){const text=input.value.trim();if(!text){note('Paste some text first.');return}
if(engine==='ai'){if(!settings.key){openModal();note('Add your API key in settings first.');return}
setBusy(true);try{let r=await callAI(text);r=r.replace(/[\u2014\u2013]/g,',').replace(/\s+([,.;!?])/g,'$1').trim();show(r,'AI rewrite | '+settings.provider);note('Done. Review it before using it.')}catch(err){note('AI request failed: '+err.message)}setBusy(false);return}
show(revise(text),'Local 35-rule engine');note('Revision ready. Review it before using it.')}
function setEngine(e){engine=e;$('#engineLocal').classList.toggle('active',e==='local');$('#engineAI').classList.toggle('active',e==='ai');if(e==='ai'&&!settings.key)openModal()}
$('#engineLocal').addEventListener('click',()=>setEngine('local'));
$('#engineAI').addEventListener('click',()=>setEngine('ai'));
const modal=$('#settingsModal'),status=$('#settingsStatus');
function providerDefaults(p){return p==='gemini'?'gemini-1.5-flash':p==='custom'?'gpt-4o-mini':'meta-llama/llama-3.1-70b-instruct'}
function openModal(){$('#provider').value=settings.provider;$('#apiKey').value=settings.key;$('#model').value=settings.model||providerDefaults(settings.provider);$('#endpoint').value=settings.endpoint;$('#endpointRow').hidden=settings.provider!=='custom';status.textContent='';status.className='modal-status';modal.hidden=false}
function closeModal(){modal.hidden=true}
$('#openSettings').addEventListener('click',openModal);
$('#closeSettings').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
$('#provider').addEventListener('change',e=>{settings.provider=e.target.value;$('#model').value=providerDefaults(settings.provider);$('#endpointRow').hidden=settings.provider!=='custom'});
$('#saveSettings').addEventListener('click',()=>{settings.provider=$('#provider').value;settings.key=$('#apiKey').value.trim();settings.model=$('#model').value.trim();settings.endpoint=$('#endpoint').value.trim();if($('#rememberKey').checked){localStorage.setItem('shuvolex.settings',JSON.stringify(settings))}else{localStorage.removeItem('shuvolex.settings')}closeModal();note(settings.key?'AI mode ready. Press Humanize.':'Settings saved. No key set, local mode stays active.');if(settings.key)setEngine('ai')});
$('#testKey').addEventListener('click',async()=>{settings.provider=$('#provider').value;settings.key=$('#apiKey').value.trim();settings.model=$('#model').value.trim();settings.endpoint=$('#endpoint').value.trim();if(!settings.key){status.textContent='Enter a key first.';status.className='modal-status err';return}status.textContent='Testing...';status.className='modal-status';try{await callAI('Reply with the single word: ok');status.textContent='Connection works.';status.className='modal-status ok'}catch(err){status.textContent='Failed: '+err.message;status.className='modal-status err'}});
document.querySelectorAll('#modes .seg').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('#modes .seg').forEach(x=>x.classList.toggle('active',x===b))}));
input.addEventListener('input',refresh);
$('#humanize').addEventListener('click',run);
$('#sampleBtn').addEventListener('click',()=>{input.value=sample;refresh();run()});
$('#clearBtn').addEventListener('click',()=>{input.value='';show('','');refresh();input.focus()});
$('#pasteBtn').addEventListener('click',async()=>{try{const t=await navigator.clipboard.readText();if(t){input.value=t;refresh();note('Pasted from clipboard.')}else note('Clipboard is empty.')}catch(e){note('Clipboard blocked. Click the field and press Ctrl+V.')}});
$('#copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.textContent);note('Copied to clipboard.')}catch(e){note('Copy failed. Select the text and press Ctrl+C.')}});
$('#downloadBtn').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([output.textContent],{type:'text/plain'}));a.download='shuvolex-humanized.txt';a.click();URL.revokeObjectURL(a.href)});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();run()}if(e.key==='Escape'&&!modal.hidden)closeModal()});
refresh();