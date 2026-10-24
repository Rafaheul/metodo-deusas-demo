'use strict';
// v0.3: cenas com duas escolhas ("faria primeiro" e "menos faria") e afirmações de concordância.
const $=s=>document.querySelector(s);
const views=['home','setup','quiz','reveal','result'];
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const DRAFT_KEY='deusas-draft-v3';
const OPTION_IDS=['a','b','c','d'];
const labels=['Discordo totalmente','Discordo','Nem concordo nem discordo','Concordo','Concordo totalmente'];
let bank=[],version='',config={},answers={},pending=null,index=0,resultId=null,saving=false,busy=false,duel=[],duelMode=false,duelQ=null,retry=null;
let advanceTimer=null,questionEpoch=0,currentResult=null,currentReport=null,activeCapacity=null,navigatingRadiosWithArrows=false;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n===null||n===undefined?'Sem dados':n.toFixed(1).replace('.',',');
const price=n=>typeof n==='number'?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n):'';
const bullets=arr=>arr&&arr.length?`<ul>${arr.map(t=>`<li>${escape(t)}</li>`).join('')}</ul>`:'';
function status(message){$('#status').textContent=message;}
function cancelAdvance(){if(advanceTimer)clearTimeout(advanceTimer);advanceTimer=null;questionEpoch++;if($('#auto-hint'))$('#auto-hint').textContent='';}
async function api(url,options={}){return window.DeusasLocal.call(url,options);}
function view(name){cancelAdvance();for(const v of views)$(`#${v}-view`).hidden=v!==name;document.body.classList.toggle('is-quiz',name==='quiz'||name==='reveal');window.scrollTo({top:0,behavior:'instant'});status('');$('#main').focus({preventScroll:true});}
$('#main').tabIndex=-1;

