// Saídas públicas v0.4: mapa gratuito (freeResult) e relatório completo (fullReport, pago).
// A leitura definitiva de regência e sombras continua na consulta radiestésica.
import { VERSION, GODDESSES, AREAS } from './questions.js';
import { CONTENT, SHADOWS, OPPOSITE, TRAIT_TEXT, AXES, DEPENDENCY, DEP_PATTERNS, TRAIT_POLES } from './reports.js';
import { STATE_NAMES } from './scoring.js';

const scale = (values) => { const max = Math.max(0, ...values.filter(v => v !== null)); return values.map(v => v === null ? null : max ? Math.round(v / max * 40) / 10 : 0); };
const name = id => GODDESSES[id].name;
// Lista em português: "A", "A e B", "A, B e C".
const join = list => list.length > 1 ? `${list.slice(0, -1).join(', ')} e ${list.at(-1)}` : list.join('');
const names = ids => join(ids.map(name));
// Traços que ajudam a ler cada área (mapeamento editorial, não validado).
const AREA_TRAITS = { trabalho: ['C', 'O'], dinheiro: ['C', 'N'], amor: ['A', 'N'], familia: ['A', 'C'], amizades: ['E', 'A'], pessoal: ['N', 'O'], mudancas: ['O', 'N'] };
const level = m => m === null ? null : m >= 2.75 ? 'high' : m <= 1.25 ? 'low' : 'mid';
const LEVEL_NAMES = { high: 'mais alta', mid: 'no meio', low: 'mais baixa' };
// Estados visíveis para a cliente: quatro, no vocabulário do método.
const VISIBLE_STATE = { luz: 'luz', disponivel: 'luz', discreta: 'luz', excesso: 'excesso', escassez: 'escassez', insuficiente: 'insuficiente' };
const VISIBLE_NAME = { luz: 'Na luz', excesso: 'Sombra por excesso', escassez: 'Sombra por escassez', insuficiente: 'Poucos dados' };
const METHOD_BADGE = { direto: 'Regência clara', desempate: 'Definida no desempate', empate: 'Duas regentes lado a lado', 'sem-desempate': 'Regência dividida', insuficiente: 'Poucos dados' };

