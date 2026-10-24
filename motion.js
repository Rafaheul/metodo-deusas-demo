// Movimento do site (par do motion.css). Roda antes da página aparecer, só observa o que o
// app.js faz e não muda nenhuma resposta. Sem este arquivo, o site continua igual, só parado.
(function(){
 const calm=matchMedia('(prefers-reduced-motion: reduce)').matches,watch='IntersectionObserver' in window;
 if(!calm&&watch)document.documentElement.classList.add('m-js');
 const $=s=>document.querySelector(s);

 function reveals(){
  const groups=[['.section-heading,.journey-duration,.method-layout>div:first-child,.invitation .wrap>*,.faq>*,.m-scale',90],['.page-mecanismo__card,.page-modulo',90],['.god-card',80]];
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
  const LABEL=['De menos.','Na luz.','Demais.'],SEQ=[1,0,2],HOLD=[3400,3900,3900];
  const box=document.createElement('div');box.className='m-scale s1';box.style.setProperty('--p',1);
  box.innerHTML=`<div class="eyebrow">A MESMA DEUSA, TRÊS JEITOS DE APARECER</div><h3 class="m-scale-name"></h3>
   <div class="m-scale-track" aria-hidden="true"><div class="m-scale-line"></div><i class="m-tick t0"></i><i class="m-tick t1"></i><i class="m-tick t2"></i>
    <div class="m-scale-marker"><div class="m-scale-face"><span class="m-ring"></span><span class="m-ring r2"></span><img class="bust" alt="" width="96" height="96"></div></div></div>
   <div class="m-scale-states" role="group" aria-label="Como a deusa aparece">
    <button type="button" data-s="0">De menos<small>sombra por escassez</small></button><button type="button" data-s="1">Na medida<small>na luz</small></button><button type="button" data-s="2">Demais<small>sombra por excesso</small></button></div>
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

 document.addEventListener('DOMContentLoaded',()=>{
  balance();
  if(calm||!watch)return;
  reveals();quiz();flips();cover();
 });
})();