// ---------- Respostas e rascunho ----------
const validTrait=v=>v===null||(Number.isInteger(v)&&v>=0&&v<=4);
const validDilemma=v=>v&&typeof v==='object'&&((v.first===null&&v.last===null)||(OPTION_IDS.includes(v.first)&&OPTION_IDS.includes(v.last)&&v.first!==v.last));
function validAnswer(q,v){return q.kind==='trait'?validTrait(v):validDilemma(v);}
function readDraft(){
 try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY));if(!d)return null;
 if(d.version!==version||!Number.isFinite(d.savedAt)||Date.now()-d.savedAt>30*86400000){localStorage.removeItem(DRAFT_KEY);return null;}
 const byId=new Map(bank.map(q=>[q.id,q]));
 if(!d.answers||Array.isArray(d.answers)||Object.entries(d.answers).some(([id,v])=>!byId.has(id)||!validAnswer(byId.get(id),v))){localStorage.removeItem(DRAFT_KEY);return null;}
 return d;}catch{return null;}
}
function persist(){if(!saving)return;try{localStorage.setItem(DRAFT_KEY,JSON.stringify({version,answers,index,savedAt:Date.now()}));}catch{status('O navegador não permitiu salvar. Mantenha esta aba aberta para continuar.');}}
function forgetDraft(){try{for(const k of [DRAFT_KEY,'deusas-draft-v2','deusas-draft-v1'])localStorage.removeItem(k);}catch{}}
function beginSetup(){view('setup');const d=readDraft();$('#resume-notice').hidden=!d;$('#resume-notice').textContent=d?`Há ${Object.keys(d.answers).length} respostas salvas neste dispositivo. Marque a opção de salvar para retomar.`:'';$('#save-draft').checked=!!d;}
document.querySelectorAll('.start-trigger').forEach(b=>b.addEventListener('click',()=>startAgain(false)));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();if($('#home-view').contains(target))view('home');target.scrollIntoView({block:'start',behavior:'smooth'});}));
$('.brand').addEventListener('click',e=>{e.preventDefault();view('home');});
$('#back-home').addEventListener('click',()=>view('home'));
// Cena de aquecimento: ensina as duas escolhas. Fica só no navegador e não conta no mapa.
const WARMUP=[['a','Chamo alguém para sair e aproveitar a tarde junto.'],['b','Coloco em dia uma tarefa que estava pendente.'],['c','Fico em casa, no meu canto, sem fazer nada de especial.'],['d','Faço algo só por prazer, como uma comida gostosa ou um passeio bonito.']];
let warm={first:undefined,last:undefined};
function renderWarmup(){
 $('#warmup-options').innerHTML=WARMUP.map(([id,text])=>{const role=id===warm.first?'first':id===warm.last?'last':'';return `<button type="button" class="dilemma-option ${role}" data-warm="${id}" aria-pressed="${!!role}"><span class="option-tag">${role==='first'?'<i>1º</i> Faria primeiro':role==='last'?'<i>✕</i> Menos faria':''}</span><span class="option-text">${escape(text)}</span></button>`;}).join('');
 $('#warmup-coach').innerHTML=!warm.first?'Toque no que você faria <strong>primeiro</strong>.':!warm.last?'Agora, no que você <strong>menos</strong> faria.':'Isso. É assim em todas as cenas. Toque de novo numa reação para trocar.';
 $('#warmup').classList.toggle('done',!!(warm.first&&warm.last));
 $('#warmup-options').querySelectorAll('[data-warm]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.warm;if(warm.first===id)warm={first:undefined,last:undefined};else if(warm.last===id)warm.last=undefined;else if(!warm.first)warm.first=id;else warm.last=id;renderWarmup();}));
}
renderWarmup();
$('#setup-form').addEventListener('submit',e=>{
 e.preventDefault();if(!bank.length){status('As perguntas ainda não carregaram. Aguarde ou recarregue a página.');return;}
 saving=$('#save-draft').checked;const draft=saving?readDraft():null;
 if(draft){answers=draft.answers;index=Number.isInteger(draft.index)?Math.max(0,Math.min(draft.index,bank.length-1)):0;}
 else if(!Object.keys(answers).length){answers={};index=0;}
 if(!saving)forgetDraft();view('quiz');renderQuestion();persist();
});

// ---------- Questionário ----------
// Colunata: 7 colunas que se erguem conforme as respostas; o frontão fecha em 100%.
let lastColumns=0;
function colonnade(count,total){
 const per=total/7,H=44,cols=[...Array(7)].map((_,i)=>{const x=14+i*48,f=Math.max(0,Math.min(1,(count-i*per)/per)),h=Math.round(H*f);return `<g class="col ${f>=1?'done':''}"><rect class="col-shaft" x="${x}" y="22" width="20" height="${H}" rx="1"/><rect class="col-fill" x="${x}" y="${22+H-h}" width="20" height="${h}" rx="1"/><rect class="col-cap" x="${x-3}" y="18" width="26" height="4"/></g>`;}).join('');
 return `<polygon class="pediment ${count>=total?'done':''}" points="6,16 176,2 346,16"/>${cols}<rect class="stylobate" x="4" y="67" width="344" height="5"/>`;
}
const COLUMN_NOTES=['','Primeira coluna de pé. O alicerce do seu mapa está pronto.','Duas colunas. Suas escolhas começam a desenhar um padrão.','Três colunas. Siga no seu ritmo.','Metade do templo. Se precisar, pause: suas respostas ficam aqui.','Cinco colunas. Já dá para ver o contorno do templo.','Falta uma coluna para o seu mapa.','Templo completo. Hora de conhecer quem rege suas escolhas.'];
function updateProgress(){
 const count=Object.keys(answers).length,total=bank.length,columns=Math.floor(count/(total/7)+1e-9);
 const left=Math.max(0,Math.round((total-count)*0.28));
 $('#progress-count').textContent=`Tela ${Math.min(index+1,total)} de ${total}`;$('#progress-percent').textContent=count>=total?'Tudo respondido':`cerca de ${Math.max(1,left)} min`;
 $('#colonnade').innerHTML=colonnade(count,total);$('#progress').setAttribute('aria-valuenow',count);$('#progress').setAttribute('aria-valuetext',`${count} de ${total} respondidas`);
 if(columns>lastColumns&&columns>0){$('#milestone').textContent=COLUMN_NOTES[Math.min(7,columns)];$('#milestone').classList.remove('cheer');void $('#milestone').offsetWidth;$('#milestone').classList.add('cheer');}
 lastColumns=columns;
}
// Ordem das opções embaralhada de forma estável por pergunta, para a posição não sugerir resposta.
function seeded(id){let h=2166136261;for(const c of id)h=Math.imul(h^c.charCodeAt(0),16777619);return ()=>{h=Math.imul(h^(h>>>15),2246822507);h=Math.imul(h^(h>>>13),3266489909);return ((h^=h>>>16)>>>0)/4294967296;};}
function shuffled(q){const rand=seeded(q.id),list=[...q.options];for(let i=list.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
function scheduleAdvance(){
 if(busy)return;if(advanceTimer)clearTimeout(advanceTimer);const epoch=questionEpoch;
 $('#auto-hint').textContent=index===bank.length-1?'Resposta registrada. Preparando seu mapa…':'Resposta registrada. Indo para a próxima…';
 advanceTimer=setTimeout(()=>{advanceTimer=null;if(epoch===questionEpoch&&!$('#quiz-view').hidden)advance();},450);
}
$('#answers').addEventListener('keydown',e=>{navigatingRadiosWithArrows=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key);});
$('#answers').addEventListener('keyup',()=>{navigatingRadiosWithArrows=false;});
$('#answers').addEventListener('pointerdown',()=>{navigatingRadiosWithArrows=false;});
// Faixa colorida da etapa: a área da cena, as afirmações ou o desempate.
function band(kind,text){const b=$('#quiz-eyebrow');b.className=`step-band band-${kind}`;b.textContent=text;}
function milestone(){const columns=Math.floor(Object.keys(answers).length/(bank.length/7)+1e-9);return columns>0?COLUMN_NOTES[Math.min(7,columns)]:'Leia a cena com calma e pense no que você costuma fazer de verdade.';}
function renderQuestion(){
 cancelAdvance();duelMode=false;$('#quiz-view').classList.remove('duel-mode');$('#duel-intro').hidden=true;$('#question-form').hidden=false;navigatingRadiosWithArrows=false;const q=bank[index];const areaId=AREA_IDS[q.area]||'trait';band(q.kind==='dilemma'?areaId:'trait',q.kind==='dilemma'?`${AREA_ICON[areaId]||'✦'} ${q.area}`:'✦ Sobre você');lastColumns=Math.floor(Object.keys(answers).length/(bank.length/7)+1e-9);updateProgress();
 $('#progress').setAttribute('aria-valuemax',bank.length);$('#milestone').classList.remove('cheer');$('#milestone').textContent=milestone();
 $('#position').textContent='';$('#previous').disabled=index===0;
 $('#next').textContent=index===bank.length-1?'Ver meu mapa →':'Continuar →';$('#next').disabled=false;$('#quiz-error').textContent='';
 $('#scene').textContent=q.scene;
 if(q.kind==='dilemma'){
  const saved=answers[q.id];pending=saved?{...saved}:{first:undefined,last:undefined};
  $('#scene-label').textContent=`A SITUAÇÃO · ${q.area.toUpperCase()}`;$('#question-form').dataset.kind='dilemma';
  $('#prompt-action').hidden=true;$('#pick-tracker').hidden=false;renderDilemma(q);
 }else{
  pending=null;$('#scene-label').textContent='SOBRE VOCÊ · RESPOSTA RÁPIDA';$('#question-form').dataset.kind='trait';$('#pick-tracker').hidden=true;
  $('#prompt-action').hidden=true;$('#scene').textContent=q.action;$('#scale-prompt').textContent='O quanto esta frase tem a ver com você?';
  renderTrait(q);
 }
 $('#question-form legend').tabIndex=-1;$('#question-form legend').focus({preventScroll:true});
 $('#quiz-view').scrollIntoView({block:'start',behavior:'instant'});
}
const SCALE_WORDS=['Nada a ver comigo','Pouco a ver','Mais ou menos','Tem a ver','Tudo a ver comigo'];
function renderTrait(q){
 const selected=Object.hasOwn(answers,q.id)?answers[q.id]:undefined;
 $('#answers').className='likert';
 $('#answers').innerHTML=`<div class="likert-row" role="radiogroup" aria-label="De nada a ver comigo até tudo a ver comigo">${labels.map((label,i)=>`<label class="likert-dot d${i}"><input type="radio" name="response" value="${i}" ${selected===i?'checked':''}><span class="dot" aria-hidden="true"></span><span class="sr">${label}</span></label>`).join('')}</div><div class="likert-ends" aria-hidden="true"><span>Nada a ver comigo</span><span>Tudo a ver comigo</span></div><p class="likert-read" id="likert-read">${selected===undefined?'&nbsp;':selected===null?'Prefiro não responder':SCALE_WORDS[selected]}</p><label class="likert-skip"><input type="radio" name="response" value="na" ${selected===null?'checked':''}><span>Prefiro não responder</span></label>`;
 $('#answers').querySelectorAll('input').forEach(input=>{
  // Setas do teclado mudam a escolha sem saltar de pergunta. Clique ou espaço avançam.
  const store=()=>{answers[q.id]=input.value==='na'?null:Number(input.value);$('#likert-read').textContent=input.value==='na'?'Prefiro não responder':SCALE_WORDS[Number(input.value)];persist();updateProgress();};
  input.addEventListener('change',store);
  input.addEventListener('click',()=>{store();if(!navigatingRadiosWithArrows)scheduleAdvance();});
 });
}
function dilemmaStep(){
 if(pending.first===null)return 'Tudo bem. Esta cena fica de fora do seu mapa.';
 if(pending.first===undefined)return '<b>1 de 2</b> · O que você faria <strong>primeiro</strong>?';
 if(pending.last===undefined)return '<b>2 de 2</b> · E qual destas você <strong>menos</strong> faria?';
 return 'Pronto. Toque de novo numa opção para trocar.';
}
function short(text,n=7){const w=text.split(/\s+/);return w.length>n?w.slice(0,n).join(' ')+'…':text;}
function renderTracker(q){
 const t=id=>q.options.find(o=>o.id===id)?.text;
 $('#slot-first').textContent=pending.first?short(t(pending.first)):pending.first===null?'cena pulada':'toque numa reação';
 $('#slot-last').textContent=pending.last?short(t(pending.last)):pending.first===null?'—':'depois, nesta';
 $('#pick-tracker').classList.toggle('on-first',pending.first===undefined);$('#pick-tracker').classList.toggle('on-last',!!pending.first&&pending.last===undefined);$('#pick-tracker').classList.toggle('complete',!!pending.first&&!!pending.last);
}
function renderDilemma(q){
 $('#scale-prompt').innerHTML=dilemmaStep();renderTracker(q);
 $('#answers').className='dilemma-options';
 $('#answers').innerHTML=shuffled(q).map(o=>{const role=o.id===pending.first?'first':o.id===pending.last?'last':'';return `<button type="button" class="dilemma-option ${role}" data-option="${o.id}" aria-pressed="${!!role}"><span class="option-tag">${role==='first'?'<i>1º</i> Faria primeiro':role==='last'?'<i>✕</i> Menos faria':''}</span><span class="option-text">${escape(o.text)}</span></button>`;}).join('')
  +`<button type="button" class="dilemma-skip ${pending.first===null?'active':''}" aria-pressed="${pending.first===null}">Não vivi nada parecido</button>`;
 $('#answers').querySelectorAll('[data-option]').forEach(b=>b.addEventListener('click',()=>pickOption(q,b.dataset.option)));
 $('.dilemma-skip').addEventListener('click',()=>{pending={first:null,last:null};commitDilemma(q);});
}
function pickOption(q,id){
 cancelAdvance();try{if(!calm())navigator.vibrate?.(8);}catch{}
 if(pending.first===id){pending={first:undefined,last:undefined};delete answers[q.id];}
 else if(pending.last===id){pending.last=undefined;delete answers[q.id];}
 else if(pending.first===undefined||pending.first===null){pending={first:id,last:undefined};delete answers[q.id];}
 else pending.last=id;
 if(pending.first&&pending.last)return commitDilemma(q);
 persist();updateProgress();renderDilemma(q);
 // Depois da primeira escolha, o foco vai para as opções restantes.
 const nextFocus=$('#answers').querySelector('.dilemma-option:not(.first):not(.last)');if(nextFocus&&pending.first)nextFocus.focus({preventScroll:true});
}
function commitDilemma(q){answers[q.id]={first:pending.first,last:pending.last};persist();updateProgress();renderDilemma(q);scheduleAdvance();}
$('#previous').addEventListener('click',()=>{cancelAdvance();if(duelMode){duelBack();return;}if(index>0){index--;persist();renderQuestion();}});
$('#pause').addEventListener('click',()=>{cancelAdvance();if(duelMode)exitDuel();persist();view('setup');$('#resume-notice').hidden=false;$('#resume-notice').textContent=saving?'Seu progresso está salvo. Você pode continuar depois.':'As respostas continuam nesta aba. Mantenha a página aberta para continuar.';$('#save-draft').checked=saving;});
$('#question-form').addEventListener('submit',e=>{e.preventDefault();if(retry){const f=retry;retry=null;f();return;}if(duelMode){$('#quiz-error').textContent='Escolha a frase que mais combina com você.';return;}advance();});
function lockQuiz(locked){$('#answers').querySelectorAll('input,button').forEach(i=>i.disabled=locked);}
const payload=()=>bank.map(q=>q.kind==='trait'?{id:q.id,value:answers[q.id]}:{id:q.id,first:answers[q.id].first,last:answers[q.id].last});
async function advance(){
 if(busy)return;cancelAdvance();const q=bank[index];
 if(!Object.hasOwn(answers,q.id)){$('#quiz-error').textContent=q.kind==='dilemma'?(pending?.first?'Agora escolha o que você menos faria.':'Escolha o que você faria primeiro, ou “não vivi nada parecido”.'):'Escolha uma resposta para continuar.';return;}
 if(index<bank.length-1){index++;persist();renderQuestion();return;}
 const missing=bank.findIndex(q=>!Object.hasOwn(answers,q.id));if(missing!==-1){index=missing;renderQuestion();status('Esta situação ainda precisa de uma resposta.');return;}
 duel=[];await stepDuel();
}
// ---------- Desempate da regente ----------
// Quando duas ou três deusas ficam muito perto, o servidor manda perguntas rápidas só com as finalistas.
async function stepDuel(){
 if(busy)return;busy=true;$('#next').disabled=true;$('#previous').disabled=true;$('#next').textContent='Um momento…';lockQuiz(true);
 try{
  const r=await api('/api/tiebreak',{method:'POST',body:JSON.stringify({version,answers:payload(),duel})});
  busy=false;
  if(r.done)return submitAll();
  duelMode=true;duelQ=r.next;if(!duel.length)showDuelIntro(r.finalists);else renderDuel(r.finalists);
 }catch(e){busy=false;retry=stepDuel;$('#quiz-error').textContent=e.message;$('#next').disabled=false;$('#previous').disabled=false;$('#next').textContent='Tentar novamente →';lockQuiz(false);}
}
function showDuelIntro(finalists){
 cancelAdvance();$('#quiz-view').classList.add('duel-mode');band('duel','⚖ Rodada final');$('#question-form').hidden=true;$('#duel-intro').hidden=false;
 $('#duel-third').hidden=finalists!==3;$('#milestone').textContent='Templo completo. Mas há um empate no Olimpo…';
 $('#duel-intro-text').textContent=`Suas respostas deixaram ${finalists===3?'três deusas':'duas deusas'} lado a lado. Mais algumas escolhas rápidas decidem quem rege as suas escolhas.`;
 $('#duel-start').onclick=()=>renderDuel(finalists);$('#duel-start').focus({preventScroll:true});
 $('#quiz-view').scrollIntoView({block:'start',behavior:'instant'});
}
function renderDuel(finalists){
 cancelAdvance();$('#quiz-view').classList.add('duel-mode');band('duel','⚖ Rodada final');$('#duel-intro').hidden=true;$('#question-form').hidden=false;$('#pick-tracker').hidden=true;
 $('#question-form').dataset.kind='duel';$('#prompt-action').hidden=true;$('#quiz-error').textContent='';
 $('#scene-label').innerHTML=`DESEMPATE · ${duelQ.step} DE ATÉ ${duelQ.max} <span class="pips" aria-hidden="true">${[...Array(duelQ.max)].map((_,i)=>`<i class="${i<duelQ.step?'on':''}"></i>`).join('')}</span>`;$('#scene').textContent=duelQ.prompt;
 $('#milestone').textContent=duelQ.step===1?`Suas respostas deixaram ${finalists===3?'três deusas':'duas deusas'} quase empatadas. Mais algumas escolhas rápidas e a regente aparece.`:'Continue: cada escolha tira uma deusa da disputa.';
 $('#scale-prompt').innerHTML='Qual destas é <strong>mais você</strong>?';
 $('#position').textContent=`Desempate ${duelQ.step}`;$('#previous').disabled=false;$('#next').disabled=true;$('#next').textContent='Escolha uma →';
 $('#answers').className='dilemma-options duel-options';
 $('#answers').innerHTML=shuffled(duelQ).map(o=>`<button type="button" class="dilemma-option" data-duel="${o.id}"><span class="option-text">${escape(o.text)}</span></button>`).join(duelQ.options.length===2?'<span class="duel-or" aria-hidden="true">ou</span>':'');
 $('#answers').querySelectorAll('[data-duel]').forEach(b=>b.addEventListener('click',()=>{if(busy)return;b.classList.add('first');duel.push({id:duelQ.id,pick:b.dataset.duel});$('#auto-hint').textContent='Escolha registrada.';setTimeout(stepDuel,300);}));
 $('#question-form legend').tabIndex=-1;$('#question-form legend').focus({preventScroll:true});$('#quiz-view').scrollIntoView({block:'start',behavior:'instant'});
}
function exitDuel(){duelMode=false;duelQ=null;duel=[];$('#quiz-view').classList.remove('duel-mode');$('#duel-intro').hidden=true;$('#question-form').hidden=false;}
function duelBack(){if(busy)return;if(!duel.length){exitDuel();renderQuestion();return;}duel.pop();stepDuel();}
async function submitAll(){
 busy=true;$('#next').disabled=true;$('#previous').disabled=true;$('#next').textContent='Preparando seu mapa…';lockQuiz(true);
 try{
  const r=await api('/api/results',{method:'POST',body:JSON.stringify({version,adult:$('#adult').checked,consent:$('#consent').checked,answers:payload(),duel})});
  resultId=r.id;forgetDraft();exitDuel();renderResult(r.result,r.report);revealResult();
 }catch(e){$('#quiz-error').textContent=e.message;$('#next').disabled=false;$('#previous').disabled=false;$('#next').textContent='Tentar novamente →';lockQuiz(false);retry=submitAll;}finally{busy=false;}
}

// ---------- Gráfico polar ----------
function radar(points,kind,selected,interactive=true){
 const cx=210,cy=180,radius=103,n=points.length;
 const at=(i,r)=>{const angle=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(angle)*r,cy+Math.sin(angle)*r];};
 const coords=r=>points.map((_,i)=>at(i,r).map(x=>x.toFixed(2)).join(',')).join(' ');
 const values=points.map((p,i)=>p.value===null?null:at(i,p.value/4*radius));
 const filled=values.map((v,i)=>v||at(i,0));
 const polygon=values.some(Boolean)?`<polygon class="radar-area" points="${filled.map(p=>p.map(x=>x.toFixed(2)).join(',')).join(' ')}"/>`:'';
 const rings=[1,2,3,4].map(level=>`<polygon class="radar-ring" points="${coords(radius*level/4)}"/>`).join('');
 const axes=points.map((p,i)=>{const [x,y]=at(i,radius),[lx,ly]=at(i,128);const anchor=Math.abs(lx-cx)<8?'middle':lx>cx?'start':'end';return `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><text class="radar-label ${p.id===selected?'active':''}" x="${lx}" y="${ly+5}" text-anchor="${anchor}">${escape(p.name)}</text>`;}).join('');
 const dots=points.map((p,i)=>{const value=values[i];if(!value)return '';const attrs=interactive?`data-chart="${kind}" data-point="${escape(p.id)}" role="button" tabindex="0" aria-label="${escape(p.name)}"`:'';return `<g class="radar-node ${p.id===selected?'active':''} ${p.state?`state-${p.state}`:''}" ${attrs}><circle cx="${value[0]}" cy="${value[1]}" r="18" fill="transparent"/><circle class="radar-point" cx="${value[0]}" cy="${value[1]}" r="5"/></g>`;}).join('');
 return `<svg class="radar-svg" viewBox="0 0 420 360" role="${interactive?'group':'img'}" aria-label="Gráfico polar">${rings}${axes}${polygon}${dots}</svg>`;
}
function bindRadar(container,choose){container.querySelectorAll('[data-point]').forEach(p=>{p.addEventListener('click',()=>choose(p.dataset.point));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(p.dataset.point);}});});}