// As sete medidas pela mesma conta da regente (força: "faria primeiro" soma, "menos faria" desconta metade),
// para o ranking não contradizer quem rege. As finalistas o método considera empatadas (por isso houve
// desempate), então saem com a mesma barra; quem perdeu o desempate fica marcada.
function capacityPoints(profile) {
  const values = scale(profile.gods.map(g => g.state === 'insuficiente' || g.pull === null ? null : Math.max(0, g.pull)));
  const tied = ['desempate', 'empate', 'sem-desempate'].includes(profile.path?.method) ? profile.path.finalists : [];
  const top = Math.max(0, ...values.filter(v => v !== null));
  profile.gods.forEach((g, i) => { if (tied.includes(g.id) && values[i] !== null) values[i] = top; });
  const near = profile.path?.method === 'desempate' ? tied.filter(id => id !== profile.dominant) : [];
  return profile.gods.map((g, i) => ({ id: g.id, name: g.name, capacity: g.capacity, symbol: g.symbol, value: values[i], nearRegent: near.includes(g.id),
    level: values[i] === null ? 'Poucos dados' : values[i] >= 3 ? 'Muito presente' : values[i] >= 1.5 ? 'Presente' : 'Pouco presente',
    description: CONTENT[g.id].gift, reflection: CONTENT[g.id].question }));
}
function traitStyle(profile) {
  return profile.bigFive.map(t => {
    const lv = level(t.mean), tx = TRAIT_TEXT[t.id];
    // Sensibilidade ao estresse aparece invertida como "Serenidade".
    const value = t.mean === null ? null : t.id === 'N' ? 4 - t.mean : t.mean;
    return { id: t.id, name: t.id === 'N' ? 'Serenidade' : tx.label, value: value === null ? null : Math.round(value * 10) / 10, poles: TRAIT_POLES[t.id],
      level: lv ? (t.id === 'N' ? LEVEL_NAMES[{ high: 'low', low: 'high', mid: 'mid' }[lv]] : LEVEL_NAMES[lv]) : null, text: lv ? tx[lv] : 'Faltaram respostas para descrever este traço.' };
  });
}
function regencyPath(profile) {
  const p = profile.path; if (!p) return null;
  const wins = p.duel?.wins || {};
  const total = Object.values(wins).reduce((a, b) => a + b, 0);
  const lead = p.ranking[0] ? name(p.ranking[0].id) : null;
  const story = p.method === 'direto' ? `${lead} ficou à frente já nas cenas, com folga. Não foi preciso desempate.`
    : p.method === 'desempate' ? `${names(p.finalists)} terminaram as cenas quase empatadas. Nas perguntas finais, ${name(profile.dominant)} venceu ${wins[profile.dominant]} de ${total}.`
    : p.method === 'empate' ? `${names(profile.coDominants)} seguiram lado a lado até o fim. Você tem duas regentes, e isso também diz muito sobre você.`
    : p.method === 'sem-desempate' ? `${names(p.finalists)} terminaram as cenas quase empatadas.`
    : 'Faltaram respostas para apontar uma regente.';
  return { axis: p.axis ? { id: p.axis, ...AXES[p.axis] } : null,
    ranking: p.ranking.map(r => ({ id: r.id, name: name(r.id) })),
    finalists: p.finalists.map(id => ({ id, name: name(id), wins: wins[id] ?? null })), method: p.method, badge: METHOD_BADGE[p.method], steps: p.duel?.steps.length || 0, story };
}
// Grau de certeza de quem rege cada área, para o tabuleiro nunca ficar vazio.
function confidence(a) {
  const [r0, r1] = a.ranking || [];
  if (!r0) return null;
  if (!r1 || r0.score - r1.score >= 1.5) return { kind: 'folga', label: 'Rege com folga' };
  if (r0.score > r1.score) return { kind: 'pouco', label: `Rege por pouco · ${name(r1.id)} logo atrás` };
  return { kind: 'conjunto', label: 'Empate desfeito pelo seu conjunto' };
}
function areaView(profile, a, style) {
  const leadText = id => a.id === 'trabalho' ? CONTENT[id].work : CONTENT[id].personal;
  return { id: a.id, name: a.name, answered: a.answered, total: a.total, confidence: confidence(a),
    ranking: (a.ranking || []).map(r => ({ id: r.id, name: name(r.id), first: r.first })),
    leads: a.leads ? { id: a.leads, name: name(a.leads), text: leadText(a.leads) } : null,
    helps: a.helps ? { id: a.helps, name: name(a.helps), text: CONTENT[a.helps].helps, source: a.helpsSource } : null,
    hinders: a.hinders ? { id: a.hinders, name: name(a.hinders), text: SHADOWS[a.hinders].excess } : null,
    lacks: a.lacks ? { id: a.lacks, name: name(a.lacks), text: SHADOWS[a.lacks].scarcity } : null,
    style: style ? AREA_TRAITS[a.id].map(t => style.find(s => s.id === t)).filter(s => s.level) : [] };
}
// Área de amostra no mapa gratuito: a de liderança mais clara.
function sampleAreaOf(profile) {
  const ranked = profile.areas.filter(a => a.leads && a.ranking?.length).map(a => ({ a, gap: a.ranking[0].score - (a.ranking[1]?.score ?? 0) })).sort((x, y) => y.gap - x.gap);
  return ranked[0]?.a || null;
}

