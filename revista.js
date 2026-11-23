// Revista do Mapa das Deusas (23/11/2026): o relatório completo vira uma revista em PDF.
// Tudo acontece no navegador da pessoa, com os textos fixos do método (lib/reports.js):
// nenhuma API, nenhum servidor, custo zero por revista. O PDF sai pela janela de impressão.
import { CONTENT, SHADOWS, OPPOSITE } from './lib/reports.js';
import { GODDESSES } from './lib/questions.js';

const GREGO = { artemis: 'Ἄρτεμις', atena: 'Ἀθηνᾶ', hestia: 'Ἑστία', hera: 'Ἥρα', demeter: 'Δημήτηρ', persefone: 'Περσεφόνη', afrodite: 'Ἀφροδίτη' };
const EPITETO = { hestia: 'o centro interior', artemis: 'a direção e a determinação', atena: 'a estratégia e a inteligência',
  hera: 'o compromisso e a dignidade', demeter: 'o cuidado e a nutrição', persefone: 'a receptividade e a transformação', afrodite: 'o magnetismo e o prazer' };
const ROMANO = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const ESTADO = { luz: 'na luz', excesso: 'na sombra por excesso', escassez: 'na sombra por escassez', insuficiente: 'poucos dados' };
const ZAP = 'https://wa.me/5584992112122?text=' + encodeURIComponent('Olá, Yasnnajára! Fiz o Mapa das Deusas, baixei a minha revista e quero saber da consulta.');
const IMG = 'assets/revista/';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nome = id => GODDESSES[id]?.name || '';
const idPorNome = n => Object.keys(GODDESSES).find(id => GODDESSES[id].name === n);
const lista = a => a.length > 1 ? `${a.slice(0, -1).join(', ')} e ${a.at(-1)}` : (a[0] || '');
const grega = '<div class="rv-grega" aria-hidden="true"></div>';
const ORDINAL = ['Primeira', 'Segunda', 'Terceira'];
function SUMARIO(regentes, missao) {
  const l = regentes.map((id, k) => [ROMANO[k], `${regentes.length > 1 ? 'Uma das suas regentes' : 'A sua regente'}: ${nome(id)}`]);
  let k = regentes.length;
  l.push([ROMANO[k++], 'As suas dominantes'], [ROMANO[k++], 'Luz e sombra das sete'], [ROMANO[k++], 'As sete áreas da sua vida'], [ROMANO[k++], 'A seu favor e pede cuidado']);
  if (missao) l.push([ROMANO[k++], 'A sua missão da semana']);
  l.push(['Ω', 'O próximo passo']);
  return l;
}

function rodape(n, titulo) {
  return `<footer class="rv-pe"><span>Mapa das Deusas · ${esc(titulo)}</span><b>${n}</b></footer>`;
}
function arco(id, extra = '') {
  return `<figure class="rv-arco ${extra}"><img src="${IMG}${id}-retrato.jpg" alt=""></figure>`;
}
function barra(v) { // v de 0 a 4
  const p = v === null || v === undefined ? 0 : Math.round(Math.max(0, Math.min(4, v)) / 4 * 100);
  return `<span class="rv-barra"><i style="width:${p}%"></i></span>`;
}

