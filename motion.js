// Movimento do site (par do motion.css). Roda antes da página aparecer, só observa o que o
// app.js faz e não muda nenhuma resposta. Sem este arquivo, o site continua igual, só parado.
(function(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 document.documentElement.classList.add('m-js');
 const $=s=>document.querySelector(s);

 function reveals(){
  const groups=[['.section-heading,.journey-duration,.method-layout>div:first-child,.invitation .wrap>*,.faq>*',90],['.page-mecanismo__card,.page-modulo',90],['.god-card',80]];
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

 document.addEventListener('DOMContentLoaded',()=>{reveals();quiz();});
})();