export function freeResult(profile) {
  const current = profile.version === VERSION;
  const god = profile.dominant ? profile.gods.find(g => g.id === profile.dominant) : null;
  const regents = god ? [god.id] : profile.coDominants;
  const hintId = profile.scarcity[0] || null;
  // E-book: cada um trata as duas sombras da sua deusa, então vai para a deusa que apareceu na sombra
  // (a da escassez primeiro, que é a que o mapa grátis mostra; senão a do excesso). Sem sombra, nenhum.
  const bookId = profile.scarcity[0] || profile.excess[0] || null;
  const flags = [...profile.flags];
  if (!current) flags.push('Este resultado veio de uma versão anterior do questionário. Faça um novo mapa para ver a leitura atual.');
  const sample = current ? sampleAreaOf(profile) : null;
  const others = profile.areas.filter(a => a.leads && regents.length && !regents.includes(a.leads)).length;
  return {
    version: profile.version, locked: true,
    dominant: god ? { id: god.id, name: god.name, capacity: god.capacity, symbol: god.symbol } : null,
    coDominants: profile.coDominants.map(name),
    regents: regents.map(id => ({ id, name: name(id), capacity: GODDESSES[id].capacity, symbol: GODDESSES[id].symbol,
      card: { gift: CONTENT[id].gift, excess: SHADOWS[id].excess, balance: OPPOSITE[id].map(name), question: CONTENT[id].question } })),
    headline: god ? `Hoje, quem rege as suas escolhas é ${god.name}.` : profile.coDominants.length ? `${names(profile.coDominants)} regem as suas escolhas juntas.` : 'Suas escolhas se dividem entre várias deusas.',
    definition: 'Regente é a deusa que mais comanda as suas escolhas hoje: a que você mais escolheu para fazer primeiro e menos deixou por último. Quando duas ou três ficam quase empatadas, o desempate decide.',
    summary: god ? CONTENT[god.id].gift : 'Suas respostas mostram diferentes capacidades se revezando. Explore o desenho e veja quais se parecem mais com você.',
    reflection: god ? CONTENT[god.id].question : 'Qual dessas capacidades você mais reconhece no seu dia a dia?',
    shadowHint: hintId ? { id: hintId, name: name(hintId), text: `Uma deusa parece estar com pouco espaço nas suas escolhas: ${name(hintId)}.` } : null,
    capacities: capacityPoints(profile),
    path: regencyPath(profile),
    sampleArea: sample ? areaView(profile, sample, null) : null,
    lockedAreas: profile.areas.filter(a => a.id !== sample?.id).map(a => ({ id: a.id, name: a.name, answered: a.answered })),
    othersRule: regents.length ? others : null,
    toc: { areas: profile.areas.length, shadows: profile.excess.length + profile.scarcity.length },
    note: 'Este é o seu mapa inicial. A confirmação da regência e das sombras por escassez ou excesso é feita na consulta radiestésica com Yasnnajára Alves.',
    methodology: 'O mapa mostra quanto cada deusa apareceu nas suas escolhas, em comparação com as outras. Não existe nota ideal, e aparecer pouco não é defeito.',
    flags,
    ebook: bookId ? { id: bookId, name: name(bookId), shadow: profile.scarcity[0] ? 'escassez' : 'excesso', title: `${name(bookId)}: um primeiro encontro`, capacity: GODDESSES[bookId].capacity, excerpt: CONTENT[bookId].gift, practice: CONTENT[bookId].experiment } : null
  };
}