export function montar(result, report, dono) {
  const regentes = result.regents.map(r => r.id);
  const reg = regentes[0] || [...result.capacities].sort((a, b) => (b.value ?? -1) - (a.value ?? -1))[0].id;
  const estadoDe = id => report.capacities.find(c => c.id === id)?.state || 'luz';
  const valorDe = id => result.capacities.find(c => c.id === id)?.value ?? null;
  const nivelDe = id => result.capacities.find(c => c.id === id)?.level || '';
  const dominantes = (report.allies || []).map(idPorNome).filter(Boolean).filter(id => !regentes.includes(id)).slice(0, 2);
  const sombras = [...report.excess.map(x => ({ ...x, tipo: 'excesso' })), ...report.scarcity.map(x => ({ ...x, tipo: 'escassez' }))];
  const data = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const titulo = dono ? `Edição de ${dono}` : 'A sua edição';
  const regNomes = lista(regentes.map(nome));
  let n = 1; const pags = [];

  // ---------- capa ----------
  pags.push(`<section class="rv-pg rv-capa">
    <div class="rv-capa__moldura"></div>
    <h1 class="rv-capa__mast">DEUSAS</h1>
    <img class="rv-capa__deusa" src="${IMG}${reg}-capa.webp" alt="">
    <div class="rv-capa__canto rv-capa__canto--d"><em>o seu Mapa</em><em>das Deusas</em><small>MMXXVI</small></div>
    <div class="rv-capa__canto rv-capa__canto--e"><b>LUZ E</b><em>sombra</em><small>nas sete áreas<br>da sua vida</small></div>
    <div class="rv-capa__canto rv-capa__canto--d2"><strong>7</strong><b>DEUSAS</b><small>em você</small></div>
    <div class="rv-capa__fim">
      ${dono ? `<p class="rv-capa__dono">edição de ${esc(dono)}</p>` : ''}
      <p class="rv-capa__chamada">${regentes.length > 1 ? 'as suas deusas regentes são' : regentes.length ? 'a sua deusa regente é' : 'quem mais aparece em você é'}</p>
      <p class="rv-capa__nome">${esc(regentes.length > 1 ? regNomes : nome(reg))}</p>
      <p class="rv-capa__epiteto">${esc(EPITETO[reg])}</p>
    </div>
  </section>`);

  // ---------- proêmio: como ler ----------
  n++;
  pags.push(`<section class="rv-pg rv-papel">
    <header class="rv-topo"><span>Proêmio</span>${grega}</header>
    <div class="rv-ficha"><div><small>Leitura de</small><em>${esc(dono || 'você')}</em></div><div><small>Data</small><em>${esc(data)}</em></div><div><small>Regente</small><em>${esc(regNomes || 'em aberto')}</em></div></div>
    <p class="rv-lead">Esta revista mostra como as sete deusas aparecem nas suas escolhas de hoje: quem rege, quem ajuda, quem passou do ponto e quem ficou sem espaço, em cada área da sua vida.</p>
    <p>As deusas dão nome a capacidades que toda mulher tem. Você não é uma deusa só: elas se revezam, e o desenho muda com o momento da vida.</p>
    <h2 class="rv-h2">Entendendo a sua leitura</h2><div class="rv-traco"></div>
    <div class="rv-conceitos">
      <div><h3>Deusa regente</h3><em>quem comanda</em><p>${esc(result.definition)}</p></div>
      <div><h3>Deusas dominantes</h3><em>quem acompanha</em><p>As que mais aparecem na luz logo depois da regente. Elas ajudam a regente e podem mudar com o momento da vida.</p></div>
      <div><h3>Luz e sombra</h3><em>na medida ou fora dela</em><p>Na luz, a capacidade trabalha a seu favor. Na sombra, ela passou do ponto (por excesso) ou ficou sem espaço (por escassez). Sombra não é defeito: é uma capacidade pedindo ajuste.</p></div>
    </div>
    <div class="rv-sumario"><p class="rv-rotulo">Nesta edição</p><ol>${SUMARIO(regentes, !!report.experiment).map(([r, t]) => `<li><span>${r}</span>${esc(t)}</li>`).join('')}</ol></div>
    <p class="rv-miudo">${esc(report.note)}</p>
    ${rodape(n, titulo)}
  </section>`);

  // ---------- em um olhar ----------
  n++;
  const sete = [...result.capacities].filter(c => c.value !== null).sort((a, b) => b.value - a.value);
  const cartaoOlhar = (id, rotulo, grande) => `<div class="rv-olhar__item ${grande ? 'is-grande' : ''}">${arco(id)}<small>${rotulo}</small><h3>${esc(nome(id))}</h3><em>${esc(ESTADO[estadoDe(id)])}</em>${barra(valorDe(id))}</div>`;
  pags.push(`<section class="rv-pg rv-papel">
    <h2 class="rv-h2 rv-centro">A sua leitura em um olhar</h2><p class="rv-sub rv-centro">a regente e as dominantes</p>
    <div class="rv-olhar">${regentes.map(id => cartaoOlhar(id, 'Regente', true)).join('')}${dominantes.map((id, i) => cartaoOlhar(id, `${ORDINAL[i]} dominante`, false)).join('')}</div>
    <div class="rv-sete"><p class="rv-rotulo">As sete em você</p>${sete.map(c => `<div class="rv-sete__linha"><span>${esc(c.name)}</span>${barra(c.value)}<em>${esc(ESTADO[estadoDe(c.id)])}</em></div>`).join('')}</div>
    ${rodape(n, titulo)}
  </section>`);

  // ---------- cada regente: página escura + página de texto ----------
  regentes.forEach((id, k) => {
    const est = estadoDe(id), c = CONTENT[id];
    n++;
    pags.push(`<section class="rv-pg rv-escura">
      <div class="rv-escura__moldura">${grega}
        <p class="rv-escura__num">${ROMANO[k]}</p><p class="rv-escura__rot">${regentes.length > 1 ? 'Uma das suas regentes' : 'A sua deusa regente'}</p>
        ${arco(id, 'is-escuro')}
        <h2 class="rv-escura__nome">${esc(nome(id))}</h2><p class="rv-grego">${GREGO[id]}</p><p class="rv-escura__epi">${esc(EPITETO[id])}</p>
        <p class="rv-escura__estado">${esc(ESTADO[est])}</p>
        ${result.path?.story && k === 0 ? `<p class="rv-escura__caminho">${esc(result.path.story)}</p>` : ''}
        ${grega}
      </div>
    </section>`);
    n++;
    const sombra = est === 'excesso' ? SHADOWS[id].excess : est === 'escassez' ? SHADOWS[id].scarcity : null;
    pags.push(`<section class="rv-pg rv-papel">
      <header class="rv-topo"><span>${ROMANO[k]} · ${esc(nome(id))}</span>${grega}</header>
      <h3 class="rv-h3">Conhecendo ${esc(nome(id))} na luz</h3>
      <p class="rv-lead rv-capitular">${esc(c.gift)} ${esc(c.personal)}</p>
      <p>${esc(c.work)}</p>
      <p class="rv-rotulo">As forças de ${esc(nome(id))}</p>
      <ul class="rv-lista">${c.strengths.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="rv-rotulo">Onde ela floresce</p>
      <ul class="rv-lista">${c.environments.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <blockquote class="rv-citacao">${esc(c.helps)}</blockquote>
      ${sombra ? `<div class="rv-faixa"><small>O outro lado</small><em>${esc(nome(id))} ${esc(ESTADO[est])}</em></div><p>${esc(sombra)}</p><div class="rv-duas rv-duas--leve"><div><p class="rv-rotulo">O que isso custa</p><p>${esc(c.cost)}</p></div><div><p class="rv-rotulo">O que costuma piorar</p><p>${esc(c.hinders)}</p></div></div>${est === 'excesso' ? `<p class="rv-eixo"><b>Para equilibrar:</b> desenvolver ${esc(lista(OPPOSITE[id].map(nome)))}, e não combater ${esc(nome(id))} de frente. É a Regra do Eixo Oposto.</p>` : ''}` : `<div class="rv-faixa rv-faixa--clara"><small>Quando passa do ponto</small><em>O que vale observar</em></div><div class="rv-duas rv-duas--leve"><div><p class="rv-rotulo">O que pode custar</p><p>${esc(c.cost)}</p></div><div><p class="rv-rotulo">O que costuma atrapalhar</p><p>${esc(c.hinders)}</p></div></div>`}
      <div class="rv-reflexao">${grega}<small>Pergunta para reflexão</small><p>${esc(c.question)}</p>${grega}</div>
      ${rodape(n, titulo)}
    </section>`);
  });

  // ---------- dominantes ----------
  n++;
  let sec = regentes.length;
  pags.push(`<section class="rv-pg rv-papel">
    <header class="rv-topo"><span>${ROMANO[sec]} · As dominantes</span>${grega}</header>
    <h2 class="rv-h2">As suas dominantes</h2><p class="rv-sub">quem caminha ao lado de ${esc(regNomes || 'você')}</p>
    ${dominantes.length ? dominantes.map((id, i) => `<article class="rv-dom ${dominantes.length === 1 ? 'rv-dom--solo' : ''}">${arco(id)}<div>
        <small class="rv-rotulo">${ORDINAL[i]} dominante · ${esc(ESTADO[estadoDe(id)])}</small>
        <h3>${esc(nome(id))} <span class="rv-grego">${GREGO[id]}</span></h3><em>${esc(EPITETO[id])}</em>
        <p>${esc(CONTENT[id].gift)}</p><p class="rv-dom__ajuda"><b>Como ela ajuda:</b> ${esc(CONTENT[id].helps)}</p>
        <p class="rv-dom__forcas">${CONTENT[id].strengths.map(esc).join(' · ')}</p>${dominantes.length > 1 ? `<p class="rv-dom__vida">${esc(CONTENT[id].personal)}</p>` : ''}${dominantes.length === 1 ? `<p>${esc(CONTENT[id].personal)}</p><p class="rv-rotulo">Onde ela floresce</p><ul class="rv-lista">${CONTENT[id].environments.map(t => `<li>${esc(t)}</li>`).join('')}</ul>${OPPOSITE[reg]?.includes(id) && estadoDe(reg) === 'excesso' ? `<blockquote class="rv-citacao">Quando ${esc(nome(reg))} passa do ponto, é ${esc(nome(id))} quem ajuda a trazer de volta à medida.</blockquote>` : ''}` : ''}</div></article>`).join('')
      : '<p class="rv-lead">Nenhuma outra deusa se destacou na luz ao lado da regente. As suas escolhas se apoiam sobretudo nela, e a consulta ajuda a ver quem pode ganhar espaço.</p>'}
    ${rodape(n, titulo)}
  </section>`);

  // ---------- luz e sombra das sete ----------
  n++; sec++;
  const prato = (k, t, s) => { const l = report.capacities.filter(c => c.scale === k); return `<div class="rv-prato rv-prato--${k}"><b>${t}</b><small>${s}</small>${l.length ? l.map(c => `<span><img src="assets/deusas/${c.id}-busto.webp" alt="">${esc(c.name)}</span>`).join('') : '<i>nenhuma</i>'}</div>`; };
  pags.push(`<section class="rv-pg rv-papel">
    <header class="rv-topo"><span>${ROMANO[sec]} · Luz e sombra</span>${grega}</header>
    <h2 class="rv-h2">Luz e sombra das sete</h2><p class="rv-sub">quem está na medida, quem passou do ponto e quem ficou sem espaço</p>
    <div class="rv-balanca">${prato(0, 'Na sombra', 'por escassez')}${prato(1, 'Na luz', 'na medida')}${prato(2, 'Na sombra', 'por excesso')}</div>
    ${sombras.length ? sombras.map(s => `<article class="rv-sombra"><h3>${esc(s.name)} <em>${esc(ESTADO[s.tipo])}</em></h3><p>${esc(s.text)}</p>${s.tipo === 'excesso' && s.balance?.length ? `<p class="rv-sombra__eixo"><b>Para equilibrar:</b> desenvolver ${esc(lista(s.balance.map(b => b.name)))}, e não combater ${esc(s.name)} de frente (Regra do Eixo Oposto).</p>` : ''}</article>`).join('')
      : '<p class="rv-lead">Nenhuma deusa apareceu na sombra nas suas escolhas. As sete estão na medida, cada uma com o seu peso.</p>'}
    ${rodape(n, titulo)}
  </section>`);

  // ---------- as sete áreas: tabuleiro numa página, o sentido de cada papel na outra ----------
  sec++;
  const areas = report.areas;
  const papelCurto = (rot, x, cls) => x ? `<div class="rv-casa__papel ${cls}"><small>${rot}</small><b>${esc(x.name)}</b></div>` : '';
  n++;
  pags.push(`<section class="rv-pg rv-papel">
    <div class="rv-banner" style="background-image:url(${IMG}parte-integracao.jpg)"></div>
    <header class="rv-abre"><span>${ROMANO[sec]}</span><div><small>Parte ${ROMANO[sec]}</small><h2>As sete áreas da sua vida</h2>${report.areasSummary ? `<p>${esc(report.areasSummary)}</p>` : ''}</div></header>
    <div class="rv-tabuleiro">${areas.map((a, i) => `<article class="rv-casa">
      <div class="rv-casa__cab"><span>${ROMANO[i]}</span><h3>${esc(a.name)}</h3></div>
      ${a.leads ? `<img src="assets/deusas/${a.leads.id}-busto.webp" alt="">` : ''}
      ${papelCurto('Rege', a.leads, 'is-rege')}${papelCurto('Ajuda', a.helps, 'is-ajuda')}${a.hinders ? papelCurto('Pesa', a.hinders, 'is-pesa') : papelCurto('Pede espaço', a.lacks, 'is-falta')}
      ${a.confidence ? `<em>${esc(a.confidence.label)}</em>` : ''}</article>`).join('')}
      <article class="rv-casa rv-casa--legenda"><p class="rv-rotulo">Como ler</p><p><b>Rege:</b> quem decide primeiro naquela área.</p><p><b>Ajuda:</b> quem traz equilíbrio.</p><p><b>Pesa:</b> quem passou do ponto ali.</p><p><b>Pede espaço:</b> quem anda calada ali.</p></article>
    </div>
    ${rodape(n, titulo)}
  </section>`);
  // cada combinação de papel + deusa aparece uma vez, com as áreas onde acontece
  const papeis = [];
  const junta = (tipo, rot, x, area) => { if (!x) return; let p = papeis.find(q => q.tipo === tipo && q.id === x.id); if (!p) papeis.push(p = { tipo, rot, id: x.id, name: x.name, text: x.text, areas: [] }); p.areas.push(area); };
  areas.forEach(a => { junta('rege', 'rege', a.leads, a.name); junta('ajuda', 'ajuda', a.helps, a.name); if (a.hinders) junta('pesa', 'pesa', a.hinders, a.name); else junta('falta', 'pede espaço', a.lacks, a.name); });
  const ordem = { rege: 0, ajuda: 1, pesa: 2, falta: 3 };
  papeis.sort((x, y) => ordem[x.tipo] - ordem[y.tipo] || y.areas.length - x.areas.length);
  n++;
  pags.push(`<section class="rv-pg rv-papel">
    <header class="rv-topo"><span>${ROMANO[sec]} · As áreas da sua vida</span>${grega}</header>
    <h2 class="rv-h2">O que cada papel quer dizer</h2><p class="rv-sub">o mesmo papel pode se repetir em várias áreas</p>
    <div class="rv-papeis">${papeis.slice(0, 9).map(p => `<article class="rv-papelzinho is-${p.tipo}"><img src="assets/deusas/${p.id}-busto.webp" alt=""><div><small>Quando ${esc(p.name)} ${esc(p.rot)}</small><p>${esc(p.text)}</p><em>${esc(lista(p.areas))}</em></div></article>`).join('')}</div>
    ${rodape(n, titulo)}
  </section>`);

  // ---------- a seu favor e pede cuidado ----------
  n++; sec++;
  const thrive = report.environments.thrive || [], areasBoas = report.environments.thriveAreas || [];
  pags.push(`<section class="rv-pg rv-papel">
    <header class="rv-topo"><span>${ROMANO[sec]} · A seu favor</span>${grega}</header>
    <h2 class="rv-h2">A seu favor e pede cuidado</h2><div class="rv-traco"></div>
    <div class="rv-duas">
      <div class="rv-coluna rv-coluna--favor"><p class="rv-rotulo">A seu favor</p><ul class="rv-lista">${report.favor.map(f => `<li>${esc(f.text)} <small>${esc(nome(f.id))}</small></li>`).join('')}</ul></div>
      <div class="rv-coluna rv-coluna--cuidado"><p class="rv-rotulo">Pede cuidado</p><ul class="rv-lista">${report.care.length ? report.care.map(f => `<li>${esc(f.text)} <small>${esc(nome(f.id))}</small></li>`).join('') : '<li>Nada pedindo cuidado agora. Bom sinal.</li>'}</ul></div>
    </div>
    ${thrive.length ? `<div class="rv-floresce"><p class="rv-rotulo">Onde você floresce</p><ul class="rv-lista">${thrive.map(f => `<li>${esc(f.text)}</li>`).join('')}</ul>${areasBoas.length ? `<p class="rv-miudo">Áreas em que uma deusa na luz está no comando: ${esc(lista(areasBoas))}.</p>` : ''}</div>` : ''}
    ${rodape(n, titulo)}
  </section>`);

  // ---------- missão da semana ----------
  if (report.experiment) {
    n++; sec++;
    const x = report.experiment;
    pags.push(`<section class="rv-pg rv-escura rv-missao">
      <div class="rv-banner rv-banner--alto" style="background-image:url(${IMG}parte-final.jpg)"></div>
      <div class="rv-missao__texto">
        <p class="rv-escura__rot">Parte ${ROMANO[sec]} · A sua missão da semana</p>
        <h2 class="rv-escura__nome rv-escura__nome--menor">Dar espaço a ${esc(x.goddess)}</h2>
        <p class="rv-grego">${GREGO[x.id] || ''}</p>
        <p class="rv-missao__pratica">${esc(x.text)}</p>
        <p class="rv-missao__porque">${esc(x.why)}</p>
        ${grega}
        <p class="rv-missao__dica">Escolha um dia para começar. Repare no que muda, sem cobrança: a missão é um experimento, não uma prova.</p>
        <div class="rv-diario">${['O que eu percebi', 'O que ficou mais leve', 'O que eu quero repetir'].map(t => `<div><small>${t}</small><i></i><i></i></div>`).join('')}</div>
      </div>
      ${rodape(n, titulo)}
    </section>`);
  }

  // ---------- o próximo passo ----------
  n++;
  const livro = result.ebook;
  pags.push(`<section class="rv-pg rv-papel">
    <div class="rv-banner" style="background-image:url(${IMG}parte-recorte.jpg)"></div>
    <header class="rv-abre"><span>Ω</span><div><small>Epílogo</small><h2>O próximo passo</h2></div></header>
    <p class="rv-lead">${esc(report.invite)}</p>
    <div class="rv-passos">
      <a class="rv-passo" href="${ZAP}"><small>Com Yasnnajára</small><b>Consulta individual</b><p>A leitura completa do método, com a sua história, confirmada pela radiestesia.</p><span>Chamar no WhatsApp →</span></a>
      ${livro ? `<a class="rv-passo" href="https://rafaheul.github.io/metodo-deusas-demo/#no-seu-ritmo"><small>No seu ritmo</small><b>E-book de ${esc(livro.name)}</b><p>As duas sombras de ${esc(livro.name)}, com práticas para a semana.</p><span>Ver o e-book →</span></a>` : ''}
    </div>
    <p class="rv-fecho">Conhecer-se é um primeiro passo.</p>
    <div class="rv-assina"><em>Yasnnajára</em><small>Alves</small><p>Criadora do Método das Deusas</p></div>
    <p class="rv-colofao">Mapa das Deusas · leitura gerada em ${esc(data)} a partir das suas escolhas nas cenas. É uma leitura de autoconhecimento, não avaliação psicológica nem diagnóstico. Arquétipos inspirados na obra de Jean Shinoda Bolen.</p>
    ${rodape(n, titulo)}
  </section>`);

  return pags.join('\n');
}