// ---------- Resultado v0.4 ----------
// Ordem do resultado: regente (carta), caminho até ela, as sete deusas, e depois
// a prévia bloqueada (grátis) ou o relatório completo (pago). Sem estilos inline (CSP).
const IDS7=['artemis','atena','hestia','hera','demeter','persefone','afrodite'];
const BODY_W={artemis:332,atena:280,hestia:320,hera:288,demeter:307,persefone:309,afrodite:355};
const bust=(id,cls='')=>`<img class="bust ${cls}" src="assets/deusas/${id}-busto.webp" alt="" width="320" height="320" loading="lazy" decoding="async">`;
const figure=(id,cls='')=>`<img class="figure ${cls}" src="assets/deusas/${id}-corpo.webp" alt="" width="${BODY_W[id]}" height="720" decoding="async">`;
const AREA_ICON={trabalho:'⚒',dinheiro:'◎',amor:'♡',familia:'⌂',amizades:'✶',pessoal:'☾',mudancas:'↻'};
const AREA_IDS={'Trabalho':'trabalho','Dinheiro':'dinheiro','Relação amorosa':'amor','Família':'familia','Amizades e grupos':'amizades','Tempo pessoal e corpo':'pessoal','Mudanças e decisões':'mudancas'};
const AREA_ASK={trabalho:'o seu trabalho',dinheiro:'o seu dinheiro',amor:'a sua relação amorosa',familia:'a sua família',amizades:'as suas amizades',pessoal:'o seu tempo e o seu corpo',mudancas:'as suas grandes decisões'};
const ROMAN=['I','II','III','IV','V','VI','VII'];
const STATE_ICON={luz:'☀',excesso:'▲',escassez:'▽',insuficiente:'·'};
const STATE_TAG={luz:'Na luz',excesso:'Sombra por excesso',escassez:'Sombra por escassez',insuficiente:'Poucos dados'};
const LOCK='<svg class="lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
let sevenMode='ranking',openArea=null,revealActs=[],revealAt=0,pageObservers=[],openMods=new Set();
const isRegent=id=>!!currentResult?.regents.some(r=>r.id===id);
const plural=(n,one,many)=>`${n} ${n===1?one:many}`;
// Ordem das sete em todo o mapa: a regente primeiro (ela pode ter vencido no desempate), depois pela força.
const byForce=list=>[...list].sort((a,b)=>isRegent(b.id)-isRegent(a.id)||(b.value??-1)-(a.value??-1));
const listJoin=list=>list.length>1?`${list.slice(0,-1).join(', ')} e ${list.at(-1)}`:list.join('');
function capacityPoints(){
 const r=currentResult,rep=currentReport;
 return r.capacities.map(c=>{const s=rep?.capacities.find(x=>x.id===c.id);return {...c,state:s?.state,stateName:s?.stateName,stateText:s?.text};});
}
function renderResult(result,report){
 currentResult=result;currentReport=report||null;openArea=null;
 const ranked=[...result.capacities].sort((a,b)=>(b.value??-1)-(a.value??-1));
 activeCapacity=result.regents[0]?.id||ranked[0].id;
 openMods=new Set();
 // O essencial fica aberto no topo (regente e as três respostas); o resto vem em blocos que abrem com um toque.
 $('#result-content').innerHTML=`<div class="result-masthead"><div class="eyebrow">MÉTODO DAS DEUSAS / SEU MAPA</div><div class="masthead-side"><span class="badge">${report?'Relatório completo':'Mapa inicial gratuito'}</span>${pdfButton()}</div></div>
 <p class="print-only print-head">Método das Deusas · Yasnnajára Alves · ${report?'Relatório completo':'Mapa inicial gratuito'} · ${new Date().toLocaleDateString('pt-BR')}</p>
 ${heroHtml()}
 ${result.flags.length?`<div class="notice">${result.flags.map(escape).join('<br>')}</div>`:''}
 ${glanceHtml()}
 <div id="report-zone"><section class="mods" aria-labelledby="mods-title"><div class="mods-top"><div><div class="eyebrow">PARA IR MAIS FUNDO</div><h2 id="mods-title">Toque numa parte<br>para <em>entender melhor.</em></h2></div><p class="mod-count" id="mod-count" aria-live="polite"></p></div>${resultMods().map(modHtml).join('')}</section>${report?`${missionHtml(report)}<p class="result-note">${escape(report.note)}</p>`:''}</div>
 ${report?'':'<p class="print-only print-free">Este é o mapa inicial gratuito. O relatório completo, com quem rege cada área da sua vida, luz e sombra das sete deusas e a missão da semana, fica no site do Método das Deusas.</p>'}
 ${videoHtml()}
 ${nextStepHtml()}
 ${shelfHtml()}
 <details class="reading-note"><summary>Como este mapa foi feito</summary><p>${escape(result.methodology)}</p><p>Nas cenas, você escolheu o que faria primeiro e o que menos faria. Nas afirmações, disse o quanto cada uma combina com você. As duas partes se juntam na mesma leitura. Quando duas deusas terminam as cenas quase empatadas, algumas perguntas rápidas de desempate mostram qual delas pesa mais hoje.</p></details>
 ${!report&&offerReady()?`<div class="offer-bar" id="offer-bar" hidden><span>Veja quem rege cada área da sua vida</span><button class="primary" type="button" id="offer-bar-go">Ver o relatório</button></div>`:''}`;
 renderSeven();bindResult();updateModCount();
}

// ---------- Topo do mapa: as três respostas ----------
// Ao lado dela (na luz, no relatório; as mais presentes, no grátis), quem pede cuidado e as sete numa linha.
function glanceHtml(){
 const r=currentResult,rep=currentReport;
 const byValue=byForce(r.capacities);
 const allies=rep?rep.capacities.filter(c=>rep.allies.includes(c.name)):byValue.filter(c=>c.value!==null&&!isRegent(c.id)).slice(0,2);
 const care=careList();
 const cap=id=>r.capacities.find(c=>c.id===id)?.capacity||'';
 const god=c=>`<span class="g-god">${bust(c.id)}<span><strong>${escape(c.name)}</strong><small>${escape(cap(c.id))}</small></span></span>`;
 const careItem=c=>`<div class="g-care-item">${bust(c.id)}<div><strong>${escape(c.name)}</strong><span class="state-tag state-${c.state}">${STATE_ICON[c.state]} ${STATE_TAG[c.state]}</span><p>${escape(c.text)}</p>${ebookLink(c.id)}</div></div>`;
 const noCare=rep?'Nenhuma deusa apareceu na sombra nas suas respostas.':'Nenhuma deusa apareceu com pouco espaço no mapa inicial. O relatório completo mostra se alguma passa do ponto.';
 return `<section class="glance" aria-label="Seu mapa em resumo">
  <article class="glance-card g-allies"><div class="eyebrow">${rep?'NA LUZ AO LADO DELA':'TAMBÉM APARECEM MUITO'}</div>${allies.length?`<div class="g-row">${allies.map(god).join('')}</div>`:'<p class="g-none">Nenhuma outra deusa apareceu na luz ao lado dela.</p>'}</article>
  <article class="glance-card g-care"><div class="eyebrow">PEDE CUIDADO</div>${care.length?care.map(careItem).join(''):`<p class="g-none">${noCare}</p>`}</article>
  <div class="glance-seven"><div class="g-seven-top"><h3 class="g-seven-title">As sete <em>em você</em></h3><span class="g-hint"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4.2 15a1.6 1.6 0 0 1 2.4-2.1L9 15"/></svg>Toque numa para ver</span></div><ol>${byValue.map(c=>`<li><button type="button" class="g-seven ${isRegent(c.id)?'regent':''}" data-glance="${c.id}" aria-label="${escape(`${c.name}: ${c.level}`)}">${bust(c.id)}<strong>${escape(c.name)}</strong><span class="g-bar" aria-hidden="true"><i data-w="${c.value===null?0:Math.round(c.value/4*100)}"></i></span><small>${escape(c.level)}</small></button></li>`).join('')}</ol></div>
 </section>`;
}

