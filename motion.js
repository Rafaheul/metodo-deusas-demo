// Movimento do site (par do motion.css). Roda antes da página aparecer, só observa o que o
// app.js faz e não muda nenhuma resposta. Sem este arquivo, o site continua igual, só parado.
(function(){
 const calm=matchMedia('(prefers-reduced-motion: reduce)').matches,watch='IntersectionObserver' in window;
 if(!calm&&watch)document.documentElement.classList.add('m-js');
 const $=s=>document.querySelector(s);

 function reveals(){
  const groups=[['.section-heading,.journey-duration,.method-layout>div:first-child,.invitation .wrap>*,.faq>*,.m-scale',90],['.page-mecanismo__card,.page-modulo,.mj-stage,.mj-side',90],['.god-card',80]];
  const step=new Map();
  for(const [sel,ms] of groups)document.querySelectorAll(`#home-view :is(${sel})`).forEach(el=>{el.classList.add('m-r');step.set(el,ms);});
  // Quem entra na tela no mesmo instante sobe em cascata; quem entra depois (arrastando o carrossel) sobe na hora.
  const io=new IntersectionObserver(entries=>{
   entries.filter(e=>e.isIntersecting).map(e=>e.target)
    .sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)
    .forEach((el,i)=>{el.style.setProperty('--d',`${Math.min(i,7)*step.get(el)}ms`);el.classList.add('m-in');io.unobserve(el);});
  },{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  step.forEach((_,el)=>io.observe(el));
 }

 function quiz(){
  const fieldset=$('#question-form fieldset'),answers=$('#answers'),scene=$('#scene'),label=$('#scene-label'),hint=$('#auto-hint');
  let back=false,lastKey='',enterTimer,leaveTimer;
  $('#previous').addEventListener('click',()=>{back=true;});
  const settle=()=>fieldset.classList.remove('m-enter','m-back');
  // Cena nova: entra em cascata. Voltando com "Anterior", as opções vêm do outro lado.
  new MutationObserver(()=>{
   const key=label.textContent+'|'+scene.textContent;if(key===lastKey)return;lastKey=key;
   clearTimeout(leaveTimer);fieldset.classList.remove('m-leave');settle();void fieldset.offsetWidth;
   fieldset.classList.add('m-enter');if(back)fieldset.classList.add('m-back');back=false;
   clearTimeout(enterTimer);enterTimer=setTimeout(settle,1200);
  }).observe(scene,{childList:true,characterData:true,subtree:true});
  // Escolher no meio da cascata não pode fazer as opções redesenhadas entrarem de novo.
  ['pointerdown','keydown'].forEach(t=>answers.addEventListener(t,settle));
  // Resposta registrada: a cena sai para o lado antes da próxima chegar (o app espera 450 ms).
  new MutationObserver(()=>{
   const going=/próxima/.test(hint.textContent);fieldset.classList.toggle('m-leave',going);
   clearTimeout(leaveTimer);if(going)leaveTimer=setTimeout(()=>fieldset.classList.remove('m-leave'),900);
  }).observe(hint,{childList:true,characterData:true,subtree:true});
  // Troca de tela (preparação, quiz, desempate, revelação, resultado): a nova sobe de leve.
  const shown=new MutationObserver(list=>{
   for(const {target:el} of list){if(el.hidden)continue;el.classList.remove('m-view');void el.offsetWidth;el.classList.add('m-view');setTimeout(()=>el.classList.remove('m-view'),700);}
  });
  ['#setup-view','#quiz-view','#reveal-view','#result-view','#duel-intro'].map($).forEach(v=>v&&shown.observe(v,{attributes:true,attributeFilter:['hidden']}));
 }

 // Cartão da deusa: ao virar para a sombra (ou voltar para a luz), o busto gira como moeda.
 function flips(){
  document.querySelectorAll('.god-card .god-turn').forEach(b=>b.addEventListener('click',()=>{
   const card=b.closest('.god-card');card.classList.remove('m-flip');void card.offsetWidth;card.classList.add('m-flip');setTimeout(()=>card.classList.remove('m-flip'),700);
  }));
 }

 // Capa: no computador, inclina para o lado do mouse e o brilho acompanha.
 function cover(){
  const fig=$('.cover-art'),area=$('.hero-shell');
  if(!fig||!area||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const pic=fig.querySelector('picture');let frame=0,last=null;
  const apply=()=>{frame=0;if(!last){['--rx','--ry','--tx','--ty'].forEach(k=>pic.style.removeProperty(k));pic.style.setProperty('--go',0);return;}
   const r=pic.getBoundingClientRect(),cl=v=>Math.max(-1,Math.min(1,v));
   const x=cl((last.x-(r.left+r.width/2))/(r.width*.9)),y=cl((last.y-(r.top+r.height/2))/(r.height*.9));
   pic.style.setProperty('--ry',`${(x*9).toFixed(2)}deg`);pic.style.setProperty('--rx',`${(-y*7).toFixed(2)}deg`);
   pic.style.setProperty('--tx',x.toFixed(3));pic.style.setProperty('--ty',y.toFixed(3));
   pic.style.setProperty('--gx',`${50+x*40}%`);pic.style.setProperty('--gy',`${40+y*40}%`);pic.style.setProperty('--go',1);};
  const ask=()=>{if(!frame)frame=requestAnimationFrame(apply);};
  area.addEventListener('pointermove',e=>{last={x:e.clientX,y:e.clientY};ask();});
  area.addEventListener('pointerleave',()=>{last=null;ask();});
 }

 // A balança das deusas: cada deusa passa por "de menos", "na medida" e "demais",
 // com os textos de luz e sombra que já estão nos cartões da seção.
 function balance(){
  const host=$('.goddesses'),cards=[...document.querySelectorAll('.god-card')];if(!host||!cards.length)return;
  const after=p=>{if(!p)return '';const b=p.querySelector('b');return p.textContent.replace(b?b.textContent:'','').trim();};
  const gods=cards.map(c=>{const sh=c.querySelectorAll('.shadow p');return{name:c.querySelector('h3').textContent.trim(),src:c.querySelector('.bust').getAttribute('src'),texts:[after(sh[1]),c.querySelector('.light p').textContent.trim(),after(sh[0])]};});
  const LABEL=['Na sombra por escassez.','Na luz.','Na sombra por excesso.'],SEQ=[1,0,2],HOLD=[3400,3900,3900];
  const box=document.createElement('div');box.className='m-scale s1';box.style.setProperty('--p',1);
  box.innerHTML=`<div class="eyebrow">A MESMA DEUSA, TRÊS JEITOS DE APARECER</div><h3 class="m-scale-name"></h3>
   <div class="m-scale-track" aria-hidden="true"><div class="m-scale-line"></div><i class="m-tick t0"></i><i class="m-tick t1"></i><i class="m-tick t2"></i>
    <div class="m-scale-marker"><div class="m-scale-face"><span class="m-ring"></span><span class="m-ring r2"></span><img class="bust" alt="" width="96" height="96"></div></div></div>
   <div class="m-scale-states" role="group" aria-label="Como a deusa aparece">
    <button type="button" data-s="0">Na sombra<small>por escassez</small></button><button type="button" data-s="1">Na luz<small>na medida</small></button><button type="button" data-s="2">Na sombra<small>por excesso</small></button></div>
   <p class="m-scale-text" aria-live="off"></p>
   <div class="m-scale-foot"><div class="m-scale-gods" role="group" aria-label="Escolher a deusa">${gods.map((g,i)=>`<button type="button" data-g="${i}" aria-label="${g.name}"><img class="bust" src="${g.src}" alt="" width="38" height="38" loading="lazy"></button>`).join('')}</div>
    <button type="button" class="text-button m-scale-play"></button></div>`;
  host.after(box);
  const marker=box.querySelector('.m-scale-marker'),img=marker.querySelector('img'),name=box.querySelector('.m-scale-name'),text=box.querySelector('.m-scale-text'),play=box.querySelector('.m-scale-play');
  const stateBtns=[...box.querySelectorAll('[data-s]')],godBtns=[...box.querySelectorAll('[data-g]')];
  let g=0,s=1,k=0,timer=0,paused=calm,visible=false;
  const pulse=el=>{el.classList.remove('m-text');void el.offsetWidth;el.classList.add('m-text');};
  function setState(n){
   s=n;box.classList.remove('s0','s1','s2');box.classList.add(`s${n}`);box.style.setProperty('--p',n);
   stateBtns.forEach((b,i)=>b.setAttribute('aria-pressed',i===n));
   text.replaceChildren(Object.assign(document.createElement('b'),{textContent:LABEL[n]}),` ${gods[g].texts[n]}`);pulse(text);
  }
  function setGod(n,first){
   g=n;godBtns.forEach((b,i)=>b.setAttribute('aria-pressed',i===n));
   const swap=()=>{img.src=gods[g].src;name.textContent=gods[g].name;marker.classList.remove('m-out');if(!first)pulse(name);};
   if(first||calm)swap();else{marker.classList.add('m-out');setTimeout(swap,280);}
  }
  function schedule(){clearTimeout(timer);if(paused||!visible||document.hidden)return;timer=setTimeout(tick,HOLD[k]);}
  function tick(){k++;if(k>=SEQ.length){k=0;setGod((g+1)%gods.length);}setState(SEQ[k]);schedule();}
  function setPaused(p){paused=p;play.innerHTML=p?'<span aria-hidden="true">▶</span> Ver em sequência':'<span aria-hidden="true">❚❚</span> Pausar';text.setAttribute('aria-live',p?'polite':'off');schedule();}
  stateBtns.forEach((b,i)=>b.addEventListener('click',()=>{setPaused(true);k=SEQ.indexOf(i);setState(i);}));
  godBtns.forEach((b,i)=>b.addEventListener('click',()=>{setPaused(true);k=0;setGod(i);setState(1);}));
  play.addEventListener('click',()=>setPaused(!paused));
  gods.forEach(x=>{new Image().src=x.src;});
  setGod(0,true);setState(1);setPaused(paused);
  if(watch)new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();},{threshold:.4}).observe(box);
  document.addEventListener('visibilitychange',schedule);
 }

 // A jornada: no lugar dos três cartões, uma volta de 17 s pelo mapa (responder, descobrir,
 // aprofundar). A cena é a de aquecimento do próprio site; a regente e as escolhas mudam a cada volta,
 // para ninguém ler ali que tal resposta leva a tal deusa.
 function journey(){
  const deck=$('.page-mecanismo__deck'),scene=$('.warmup-scene'),opts=[...document.querySelectorAll('#warmup-options .option-text')].map(e=>e.textContent);
  const gods=[...document.querySelectorAll('.god-card')].map(c=>({name:c.querySelector('h3').textContent.trim(),cap:c.querySelector('.light p').textContent.trim(),src:c.querySelector('.bust').getAttribute('src')}));
  if(!deck||!scene||opts.length!==4||gods.length!==7)return;
  const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const steps=[...deck.querySelectorAll('.page-mecanismo__card')].map(c=>({eyebrow:c.querySelector('.eyebrow').textContent,title:c.querySelector('h3').textContent,text:c.querySelector('p').textContent,note:c.querySelector('small')?.textContent||''}));
  const FLAGS=[['scene',0],['opts',900],['pick1',3200],['pick2',4600],['temple',5400],['ring',7500],['lit',7900],['regent',9600],['doors',12000],['out',15600]];
  const ACTS=[0,7500,12000],LOOP=17000,REG=[6,1,4,2,0,5,3],PICKS=[[1,2],[3,0],[2,1],[0,3],[3,1],[2,0],[1,3]];
  const ICON={relatorio:'<path d="M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5"/>',consulta:'<path d="M12 3v9"/><path d="M12 12c-2.5 0-4 2-4 4.2C8 18.4 10 21 12 21s4-2.6 4-4.8C16 14 14.5 12 12 12z"/>',ebook:'<path d="M3 6c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0z M21 6c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>'};
  const door=(icon,label)=>`<div class="mj-door"><svg viewBox="0 0 24 24">${ICON[icon]}</svg><strong>${label}</strong></div>`;
  const cols=[...Array(7)].map((_,k)=>`<rect class="mj-col" style="--k:${k}" x="${14+k*48}" y="34" width="20" height="62" rx="1"/>`).join('');
  const box=document.createElement('div');box.className='mj';
  box.innerHTML=`<div class="mj-stage" aria-hidden="true">
    <div class="mj-layer mj-scene"><div class="mj-prompt"><span>A SITUAÇÃO</span><p>${esc(scene.textContent)}</p></div>
     <div class="mj-opts">${opts.map(o=>`<div class="mj-opt"><span class="mj-tag"></span>${esc(o)}<span class="mj-tap"></span></div>`).join('')}</div></div>
    <div class="mj-layer mj-temple"><svg viewBox="0 0 352 106"><polygon class="mj-ped" points="6,30 176,4 346,30"/>${cols}<rect class="mj-base" x="4" y="96" width="344" height="6" rx="1"/></svg><p>49 CENAS + 20 AFIRMAÇÕES</p></div>
    <div class="mj-layer mj-ring">${gods.map((g,i)=>{const a=(-90+i*360/7)*Math.PI/180;return `<img class="mj-b" src="${esc(g.src)}" alt="" style="--i:${i};--cx:${Math.cos(a).toFixed(4)};--sy:${Math.sin(a).toFixed(4)}">`;}).join('')}
     <div class="mj-reg"><span>SUA REGENTE</span><strong></strong><small></small></div></div>
    <div class="mj-layer mj-doors">${door('relatorio','Relatório completo')}${door('consulta','Consulta com Yasnnajára')}${door('ebook','E-book da sua deusa')}</div>
   </div>
   <div class="mj-side"><ol class="mj-steps">${steps.map((s,i)=>`<li class="mj-step"><button type="button" data-act="${i}"><span class="mj-num">0${i+1}</span><span class="eyebrow">${esc(s.eyebrow)}</span></button><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.note?`<small>${esc(s.note)}</small>`:''}</li>`).join('')}</ol>
   <button type="button" class="text-button mj-play"></button></div>`;
  deck.replaceWith(box);
  const stage=box.querySelector('.mj-stage'),optEls=[...stage.querySelectorAll('.mj-opt')],busts=[...stage.querySelectorAll('.mj-b')],items=[...box.querySelectorAll('.mj-step')],play=box.querySelector('.mj-play');
  let t=0,lastNow=0,loop=0,running=false,paused=false,visible=false;const on={};
  function setup(){
   const [a,b]=PICKS[loop%PICKS.length],g=REG[loop%REG.length];
   optEls.forEach((el,i)=>{el.classList.toggle('is1',i===a);el.classList.toggle('is2',i===b);el.querySelector('.mj-tag').innerHTML=i===a?'1º · FARIA PRIMEIRO':i===b?'✕ · MENOS FARIA':'';});
   busts.forEach((el,i)=>el.classList.toggle('is-r',i===g));
   stage.querySelector('.mj-reg strong').textContent=gods[g].name;stage.querySelector('.mj-reg small').textContent=gods[g].cap;
  }
  function reset(){stage.classList.add('mj-reset');FLAGS.forEach(([f])=>{stage.classList.remove(f);on[f]=false;});setup();void stage.offsetWidth;stage.classList.remove('mj-reset');}
  function apply(){
   for(const [f,at] of FLAGS){const v=t>=at;if(on[f]!==v){stage.classList.toggle(f,v);on[f]=v;}}
   const act=t>=ACTS[2]?2:t>=ACTS[1]?1:0,end=act<2?ACTS[act+1]:LOOP;
   items.forEach((li,i)=>{if(i===act)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');li.style.setProperty('--prog',i===act?((t-ACTS[act])/(end-ACTS[act])).toFixed(3):0);});
  }
  function frame(now){if(!running)return;t+=Math.min(100,now-lastNow);lastNow=now;if(t>=LOOP){loop++;t=0;reset();}apply();requestAnimationFrame(frame);}
  function sync(){const go=!paused&&visible&&!document.hidden;if(go&&!running){running=true;lastNow=performance.now();requestAnimationFrame(frame);}else if(!go)running=false;}
  function setPaused(p){paused=p;play.innerHTML=p?'<span aria-hidden="true">▶</span> Continuar':'<span aria-hidden="true">❚❚</span> Pausar';sync();}
  // No celular os passos ficam embaixo da animação: ao tocar num deles, a página sobe até ela.
  function jump(n){if(ACTS[n]<t)reset();t=ACTS[n];apply();const r=stage.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)stage.scrollIntoView({block:'nearest',behavior:'smooth'});}
  items.forEach((li,i)=>li.addEventListener('click',()=>jump(i)));
  play.addEventListener('click',()=>setPaused(!paused));
  reset();apply();setPaused(false);
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();},{threshold:.35}).observe(stage);
  document.addEventListener('visibilitychange',sync);
 }

 document.addEventListener('DOMContentLoaded',()=>{
  balance();
  if(calm||!watch)return;
  journey();reveals();quiz();flips();cover();
 });
})();