// ---------- monta, espera as imagens e as letras, abre a janela de impressão ----------
async function imprimir(result, report, dono) {
  let box = document.getElementById('revista');
  if (!box) { box = document.createElement('div'); box.id = 'revista'; document.body.appendChild(box); }
  box.innerHTML = montar(result, report, dono);
  const imgs = [...box.querySelectorAll('img')].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })).filter(Boolean);
  const fundos = [...box.querySelectorAll('.rv-banner')].map(b => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = b.style.backgroundImage.slice(4, -1).replace(/"/g, ''); }));
  await Promise.race([Promise.all([...imgs, ...fundos, document.fonts?.ready]), new Promise(r => setTimeout(r, 8000))]);
  const pagina = document.createElement('style'); pagina.id = 'revista-pagina'; pagina.textContent = '@page{size:A4;margin:0}';
  document.head.appendChild(pagina);
  const tituloAntes = document.title;
  document.title = `Revista das Deusas${dono ? ` - ${dono}` : ''}`;
  document.documentElement.classList.add('rv-imprimindo');
  const fim = () => { document.documentElement.classList.remove('rv-imprimindo'); pagina.remove(); document.title = tituloAntes; removeEventListener('afterprint', fim); };
  addEventListener('afterprint', fim);
  window.print();
  if (!('onafterprint' in window)) setTimeout(fim, 1000);
}

// janela que pergunta o nome da capa (fica só no aparelho) e dispara a montagem
function pedir(result, report) {
  const dlg = document.getElementById('content-dialog'), alvo = document.getElementById('dialog-content');
  if (!dlg || !alvo) return imprimir(result, report, '');
  let salvo = ''; try { salvo = localStorage.getItem('revista-nome') || ''; } catch {}
  alvo.innerHTML = `<div class="rv-pedido"><img src="${IMG}${result.regents[0]?.id || 'atena'}-capa.webp" alt="" class="rv-pedido__capa">
    <div><div class="eyebrow">A SUA REVISTA EM PDF</div><h2>Que nome vai<br>na <em>capa?</em></h2>
    <p>A revista fica com o seu nome na capa. Ele fica só neste aparelho e não é enviado a ninguém.</p>
    <label class="rv-pedido__campo"><span>Seu nome (opcional)</span><input id="rv-nome" type="text" maxlength="40" autocomplete="given-name" value="${esc(salvo)}"></label>
    <button class="primary" type="button" id="rv-montar">Montar a minha revista <span aria-hidden="true"><svg class="ico"><use href="#i-seta"/></svg></span></button>
    <p class="subtle">Na janela que abrir, escolha <b>Salvar como PDF</b>. No iPhone: Imprimir, depois o botão de compartilhar e “Salvar em Arquivos”.</p></div></div>`;
  if (!dlg.open) dlg.showModal();
  // adianta o download das imagens enquanto a pessoa digita
  [result.regents[0]?.id].filter(Boolean).forEach(id => { new Image().src = `${IMG}${id}-capa.webp`; new Image().src = `${IMG}${id}-retrato.jpg`; });
  document.getElementById('rv-montar').addEventListener('click', async e => {
    const b = e.currentTarget, dono = document.getElementById('rv-nome').value.trim().replace(/\s+/g, ' ');
    try { localStorage.setItem('revista-nome', dono); } catch {}
    b.disabled = true; b.textContent = 'Montando a revista…';
    dlg.close();
    await imprimir(result, report, dono);
  });
}

window.Revista = { pedir, imprimir, montar };