// Quem pede cuidado nesta versão do mapa. No grátis: a deusa da escassez; sem ela, a do e-book indicado
// (a do excesso, que a oferta do e-book já nomeia). No relatório: todas as do excesso e da escassez.
function careList(){
 const r=currentResult,rep=currentReport;
 if(rep)return [...rep.excess.map(e=>({...e,state:'excesso'})),...rep.scarcity.map(s=>({...s,state:'escassez'}))];
 if(r.shadowHint)return [{...r.shadowHint,state:'escassez',text:'Apareceu com pouco espaço nas suas escolhas. Sombra não é defeito: é uma capacidade pedindo ajuste.'}];
 if(r.ebook)return [{id:r.ebook.id,name:r.ebook.name,state:'excesso',text:'Apareceu demais nas suas escolhas. Sombra não é defeito: é uma capacidade pedindo ajuste.'}];
 return [];
}

// ---------- E-books ----------
// Cada e-book trata as duas sombras de uma deusa. Com o link de compra configurado, o botão leva ao checkout;
// sem ele, abre a prévia da proposta e avisa que está em preparação.
const bookTitle=id=>config.ebooks?.[id]?.title||'';
function bookFor(id){
 const c=currentResult.capacities.find(x=>x.id===id),pick=currentResult.ebook?.id===id?currentResult.ebook:null;
 return {id,name:c.name,title:bookTitle(id)?`${c.name}: ${bookTitle(id)}`:`E-book de ${c.name}`,excerpt:c.description,practice:pick?.practice||'',shadow:pick?.shadow};
}
function ebookLink(id,cls='g-ebook'){
 const offer=config.ebooks?.[id]||{},name=currentResult.capacities.find(x=>x.id===id).name,icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 6c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/></svg>';
 if(offer.checkoutUrl)return `<a class="${cls}" href="${escape(offer.checkoutUrl)}" target="_blank" rel="noopener noreferrer">${icon}Comprar o e-book de ${escape(name)}${offer.priceBRL?` · ${price(offer.priceBRL)}`:''} <span aria-hidden="true">↗</span></a>`;
 return `<button type="button" class="${cls}" data-book="${id}">${icon}E-book de ${escape(name)} · em breve <span aria-hidden="true">→</span></button>`;
}
function shelfHtml(){
 const indicated=new Set(careList().map(c=>c.id));
 const order=[...IDS7].sort((a,b)=>indicated.has(b)-indicated.has(a));
 return `<section class="ebook-shelf" id="ebooks"><div class="eyebrow">OS E-BOOKS DO MÉTODO</div><h2>Um e-book para <em>cada deusa.</em></h2><p class="lead-small">Cada e-book fala das duas sombras de uma deusa, a por escassez e a por excesso, e traz práticas para a semana. Se outra deusa chamou a sua atenção, ela também está aqui.</p><ul class="shelf">${order.map(id=>{const c=currentResult.capacities.find(x=>x.id===id);return `<li class="shelf-item ${indicated.has(id)?'pick':''}">${bust(id)}<div class="shelf-copy">${indicated.has(id)?'<span class="shelf-tag">Indicado para você</span>':''}<strong>${escape(c.name)}</strong><small>${escape(bookTitle(id)||c.capacity)}</small></div>${ebookLink(id,'shelf-btn')}</li>`;}).join('')}</ul></section>`;
}

// ---------- PDF ----------
// O PDF sai pela impressão do navegador ("Salvar como PDF") e leva só o que esta versão mostra:
// o mapa grátis não carrega nada do relatório pago, e o pago sai com todas as partes e todas as áreas abertas.
function pdfButton(){
 return `<button type="button" class="pdf-btn" data-pdf><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>${currentReport?'Baixar o relatório em PDF':'Baixar meu mapa em PDF'}</button>`;
}
function exportPdf(){
 const old=document.title,regs=currentResult.regents.map(g=>g.name).join(' e ');
 document.title=`${currentReport?'Relatório':'Mapa'} das Deusas${regs?` - ${regs}`:''}`;
 const back=()=>{document.title=old;window.removeEventListener('afterprint',back);};
 document.querySelectorAll('.reading-note').forEach(d=>{d.open=true;});
 window.addEventListener('afterprint',back);window.print();
}

// ---------- Blocos que abrem ----------
function resultMods(){
 const r=currentResult,rep=currentReport,p=r.path,mods=[];
 const ranked=byForce(r.capacities.filter(c=>c.value!==null));
 if(p&&p.method!=='insuficiente')mods.push({id:'caminho',mark:'★',title:'Como chegamos à sua regente',teaser:p.story,body:pathHtml()});
 mods.push({id:'sete',mark:'✦',title:'As sete deusas em você',teaser:ranked.length?`Mais presente: ${ranked[0].name}. Menos presente: ${ranked.at(-1).name}.`:'Quanto cada deusa apareceu nas suas escolhas.',body:sevenHtml()});
 if(!rep){mods.push({id:'relatorio',mark:'◈',title:'Seu relatório completo',teaser:lockedLead().sub,body:lockedHtml()});return mods;}
 const names=list=>listJoin(list.map(x=>x.name))||'nenhuma',d=rep.dependency;
 mods.push({id:'luz',mark:'I',title:'Luz e sombra',teaser:`Na luz: ${rep.capacities.filter(c=>c.scale===1).length}. Na sombra por escassez: ${names(rep.scarcity)}. Na sombra por excesso: ${names(rep.excess)}.`,body:balanceHtml(rep)});
 mods.push({id:'areas',mark:'II',title:'As áreas da sua vida',teaser:rep.areasSummary||'Quem rege, quem ajuda e quem pesa em cada área.',body:areasHtml(rep)});
 mods.push({id:'cuidar',mark:'III',title:'Cuidar é escolha, não dívida',teaser:`Cuidar por obrigação: ${d.levelName.toLowerCase()}.`,body:dependencyHtml(d)});
 mods.push({id:'jeito',mark:'IV',title:'Seu jeito de funcionar',teaser:`${rep.style.length} réguas do seu temperamento, vindas das afirmações.`,body:styleHtml(rep)});
 mods.push({id:'favor',mark:'V',title:'A seu favor e pede cuidado',teaser:`A seu favor: ${rep.favor.length}. Pede cuidado: ${rep.care.length}.`,body:favorHtml(rep)});
 return mods;
}
function modHtml(m){
 return `<section class="mod" id="mod-${m.id}" data-mod="${m.id}"><h3 class="mod-h"><button type="button" class="mod-head" aria-expanded="false" aria-controls="mod-${m.id}-body"><span class="mod-mark ${/^[IVX]+$/.test(m.mark)?'':'sym'}" aria-hidden="true">${m.mark}</span><span class="mod-title">${escape(m.title)}</span><span class="mod-teaser">${escape(m.teaser)}</span><span class="mod-more"><span class="mod-more-text">Entender melhor</span><svg class="mod-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span></button></h3><div class="mod-body" id="mod-${m.id}-body"><div class="mod-inner">${m.body}</div></div></section>`;
}
function setMod(mod,open){
 if(!mod||mod.classList.contains('open')===open)return;
 mod.classList.toggle('open',open);mod.querySelector('.mod-head').setAttribute('aria-expanded',open);
 mod.querySelector('.mod-more-text').textContent=open?'Fechar':'Entender melhor';
 if(open){openMods.add(mod.dataset.mod);if(!calm()){mod.classList.remove('m-opening');void mod.offsetWidth;mod.classList.add('m-opening');}}
 updateModCount();
}
function openMod(id){const mod=$(`#mod-${id}`);setMod(mod,true);return mod;}
function updateModCount(){
 const el=$('#mod-count');if(!el)return;const total=document.querySelectorAll('.mod').length,n=openMods.size;
 el.textContent=n?`Você abriu ${n} de ${total} partes.`:`${total} partes para explorar, no seu ritmo.`;
 if(n&&!calm()){el.classList.remove('m-bump');void el.offsetWidth;el.classList.add('m-bump');}
}

// Carta da regente: frente na luz, verso com o excesso e quem equilibra.
function flipCard(g){
 return `<div class="flip" data-flip><div class="flip-inner"><div class="flip-face front"><div class="eyebrow">${escape(g.symbol)} ${escape(g.name.toUpperCase())} NA LUZ</div><p class="flip-gift">${escape(g.card.gift)}</p><p class="flip-question">${escape(g.card.question)}</p></div><div class="flip-face back" hidden><div class="eyebrow">QUANDO PASSA DO PONTO</div><p>${escape(g.card.excess)}</p><div class="eyebrow">QUEM EQUILIBRA</div><p class="balance-line">${escape(listJoin(g.card.balance))}, pela Regra do Eixo Oposto.</p></div></div><button class="flip-turn" type="button" aria-expanded="false">Virar a carta <span aria-hidden="true">↻</span></button></div>`;
}
function heroHtml(){
 const r=currentResult,regs=r.regents,p=r.path;
 const art=regs.length?`<div class="hero-arch ${regs.length>1?'duo':''}" aria-hidden="true">${regs.map(g=>figure(g.id)).join('')}<span class="arch-star">★</span></div>`:`<div class="hero-arch none" aria-hidden="true"><div class="bust-ring">${IDS7.map(id=>bust(id)).join('')}</div></div>`;
 const label=regs.length>1?'QUEM REGE SUAS ESCOLHAS HOJE · REGÊNCIA DIVIDIDA':regs.length?'QUEM REGE SUAS ESCOLHAS HOJE':'UMA LEITURA DE CONJUNTO';
 const title=regs.length?regs.map(g=>escape(g.name)).join('<i> e </i>'):'Seu mapa tem<br>mais de uma voz.';
 return `<section class="regent-hero">${art}<div class="regent-copy"><p class="regent-label">${label}</p><h1>${title}</h1>${regs.length===1?`<p class="capacity-title">${escape(regs[0].capacity)}</p>`:''}${p?.badge&&p.method!=='insuficiente'?`<span class="method-badge method-${p.method}">${escape(p.badge)}</span>`:''}<p class="definition">${escape(r.definition)}</p>${regs.length?regs.map(flipCard).join(''):`<p class="lead">${escape(r.summary)}</p>`}${regs.length===1?'<button class="secondary share-trigger" type="button">Compartilhar minha deusa <span aria-hidden="true">↗</span></button>':''}</div></section>`;
}