export function fullReport(profile) {
  const style = traitStyle(profile);
  const lightIds = profile.gods.filter(g => g.state === 'luz').map(g => g.id);
  const areas = profile.areas.map(a => {
    const values = scale(Object.keys(GODDESSES).map(id => a.presence[id]));
    return { ...areaView(profile, a, style), dependency: profile.dependency?.areas?.[a.id] || 0,
      chart: Object.keys(GODDESSES).map((id, i) => ({ id, name: name(id), value: a.answered >= 3 ? values[i] : null })) };
  });
  const firstExcess = profile.excess[0];
  const practiceFrom = firstExcess ? OPPOSITE[firstExcess][0] : profile.scarcity[0] || profile.dominant;
  const item = (text, id) => ({ text, id });
  const uniq = list => list.filter((x, i) => list.findIndex(y => y.text === x.text) === i);
  const favorIds = lightIds.length ? lightIds : [profile.dominant].filter(Boolean);
  const d = profile.dependency || { level: 'insuficiente', areas: {}, patterns: {}, goddesses: {}, evidence: [] };
  const lv = DEPENDENCY.levels[d.level];
  const leadsCount = {};
  for (const a of areas) if (a.leads) leadsCount[a.leads.id] = (leadsCount[a.leads.id] || 0) + 1;
  const topLeader = Object.entries(leadsCount).sort((x, y) => y[1] - x[1])[0];
  const thrive = areas.filter(a => a.leads && lightIds.includes(a.leads.id)).map(a => a.name);
  return {
    capacities: profile.gods.map(g => { const v = VISIBLE_STATE[g.state]; return { id: g.id, name: g.name, state: v, stateName: VISIBLE_NAME[v], detail: STATE_NAMES[g.state],
      text: g.state === 'excesso' ? SHADOWS[g.id].excess : g.state === 'escassez' ? SHADOWS[g.id].scarcity : CONTENT[g.id].gift,
      // Posição na balança: 0 = de menos, 1 = na medida, 2 = demais.
      scale: v === 'escassez' ? 0 : v === 'excesso' ? 2 : v === 'luz' ? 1 : null }; }),
    allies: profile.allies.map(name),
    excess: profile.excess.map(id => ({ id, name: name(id), text: SHADOWS[id].excess, balance: OPPOSITE[id].map(b => ({ id: b, name: name(b) })) })),
    scarcity: profile.scarcity.map(id => ({ id, name: name(id), text: SHADOWS[id].scarcity })),
    areas,
    areasSummary: topLeader ? `${name(topLeader[0])} rege ${topLeader[1]} das ${areas.length} áreas.` : null,
    favor: uniq([...favorIds.flatMap(id => CONTENT[id].strengths.map(t => item(t, id))), ...[profile.dominant, ...lightIds].filter(Boolean).map(id => item(CONTENT[id].helps, id))]).slice(0, 7),
    care: uniq([...profile.excess.map(id => item(CONTENT[id].cost, id)), ...profile.scarcity.map(id => item(SHADOWS[id].scarcity, id)), ...[...profile.excess, profile.dominant].filter(Boolean).map(id => item(CONTENT[id].hinders, id))]).slice(0, 6),
    environments: { thrive: uniq([profile.dominant, ...lightIds].filter(Boolean).flatMap(id => CONTENT[id].environments.map(t => item(t, id)))).slice(0, 5),
      drain: uniq(profile.excess.map(id => item(CONTENT[id].hinders, id))), thriveAreas: thrive },
    style,
    dependency: { level: d.level, levelName: lv.name, text: lv.text, definition: DEPENDENCY.definition, principle: DEPENDENCY.principle, practice: DEPENDENCY.practice,
      first: d.first ?? 0, offered: d.scenes ?? 0, zone: { baixo: 0, moderado: 1, alto: 2 }[d.level] ?? null, support: d.level === 'alto',
      areas: Object.entries(d.areas || {}).sort((x, y) => y[1] - x[1]).map(([id, n]) => ({ id, name: AREAS[id], count: n })),
      patterns: Object.entries(d.patterns || {}).sort((x, y) => y[1] - x[1]).map(([id, n]) => ({ id, label: DEP_PATTERNS[id] || DEP_PATTERNS.geral, count: n })),
      goddesses: Object.entries(d.goddesses || {}).sort((x, y) => y[1] - x[1]).map(([id, n]) => ({ id, name: name(id), count: n })),
      evidence: (d.evidence || []).slice(0, 3).map(e => ({ text: e.text, area: AREAS[e.area], label: DEP_PATTERNS[e.pattern] || DEP_PATTERNS.geral })) },
    summary: {
      regent: profile.dominant ? name(profile.dominant) : profile.coDominants.length ? names(profile.coDominants) : null,
      allies: profile.allies.map(name), excess: profile.excess.map(name), scarcity: profile.scarcity.map(name),
      dependency: lv.name, thrive: thrive[0] || null },
    experiment: practiceFrom ? { goddess: name(practiceFrom), id: practiceFrom, text: CONTENT[practiceFrom].experiment,
      why: firstExcess ? `Pela Regra do Eixo Oposto, o excesso de ${name(firstExcess)} se equilibra desenvolvendo ${name(practiceFrom)}, e não combatendo ${name(firstExcess)} de frente.` : `Um primeiro passo para dar mais espaço a ${name(practiceFrom)}.` } : null,
    invite: (() => {
      const parts = [profile.dominant ? `${name(profile.dominant)} na regência` : null,
        profile.excess.length ? `${names(profile.excess)} na sombra por excesso` : null,
        profile.scarcity.length ? `${names(profile.scarcity)} na sombra por escassez` : null].filter(Boolean);
      return parts.length ? `Seu relatório mostrou ${parts.join(', ')}. Na consulta, Yasnnajára olha essa leitura junto com a sua história e confirma pela radiestesia.` : 'Na consulta, Yasnnajára olha essa leitura junto com a sua história e confirma pela radiestesia.';
    })(),
    note: 'Este relatório é uma leitura de autoconhecimento a partir das suas escolhas nas cenas. Ele não é avaliação psicológica nem diagnóstico. A confirmação da regência e das sombras acontece na consulta radiestésica.'
  };
}