// Caminho até a regente, no estilo Akinator: 7 → finalistas → desempate → regente.
function pathHtml(){
 const p=currentResult.path;if(!p||p.method==='insuficiente')return '';
 const fin=new Set(p.finalists.map(f=>f.id)),regs=currentResult.regents;
 const mini=(id,nm,cls='')=>`<span class="mini ${cls}">${bust(id)}<small>${escape(nm)}</small></span>`;
 const steps=[`<li class="step"><span class="step-n">1</span><div class="step-body"><strong>As 7 deusas entraram nas suas cenas.</strong><div class="step-row">${p.ranking.map(r=>mini(r.id,r.name,fin.has(r.id)?'in':'out')).join('')}</div></div></li>`];
 if(p.method==='direto')steps.push(`<li class="step"><span class="step-n">2</span><div class="step-body"><strong>${escape(p.finalists[0].name)} ficou à frente com folga.</strong><small>As outras seis ficaram atrás, somando o que você faria primeiro e descontando o que menos faria.</small></div></li>`);
 else steps.push(`<li class="step"><span class="step-n">2</span><div class="step-body"><strong>${p.finalists.length===2?'Duas':'Três'} terminaram as cenas quase empatadas.</strong><div class="step-row">${p.finalists.map(f=>mini(f.id,f.name,'in')).join('<b class="vs">×</b>')}</div></div></li>`);
 if(p.steps)steps.push(`<li class="step"><span class="step-n">3</span><div class="step-body"><strong>Desempate: ${plural(p.steps,'pergunta rápida','perguntas rápidas')}.</strong><div class="score">${p.finalists.map(f=>`<span class="${regs.some(g=>g.id===f.id)?'win':''}">${escape(f.name)} <b>${f.wins??0}</b></span>`).join('<i>×</i>')}</div></div></li>`);
 steps.push(`<li class="step final"><span class="step-n">★</span><div class="step-body"><strong>${regs.length>1?'Duas regentes, lado a lado.':'Sua regente.'}</strong><div class="step-row">${regs.map(g=>mini(g.id,g.name,'in crown')).join('')}</div></div></li>`);
 return `<section class="path-section" id="caminho"><div class="eyebrow">COMO CHEGAMOS À SUA REGENTE</div><h2>Uma eliminação,<br>escolha por <em>escolha.</em></h2><ol class="funnel">${steps.join('')}</ol><p class="path-story">${escape(p.story)}</p>${p.axis?`<p class="subtle axis-line">Eixo da sua regente: <strong>${escape(p.axis.name)}</strong>. ${escape(p.axis.text)}</p>`:''}</section>`;
}

// As sete deusas: ranking (padrão) ou mandala, com legenda e painel de detalhe.
function legendHtml(){
 return `<ul class="legend" aria-label="Legenda"><li><b class="lg-regent">★</b> Regente</li><li><b class="state-luz">☀</b> Na luz</li><li><b class="state-excesso">▲</b> Sombra por excesso</li><li><b class="state-escassez">▽</b> Sombra por escassez</li></ul><p class="legend-note">Sombra não é defeito: é uma capacidade pedindo ajuste.${currentReport?'':' No relatório completo, cada deusa recebe o seu sinal.'}</p>`;
}
function sevenHtml(){
 return `<section class="seven-section" id="sete-deusas"><div class="section-top"><div><div class="eyebrow">AS SETE DEUSAS EM VOCÊ</div><h2>Quem aparece mais<br>nas suas <em>escolhas.</em></h2></div><div class="seg" role="group" aria-label="Forma de ver"><button type="button" class="seg-btn" data-seven="ranking">Ranking</button><button type="button" class="seg-btn" data-seven="mandala">Mandala</button></div></div>${legendHtml()}<div class="seven-layout"><div id="seven-view" class="seven-view"></div><div class="capacity-detail" id="capacity-detail" aria-live="polite"></div></div></section>`;
}
function renderSeven(){
 const points=capacityPoints(),g=points.find(c=>c.id===activeCapacity)||points[0];
 document.querySelectorAll('[data-seven]').forEach(b=>{const on=b.dataset.seven===sevenMode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);});
 const box=$('#seven-view');
 if(sevenMode==='mandala'){box.innerHTML=`<div class="radar-frame">${radar(points,'capacity',g.id)}</div>`;bindRadar(box,id=>selectCapacity(id));}
 else{
  const ranked=byForce(points);
  box.innerHTML=`<ol class="rank-list">${ranked.map(c=>`<li><button type="button" class="rank-row ${c.id===g.id?'active':''} ${isRegent(c.id)?'regent':''}" data-capacity="${c.id}" aria-pressed="${c.id===g.id}">${bust(c.id)}<span class="rank-name"><strong>${isRegent(c.id)?'<b class="lg-regent" aria-label="Regente">★</b> ':''}${escape(c.name)}</strong><small>${escape(c.capacity)}${isRegent(c.id)&&currentResult.path?.method==='desempate'?' · venceu o desempate':''}${c.nearRegent?' · empatou no topo':''}</small></span><span class="rank-bar" aria-hidden="true"><i data-w="${c.value===null?0:Math.round(c.value/4*100)}"></i></span><span class="rank-level">${c.state?`<b class="state-${c.state}" title="${escape(STATE_TAG[c.state])}" aria-label="${escape(STATE_TAG[c.state])}">${STATE_ICON[c.state]}</b> `:''}${escape(c.level)}</span></button></li>`).join('')}</ol>`;
  box.querySelectorAll('[data-capacity]').forEach(b=>b.addEventListener('click',()=>selectCapacity(b.dataset.capacity,true)));
  box.querySelectorAll('[data-w]').forEach(i=>{i.style.width=`${i.dataset.w}%`;});
 }
 $('#capacity-detail').innerHTML=`<div class="detail-head">${bust(g.id)}<div><div class="eyebrow">VOCÊ ESTÁ OLHANDO PARA</div><h3>${escape(g.name)}</h3><p class="capacity-title">${escape(g.capacity)}</p></div></div>${g.state?`<span class="state-tag state-${g.state}">${STATE_ICON[g.state]} ${escape(g.stateName)}</span><p>${escape(g.stateText)}</p>`:`<p>${escape(g.description)}</p>`}<p class="detail-reflection">${escape(g.reflection)}</p>`;
}
function selectCapacity(id,focusButton=false){activeCapacity=id;renderSeven();if(focusButton)$(`#seven-view [data-capacity="${id}"]`)?.focus({preventScroll:true});}

// Papéis de uma área: quem rege, quem ajuda e quem pesa (ou o que falta).
function areaRoles(a){
 const role=(cls,label,item)=>item?`<div class="role ${cls}">${bust(item.id)}<div><span class="eyebrow">${label}</span><strong>${escape(item.name)}</strong><p>${escape(item.text)}</p></div></div>`:'';
 return `${role('lead','REGE',a.leads)}${role('help',a.helps?.source==='geral'?'AJUDA · VEM DO SEU CONJUNTO':'AJUDA',a.helps)}${a.hinders?role('hinder','ATRAPALHA QUANDO PASSA DO PONTO',a.hinders):`<div class="role calm"><span class="calm-mark" aria-hidden="true">✓</span><div><span class="eyebrow">ATRAPALHA</span><p>Nenhuma deusa em excesso aqui. Bom sinal.</p></div></div>${role('lack','PEDE MAIS ESPAÇO',a.lacks)}`}`;
}
const confHtml=a=>a.confidence?`<p class="conf conf-${a.confidence.kind}">${escape(a.confidence.label)}</p>`:'';
function sampleHtml(a){
 return `<article class="sample-area"><div class="sample-badge">AMOSTRA GRÁTIS · 1 DE ${currentResult.toc.areas} ÁREAS</div><div class="area-head"><span class="tile-icon" aria-hidden="true">${AREA_ICON[a.id]||'✦'}</span><div><h3>${escape(a.name)}</h3>${confHtml(a)}</div></div><div class="roles">${areaRoles(a)}</div></article>`;
}
function offerReady(){const r=config.report||{};return !!(r.checkoutUrl||config.demoMode);}
function priceHtml(){const p=config.report?.priceBRL;return typeof p==='number'&&config.report?.checkoutUrl?`<div class="price"><strong>${price(p)}</strong><small>Pagamento único. Você tem 7 dias para desistir, pelo Código de Defesa do Consumidor.</small></div>`:'';}
function reportCta(){
 const r=config.report||{};
 if(r.checkoutUrl)return `<a class="primary" href="${escape(r.checkoutUrl)}" target="_blank" rel="noopener noreferrer">Ver minha deusa em cada área ↗</a>`;
 if(config.demoMode)return `<button class="primary" id="unlock-demo" type="button">Ver minha deusa em cada área →</button><p class="subtle">Demonstração local: o relatório abre sem pagamento. Na versão publicada, este botão leva ao pagamento.</p>`;
 return `<button class="primary" disabled>Relatório completo · em breve</button><p class="subtle">A venda do relatório será aberta depois da aprovação da autora.</p>`;
}
function lockedLead(){
 const r=currentResult,regs=r.regents,lead=regs.map(g=>escape(g.name)).join(' e '),n=r.othersRule,total=r.toc.areas;
 if(!regs.length)return {head:'Cada área da vida<br>tem a sua <em>regente.</em>',sub:'No relatório completo, veja quem comanda cada área, quem ajuda e quem pesa.'};
 if(n>0)return {head:`${lead} ${regs.length>1?'regem':'rege'} suas escolhas.<br>Mas não <em>todas as áreas.</em>`,sub:`Em ${n} das ${total} áreas da sua vida, outra deusa assume o comando.`};
 return {head:`${lead} ${regs.length>1?'aparecem':'aparece'} à frente<br>em <em>todas as áreas.</em>`,sub:'Mas com aliadas e pesos diferentes em cada uma.'};
}
function lockedHtml(){
 const r=currentResult,{head,sub}=lockedLead();
 const shadows=r.toc.shadows;
 const toc=[['Luz e sombra das 7 deusas',shadows?`${plural(shadows,'sinal','sinais')} de sombra para olhar com calma`:'quem está na medida e quem pede ajuste'],['As 7 áreas da sua vida','quem rege, quem ajuda e quem pesa em cada uma'],['Cuidar é escolha, não dívida','como você cuida, cede e se coloca nas relações'],['Seu jeito de funcionar','5 réguas do seu temperamento'],['A seu favor e pede cuidado','seus apoios, suas armadilhas e onde você floresce'],['Sua missão da semana','uma prática pela Regra do Eixo Oposto']];
 return `<section class="locked-report" id="locked-report"><div class="eyebrow">SEU RELATÓRIO COMPLETO</div><h2>${head}</h2><p class="lead-small">${escape(sub)}</p>${r.sampleArea?sampleHtml(r.sampleArea):''}<ul class="sealed-grid">${r.lockedAreas.map(a=>`<li class="sealed"><span class="tile-icon" aria-hidden="true">${AREA_ICON[a.id]||'✦'}</span><strong>Quem rege ${escape(AREA_ASK[a.id]||a.name)}?</strong>${LOCK}</li>`).join('')}</ul><div class="toc"><div class="eyebrow">O QUE TEM NO RELATÓRIO</div><ol>${toc.map(([t,s],i)=>`<li><span class="roman" aria-hidden="true">${ROMAN[i]}</span><div><strong>${t}</strong><small>${escape(s)}</small></div></li>`).join('')}</ol></div><div class="offer" id="offer">${priceHtml()}${reportCta()}</div></section>`;
}

// ---------- Relatório completo ----------
// Cada parte vira um bloco em resultMods(); o resumo do topo fica em glanceHtml().
function balanceHtml(rep){
 const medal=c=>`<span class="medal state-${c.state} ${isRegent(c.id)?'regent':''}">${bust(c.id)}<small>${escape(c.name)}</small></span>`;
 const pan=(k,label,sub)=>{const list=rep.capacities.filter(c=>c.scale===k);return `<div class="pan pan-${k}"><span class="pan-label">${label}<small>${sub}</small></span><div class="pan-medals">${list.length?list.map(medal).join(''):'<span class="pan-empty">nenhuma</span>'}</div></div>`;};
 const few=rep.capacities.filter(c=>c.scale===null);
 const cards=[...rep.excess.map(e=>`<article class="shadow-card excess">${bust(e.id)}<div><span class="state-tag state-excesso">▲ Sombra por excesso</span><h3>${escape(e.name)}</h3><p>${escape(e.text)}</p><div class="balance-pair"><span class="eyebrow">QUEM EQUILIBRA</span><div>${e.balance.map(b=>`<span class="pair">${bust(b.id)}${escape(b.name)}</span>`).join('')}</div></div>${ebookLink(e.id)}</div></article>`),...rep.scarcity.map(s=>`<article class="shadow-card scarcity">${bust(s.id)}<div><span class="state-tag state-escassez">▽ Sombra por escassez</span><h3>${escape(s.name)}</h3><p>${escape(s.text)}</p>${ebookLink(s.id)}</div></article>`)].join('');
 return `<section class="report-section" id="r-luz"><div class="eyebrow">I · LUZ E SOMBRA</div><h2>O que está na medida,<br>o que falta e o que <em>sobra.</em></h2><div class="balance"><div class="beam" aria-hidden="true"><i></i></div><div class="pans">${pan(0,'Na sombra','por escassez')}${pan(1,'Na luz','na medida')}${pan(2,'Na sombra','por excesso')}</div>${few.length?`<p class="subtle">Poucos dados para: ${escape(few.map(c=>c.name).join(', '))}.</p>`:''}</div>${rep.allies.length?`<p class="lead-small">Na luz, ao lado da sua regente: <strong>${escape(listJoin(rep.allies))}</strong>.</p>`:''}${cards?`<div class="shadow-grid">${cards}</div>`:'<p class="subtle">Nenhuma deusa apareceu claramente na sombra nas suas respostas.</p>'}</section>`;
}
function areaTile(a){
 return `<button type="button" class="area-tile" data-area="${a.id}" aria-expanded="false" aria-controls="area-detail"><span class="tile-top"><span class="tile-icon" aria-hidden="true">${AREA_ICON[a.id]||'✦'}</span><span class="tile-name">${escape(a.name)}</span></span>${a.leads?`${bust(a.leads.id)}<span class="tile-lead">Rege: <strong>${escape(a.leads.name)}</strong></span>`:'<span class="tile-lead">Poucos dados</span>'}${a.confidence?`<small class="conf conf-${a.confidence.kind}">${escape(a.confidence.label)}</small>`:''}</button>`;
}
function areasHtml(rep){
 return `<section class="report-section" id="r-areas"><div class="eyebrow">II · AS ÁREAS DA SUA VIDA</div><h2>A mesma mulher.<br>Deusas diferentes <em>em cada área.</em></h2><p class="lead-small">${rep.areasSummary?`${escape(rep.areasSummary)} `:''}Toque numa área para ver quem rege, quem ajuda e quem pesa.</p><div class="area-board" id="area-board">${rep.areas.map(areaTile).join('')}<div id="area-detail" class="area-detail" role="region" aria-label="Detalhe da área" hidden></div></div><div class="print-only print-areas" aria-hidden="true">${rep.areas.map(a=>`<article class="area-detail">${areaDetailHtml(a)}</article>`).join('')}</div></section>`;
}
function areaDetailHtml(a){
 const chart=a.chart?.some(p=>p.value!==null);
 return `<div class="area-head"><span class="tile-icon" aria-hidden="true">${AREA_ICON[a.id]||'✦'}</span><div><h3>${escape(a.name)}</h3>${confHtml(a)}<small class="subtle">${a.answered} de ${a.total} cenas respondidas nesta área</small></div><button class="text-button area-close" type="button">Fechar ×</button></div><div class="roles">${areaRoles(a)}</div>${a.style?.length?`<div class="area-style"><span class="eyebrow">SEU JEITO AQUI</span>${a.style.map(s=>`<p><strong>${escape(s.name)} ${escape(s.level)}.</strong> ${escape(s.text)}</p>`).join('')}</div>`:''}${a.dependency?`<p class="dep-note">♡ Nesta área, ${plural(a.dependency,'escolha','escolhas')} de cuidar ou ceder por obrigação ${a.dependency===1?'apareceu':'apareceram'} em primeiro lugar.</p>`:''}${chart?`<details class="area-mandala"><summary>Ver a mandala desta área</summary>${radar(a.chart,'area',a.leads?.id,false)}</details>`:''}`;
}
function toggleArea(id){
 openArea=openArea===id?null:id;
 const detail=$('#area-detail');detail.hidden=true;detail.innerHTML='';
 document.querySelectorAll('.area-tile').forEach(t=>{const on=t.dataset.area===openArea;t.classList.toggle('open',on);t.setAttribute('aria-expanded',on);});
 if(!openArea)return;
 // O detalhe abre logo abaixo da linha da área tocada.
 const tiles=[...document.querySelectorAll('.area-tile')],tile=tiles.find(t=>t.dataset.area===openArea);let anchor=tile;
 for(const t of tiles)if(t.offsetTop===tile.offsetTop)anchor=t;
 anchor.after(detail);detail.innerHTML=areaDetailHtml(currentReport.areas.find(a=>a.id===openArea));detail.hidden=false;
 detail.querySelector('.area-close').addEventListener('click',()=>{const was=openArea;toggleArea(was);document.querySelector(`.area-tile[data-area="${was}"]`)?.focus();});
 detail.scrollIntoView({block:'nearest',behavior:calm()?'auto':'smooth'});
}
function dependencyHtml(d){
 const zones=['Pouco presente','Em algumas cenas','Com força'];
 return `<section class="report-section dep-section" id="r-cuidar"><div class="eyebrow">III · CUIDAR É ESCOLHA, NÃO DÍVIDA</div><h2>Quando cuidar vira<br><em>obrigação.</em></h2><p class="dep-definition">${escape(d.definition)}</p><div class="gauge ${d.zone===null?'no-data':''}" role="img" aria-label="${escape(`Nível: ${d.levelName}`)}"><div class="gauge-track">${zones.map((z,i)=>`<span class="zone z${i} ${d.zone===i?'on':''}">${z}</span>`).join('')}</div>${d.zone!==null?`<i class="gauge-pin z${d.zone}" aria-hidden="true"></i>`:''}</div><h3 class="dep-level">${escape(d.levelName)}</h3><p>${escape(d.text)}</p>${d.offered?`<p class="subtle">Em ${plural(d.offered,'cena','cenas')}, uma das reações era desse tipo. Você a escolheu primeiro em ${d.first}.</p>`:''}${d.evidence.length?`<div class="evidence"><span class="eyebrow">${d.level==='baixo'?'ONDE APARECEU, MESMO ASSIM':'O QUE VOCÊ ESCOLHEU PRIMEIRO'}</span>${d.evidence.map(e=>`<blockquote><p>“${escape(e.text)}”</p><footer>${escape(e.label)} · ${escape(e.area)}</footer></blockquote>`).join('')}</div>`:''}${d.goddesses.length?`<div class="dep-gods"><span class="eyebrow">DEUSAS POR TRÁS DESSAS ESCOLHAS</span><div>${d.goddesses.map(g=>`<span class="pair">${bust(g.id)}${escape(g.name)}</span>`).join('')}</div></div>`:''}<blockquote class="principle">${escape(d.principle)}</blockquote><div class="dep-practice"><span class="eyebrow">PARA ESTA SEMANA</span><p>${escape(d.practice)}</p></div>${d.support?'<div class="support"><strong>Se esse padrão estiver pesando muito, você não precisa atravessar isso sozinha.</strong> Converse com alguém de confiança ou procure apoio profissional. CVV: ligue 188, gratuito, 24 horas. Em situação de violência contra a mulher: Ligue 180.</div>':''}<p class="dep-footer">Este é um sinal para reflexão a partir das suas escolhas nas cenas, não um diagnóstico.</p></section>`;
}
function styleHtml(rep){
 return `<section class="report-section" id="r-jeito"><div class="eyebrow">IV · SEU JEITO DE FUNCIONAR</div><h2>O temperamento por trás<br>das <em>suas escolhas.</em></h2><p class="lead-small">Este desenho vem das afirmações. Ele ajuda a entender por que algumas deusas aparecem mais.</p><div class="rulers">${rep.style.map(t=>`<div class="ruler"><div class="ruler-head"><strong>${escape(t.name)}</strong>${t.level?`<small>${escape(t.level)}</small>`:''}</div><div class="ruler-track">${t.value!==null?`<i class="ruler-mark" data-v="${Math.round(t.value/4*100)}"></i>`:''}</div><div class="ruler-poles"><span>${escape(t.poles[0])}</span><span>${escape(t.poles[1])}</span></div><p>${escape(t.text)}</p></div>`).join('')}</div></section>`;
}
function favorHtml(rep){
 const list=items=>`<ul class="micro-list">${items.map(i=>`<li>${bust(i.id)}<span>${escape(i.text)}</span></li>`).join('')}</ul>`;
 return `<section class="report-section" id="r-favor"><div class="eyebrow">V · A SEU FAVOR E PEDE CUIDADO</div><h2>O que já é seu<br>e o que pede <em>atenção.</em></h2><div class="two-cols"><article class="col-card good"><h3>A seu favor</h3>${list(rep.favor)}${rep.environments.thrive.length?`<h4>Onde você floresce</h4>${list(rep.environments.thrive)}`:''}</article><article class="col-card warn"><h3>Pede cuidado</h3>${rep.care.length?list(rep.care):'<p class="subtle">Nada pediu atenção especial nas suas respostas.</p>'}${rep.environments.drain.length?`<h4>O que te desgasta</h4>${list(rep.environments.drain)}`:''}</article></div></section>`;
}
const DAYS=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
const missionKey=()=>`deusas-missao-${resultId||'local'}`;
function missionState(){try{const v=JSON.parse(localStorage.getItem(missionKey())||'[]');return Array.isArray(v)?v:[];}catch{return [];}}
function missionCount(done){const n=done.filter(Boolean).length;return n?`${n} de 7 dias praticados. ${n>=5?'Que constância bonita.':'Cada dia conta.'}`:'Marque os dias em que você praticou. Fica salvo só neste aparelho.';}
function missionHtml(rep){
 const e=rep.experiment;if(!e)return '';const done=missionState();
 return `<section class="report-section mission" id="r-missao"><div class="eyebrow">VI · SUA MISSÃO DA SEMANA · ${escape(e.goddess.toUpperCase())}</div><div class="mission-card">${bust(e.id)}<div><p class="mission-text">${escape(e.text)}</p><p class="subtle">${escape(e.why)}</p></div></div><div class="days" role="group" aria-label="Dias em que você praticou">${DAYS.map((d,i)=>`<label class="day"><input type="checkbox" data-day="${i}" ${done[i]?'checked':''}><span>${d}</span></label>`).join('')}</div><p class="subtle" id="mission-count" aria-live="polite">${missionCount(done)}</p></section>`;
}
function nextStepHtml(){
 return `<section class="consultation-offer"><div><div class="eyebrow">O PRÓXIMO PASSO / COM YASNNAJÁRA ALVES</div><h2>O questionário mostra o caminho.<br>A consulta <em>confirma.</em></h2><p>${escape(currentReport?currentReport.invite:currentResult.note)}</p></div><div>${bullets(['Confirmação da deusa regente','Deusa na sombra por escassez','Deusa na sombra por excesso','Conversa individual sobre o seu momento'])}<button class="primary consult-trigger" type="button">Conhecer a consulta <span aria-hidden="true">↗</span></button><button class="text-button" id="prefer-ebook" type="button">Prefiro começar por um e-book</button></div></section><section id="ebook-offer" class="ebook-offer" hidden></section>`;
}
// O vídeo só aparece quando estiver configurado; sem placeholder "em preparação".
function videoHtml(){
 const god=currentResult.regents[0],media=god?config.videos?.[god.id]:null;if(!media?.src)return '';
 return `<section class="video-card has-video"><video controls playsinline preload="metadata" ${media.poster?`poster="${escape(media.poster)}"`:''} aria-label="Mensagem em vídeo de ${escape(god.name)}"><source src="${escape(media.src)}">${media.captions?`<track kind="captions" src="${escape(media.captions)}" srclang="pt-BR" label="Português" default>`:''}Seu navegador não conseguiu reproduzir o vídeo.</video><div class="video-caption">Uma mensagem de ${escape(god.name)} · personagem criada com IA</div><p class="video-fallback" hidden>O vídeo não está disponível no momento. Você pode continuar explorando seu mapa.</p></section>`;
}

// ---------- Interações do resultado ----------
function turnCard(card){
 const front=card.querySelector('.front'),back=card.querySelector('.back'),btn=card.querySelector('.flip-turn'),toBack=back.hidden;
 const swap=()=>{front.hidden=toBack;back.hidden=!toBack;btn.setAttribute('aria-expanded',toBack);btn.innerHTML=toBack?'Voltar para a luz <span aria-hidden="true">↺</span>':'Virar a carta <span aria-hidden="true">↻</span>';};
 if(calm()){swap();return;}
 card.classList.add('turning');setTimeout(()=>{swap();card.classList.remove('turning');},180);
}
function observe(el,fn,opts){if(!el)return;if(!('IntersectionObserver' in window)){fn(true);return;}const io=new IntersectionObserver(es=>es.forEach(e=>fn(e.isIntersecting,io)),opts);io.observe(el);pageObservers.push(io);}
function bindResult(){
 pageObservers.forEach(o=>o.disconnect());pageObservers=[];
 const root=$('#result-content');
 root.querySelectorAll('[data-flip]').forEach(card=>card.querySelector('.flip-turn').addEventListener('click',()=>turnCard(card)));
 root.querySelectorAll('.mod').forEach(mod=>mod.querySelector('.mod-head').addEventListener('click',()=>setMod(mod,!mod.classList.contains('open'))));
 root.querySelectorAll('.g-bar [data-w]').forEach(i=>{i.style.width=`${i.dataset.w}%`;});
 root.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>showBook(bookFor(b.dataset.book))));
 root.querySelectorAll('[data-pdf]').forEach(b=>b.addEventListener('click',exportPdf));
 // Tocar numa das sete no topo abre o bloco das sete já com ela escolhida.
 root.querySelectorAll('[data-glance]').forEach(b=>b.addEventListener('click',()=>{selectCapacity(b.dataset.glance);openMod('sete').scrollIntoView({block:'start',behavior:calm()?'auto':'smooth'});}));
 root.querySelectorAll('[data-seven]').forEach(b=>b.addEventListener('click',()=>{sevenMode=b.dataset.seven;renderSeven();}));
 root.querySelectorAll('.area-tile').forEach(t=>t.addEventListener('click',()=>toggleArea(t.dataset.area)));
 root.querySelectorAll('.ruler-mark').forEach(m=>{m.style.left=`${m.dataset.v}%`;});
 root.querySelectorAll('.days input').forEach(box=>box.addEventListener('change',()=>{const done=[...root.querySelectorAll('.days input')].map(i=>i.checked);try{localStorage.setItem(missionKey(),JSON.stringify(done));}catch{}$('#mission-count').textContent=missionCount(done);}));
 root.querySelector('.share-trigger')?.addEventListener('click',shareCard);
 $('#unlock-demo')?.addEventListener('click',unlockDemo);
 $('#prefer-ebook').addEventListener('click',()=>{renderEbook();$('#ebook-offer').hidden=false;$('#ebook-offer').scrollIntoView({block:'start',behavior:calm()?'auto':'smooth'});});
 root.querySelectorAll('.consult-trigger').forEach(b=>b.addEventListener('click',showConsultation));
 const video=root.querySelector('video');if(video){const failed=()=>{const f=root.querySelector('.video-fallback');if(f)f.hidden=false;};video.addEventListener('error',failed);video.querySelector('source')?.addEventListener('error',failed);}
 // Funil: anima uma vez quando entra na tela; sem animação, fica no estado final.
 const funnel=root.querySelector('.funnel');
 if(funnel&&!calm()&&'IntersectionObserver' in window){funnel.classList.add('anim');observe(funnel,(on,io)=>{if(on){funnel.classList.add('play');io?.disconnect();}},{threshold:.25});}
 // Barra fixa da oferta no celular: aparece depois da carta e some perto da oferta.
 const bar=$('#offer-bar');
 if(bar){let pastHero=false,nearOffer=false;const sync=()=>{bar.hidden=!(pastHero&&!nearOffer);};
  observe(root.querySelector('.regent-hero'),on=>{pastHero=!on;sync();});observe($('#locked-report'),on=>{nearOffer=on;sync();});
  $('#offer-bar-go').addEventListener('click',()=>{openMod('relatorio');setTimeout(()=>$('#offer').scrollIntoView({block:'center',behavior:calm()?'auto':'smooth'}),calm()?0:560);});}
}
async function unlockDemo(){
 const b=$('#unlock-demo');b.disabled=true;b.textContent='Abrindo…';
 try{const r=await api(`/api/results/${resultId}/unlock`,{method:'POST',body:'{}'});renderResult(r.result,r.report);$('#report-zone').scrollIntoView({block:'start',behavior:calm()?'auto':'smooth'});}
 catch(e){status(e.message);b.disabled=false;b.textContent='Ver minha deusa em cada área →';}
}

// ---------- Revelação da regente (depois de concluir) ----------
function revealResult(){
 const r=currentResult,p=r.path,regs=r.regents;
 if(!regs.length||!p||p.method==='insuficiente'){view('result');return;}
 const fin=p.finalists,ring=cls=>`<div class="ring">${p.ranking.map(x=>`<span class="ring-god ${cls(x.id)}">${bust(x.id)}</span>`).join('')}</div>`;
 revealActs=[`<div class="act"><div class="eyebrow">SUAS ESCOLHAS FORAM LIDAS</div><h2>Sete deusas entraram<br>nas suas <em>cenas.</em></h2>${ring(()=>'')}<p class="act-hint">Toque para continuar</p></div>`];
 if(p.method==='direto')revealActs.push(`<div class="act"><div class="eyebrow">UMA SE DESTACOU</div><h2>Desde o começo,<br>uma voz falou <em>mais alto.</em></h2>${ring(id=>regs.some(g=>g.id===id)?'in':'out')}</div>`);
 else{
  revealActs.push(`<div class="act"><div class="eyebrow">FICARAM À FRENTE</div><h2>${escape(listJoin(fin.map(f=>f.name)))}<br>quase <em>empatadas.</em></h2><div class="duo-row">${fin.map(f=>`<span class="ring-god in">${bust(f.id)}<small>${escape(f.name)}</small></span>`).join('<b class="vs">×</b>')}</div></div>`);
  if(p.steps)revealActs.push(`<div class="act"><div class="eyebrow">O DESEMPATE</div><h2>${regs.length>1?'Seguiram lado a lado<br>até o <em>fim.</em>':`Nas perguntas finais,<br><em>${escape(regs[0].name)}</em> venceu.`}</h2><div class="score big">${fin.map(f=>`<span class="${regs.some(g=>g.id===f.id)?'win':''}">${escape(f.name)} <b>${f.wins??0}</b></span>`).join('<i>×</i>')}</div></div>`);
 }
 revealActs.push(`<div class="act act-final"><div class="reveal-figures ${regs.length>1?'duo':''}">${regs.map(g=>figure(g.id,'reveal-figure')).join('')}</div><div class="eyebrow">${regs.length>1?'DUAS REGENTES':'SUA REGENTE'}</div><h2>${escape(r.headline)}</h2>${regs.length===1?`<p class="capacity-title">${escape(regs[0].capacity)}</p>`:''}</div>`);
 revealAt=0;view('reveal');showAct();
}
function showAct(){
 const last=revealAt>=revealActs.length-1;
 $('#reveal-stage').innerHTML=revealActs[revealAt];
 $('#reveal-next').innerHTML=last?'Ver meu mapa <span aria-hidden="true">→</span>':'Continuar <span aria-hidden="true">→</span>';
 $('#reveal-skip').hidden=last;if(revealAt===0)$('#reveal-next').focus({preventScroll:true,focusVisible:false});
}
function nextAct(){if(revealAt>=revealActs.length-1){view('result');return;}revealAt++;showAct();}
$('#reveal-next').addEventListener('click',nextAct);
$('#reveal-stage').addEventListener('click',nextAct);
$('#reveal-skip').addEventListener('click',()=>view('result'));

// ---------- Cartão para compartilhar (1080×1920) ----------
function loadImage(src){return new Promise((ok,fail)=>{const img=new Image();img.onload=()=>ok(img);img.onerror=fail;img.src=src;});}
function wrapText(ctx,text,x,y,max,line){const words=text.split(' ');let row='';for(const w of words){const test=row?`${row} ${w}`:w;if(ctx.measureText(test).width>max&&row){ctx.fillText(row,x,y);row=w;y+=line;}else row=test;}if(row)ctx.fillText(row,x,y);return y;}
async function shareCard(){
 const g=currentResult.regents[0];if(!g)return;
 const btn=$('.share-trigger');btn.disabled=true;
 try{
  const c=document.createElement('canvas');c.width=1080;c.height=1920;const x=c.getContext('2d');
  x.fillStyle='#f8f5ee';x.fillRect(0,0,1080,1920);
  x.fillStyle='#e9dcbc';x.beginPath();x.moveTo(200,1480);x.lineTo(200,760);x.arc(540,760,340,Math.PI,0);x.lineTo(880,1480);x.closePath();x.fill();
  x.strokeStyle='#a18753';x.lineWidth=3;x.stroke();
  const img=await loadImage(`assets/deusas/${g.id}-corpo.webp`),h=1060,w=img.naturalWidth/img.naturalHeight*h;x.drawImage(img,540-w/2,430,w,h);
  x.textAlign='center';x.fillStyle='#505e46';x.font='600 30px Arial, sans-serif';x.fillText('MÉTODO DAS DEUSAS',540,150);
  x.fillStyle='#30372f';x.font='56px Georgia, serif';x.fillText('Minha deusa regente é',540,250);
  x.fillStyle='#6a343d';x.font='italic 120px Georgia, serif';x.fillText(g.name,540,370);
  x.fillStyle='#505e46';x.font='46px Georgia, serif';x.fillText(g.capacity,540,1580);
  x.fillStyle='#30372f';x.font='italic 38px Georgia, serif';wrapText(x,g.card.question,540,1660,860,52);
  x.fillStyle='#666a5d';x.font='28px Arial, sans-serif';x.fillText(`Yasnnajára Alves · descubra a sua em ${location.host}`,540,1850);
  const blob=await new Promise(ok=>c.toBlob(ok,'image/png'));
  const file=new File([blob],`minha-deusa-${g.id}.png`,{type:'image/png'});
  if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:'Minha deusa regente',text:`Minha deusa regente é ${g.name}.`});}catch{}}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);status('Imagem salva. Agora é só compartilhar.');}
 }catch{status('Não consegui gerar a imagem agora. Tente de novo.');}
 finally{btn.disabled=false;}
}

// ---------- E-book ----------
// O e-book indicado é o da deusa que apareceu na sombra (escolhida no cálculo do mapa); sem sombra, nenhum.
function selectedBook(){return currentResult.ebook?bookFor(currentResult.ebook.id):null;}
function renderEbook(){
 const book=selectedBook();$('#ebook-offer').classList.toggle('no-book',!book);
 if(!book){$('#ebook-offer').innerHTML=`<div class="ebook-copy"><div class="eyebrow">UM PASSO MENOR, NO SEU RITMO</div><h2>Nenhum e-book <em>indicado agora.</em></h2><p>Nas suas respostas, nenhuma deusa apareceu na sombra. Os e-books são feitos para quando uma deusa pede ajuste, então nenhum é indicado para você agora. A consulta faz a leitura completa, se quiser confirmar.</p></div>`;return;}
 const offer=config.ebooks?.[book.id]||{},where=book.shadow==='escassez'?'apareceu com pouco espaço nas suas escolhas':'apareceu demais nas suas escolhas';
 $('#ebook-offer').innerHTML=`<div class="ebook-cover"><small>MÉTODO DAS DEUSAS</small>${bust(book.id,'book-bust')}<h3>${escape(book.name)}</h3><p>Para a deusa<br>que pede cuidado.</p><span class="book-author">YASNNAJÁRA ALVES</span></div><div class="ebook-copy"><div class="eyebrow">UM PASSO MENOR, NO SEU RITMO</div><h2>Comece por <em>${escape(book.name)}.</em></h2><p>No seu mapa, ${escape(book.name)} ${where}. Este pequeno e-book mostra como ela aparece quando falta e quando sobra, e traz uma prática simples para a sua semana.</p>${offer.checkoutUrl?`<a class="primary" href="${escape(offer.checkoutUrl)}" target="_blank" rel="noopener noreferrer">Conhecer o e-book${offer.priceBRL?` · ${price(offer.priceBRL)}`:''} ↗</a>`:'<button class="primary" id="ebook-preview" type="button">Ver a proposta do e-book ↗</button><p class="subtle">Conteúdo em preparação. A venda será aberta depois da aprovação da autora.</p>'}</div>`;
 if($('#ebook-preview'))$('#ebook-preview').addEventListener('click',()=>showBook(book));
}

// ---------- Diálogos e contatos ----------
function channels(){
 const names={whatsapp:'WhatsApp',instagram:'Instagram',website:'Site pessoal'};
 return `<div class="channel-list">${Object.entries(names).map(([key,label])=>config.contacts?.[key]?`<a class="channel-link" href="${escape(config.contacts[key])}" target="_blank" rel="noopener noreferrer"><span>${label}</span><span aria-hidden="true">↗</span></a>`:`<div class="channel-pending"><span>${label}</span><small>Em breve</small></div>`).join('')}</div>`;
}
function openContent(html){$('#dialog-content').innerHTML=html;const dialog=$('#content-dialog');if(!dialog.open)dialog.showModal();}
function showConsultation(){
 openContent(`<h2>Um encontro com<br><em>o seu contexto.</em></h2><p>Na consulta radiestésica, Yasnnajára Alves faz a avaliação completa do Método das Deusas: qual deusa rege, qual está na sombra por escassez e qual está na sombra por excesso, considerando a sua história.</p>${config.consultationUrl?`<a class="primary" href="${escape(config.consultationUrl)}" target="_blank" rel="noopener noreferrer">Conhecer a consulta ↗</a>`:''}${config.methodUrl?`<p><a href="${escape(config.methodUrl)}" target="_blank" rel="noopener noreferrer">Conhecer o serviço do método ↗</a></p>`:''}${channels()}${!config.consultationUrl&&!Object.values(config.contacts||{}).some(Boolean)?'<p class="pending-message">Os canais de contato e as inscrições serão divulgados em breve.</p>':''}`);
}
function showContacts(){openContent(`<h2>Conheça a<br><em>Yasnnajára Alves.</em></h2><p>Criadora do Método das Deusas.</p>${channels()}${!Object.values(config.contacts||{}).some(Boolean)?'<p class="pending-message">Os canais serão divulgados após a aprovação desta página.</p>':''}`);}
function showBook(book){openContent(`<div class="eyebrow">PRÉVIA DA PROPOSTA · CONTEÚDO EM PREPARAÇÃO</div><h2>${escape(book.title)}</h2><p>Um guia introdutório do Método das Deusas, de Yasnnajára Alves.</p><div class="book-excerpt"><h3>Quem é ${escape(book.name)} em você</h3><p>${escape(book.excerpt)}</p>${book.practice?`<h3>Um pequeno passo para a semana</h3><p>${escape(book.practice)}</p>`:''}</div><p>O guia não substitui a avaliação individual da regência e das sombras, feita na consulta.</p><button class="secondary" disabled>Disponível em breve</button>`);}
document.querySelectorAll('.consult-trigger').forEach(b=>b.addEventListener('click',showConsultation));
document.querySelectorAll('.contact-trigger').forEach(b=>b.addEventListener('click',showContacts));
$('#content-dialog .dialog-close').addEventListener('click',()=>$('#content-dialog').close());
$('#content-dialog').addEventListener('click',e=>{if(e.target===$('#content-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
function confirmAction(title,text){return new Promise(resolve=>{const d=$('#confirm-dialog');$('#dialog-title').textContent=title;$('#dialog-text').textContent=text;d.returnValue='cancel';d.addEventListener('close',()=>resolve(d.returnValue==='confirm'),{once:true});d.showModal();});}
async function erase(){if(resultId)await api(`/api/results/${resultId}`,{method:'DELETE'});forgetDraft();resultId=null;currentResult=null;currentReport=null;answers={};index=0;$('#result-content').innerHTML='';$('#adult').checked=false;$('#consent').checked=false;}
async function startAgain(force){if(busy)return;if(resultId){if(!await confirmAction('Começar um novo mapa?','O mapa atual será apagado deste piloto. Você poderá responder novamente.'))return;try{await erase();}catch(e){status(e.message);return;}}else if(force){answers={};index=0;forgetDraft();}beginSetup();}
$('#restart').addEventListener('click',()=>startAgain(true));
$('#delete-result').addEventListener('click',async()=>{if(!await confirmAction('Apagar seu mapa?','Suas respostas e seu mapa serão excluídos deste aparelho. O progresso salvo neste dispositivo também será apagado.'))return;try{await erase();view('home');status('Mapa apagado.');}catch(e){status(e.message);}});
$('#print-report').addEventListener('click',()=>{if(currentResult)exportPdf();else window.print();});
async function initialize(){
 try{const [c,q]=await Promise.all([api('/api/config'),api('/api/questions')]);config=c;bank=q.questions;version=q.version;const current=await api('/api/current');if(current.id){resultId=current.id;const r=await api(`/api/results/${resultId}`);renderResult(r.result,r.report);view('result');}}
 catch(e){status('As perguntas não carregaram. Confira se a demonstração local está aberta e recarregue a página.');}
}
initialize();
// Início: cada deusa vira a carta para mostrar a sombra por excesso e por escassez.
document.querySelectorAll('.god-card').forEach(card=>card.querySelector('.god-turn').addEventListener('click',()=>{const on=!card.classList.contains('turned');card.classList.toggle('turned',on);card.querySelector('.light').hidden=on;card.querySelector('.shadow').hidden=!on;const b=card.querySelector('.god-turn');b.textContent=on?'Ver a luz':'Ver a sombra';b.setAttribute('aria-expanded',on);}));
