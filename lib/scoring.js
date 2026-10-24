// Apuração v0.4. Cortes provisórios para o piloto: precisam ser calibrados com respostas reais.
import { GODDESSES, QUESTIONS, AREAS, OPTION_IDS, VERSION } from './questions.js';
import { TIEBREAK, MAX_DUEL } from './tiebreak.js';
const ratio = (a, b) => b ? a / b : null;
const IDS = Object.keys(GODDESSES);
// Margem para considerar duas deusas empatadas no topo e máximo de finalistas no desempate.
export const FINAL_MARGIN = 0.15;
const MAX_FINALISTS = 3;

export function validateAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) throw new Error('Responda a todas as situações, usando “não vivi algo parecido” quando necessário.');
  const byId = new Map(QUESTIONS.map(q => [q.id, q])), seen = new Set();
  for (const a of answers) {
    const q = a && byId.get(a.id);
    if (!q || seen.has(a.id)) throw new Error('Há uma resposta inválida. Revise o questionário.');
    seen.add(a.id);
    const ok = (a.first === null && a.last === null) ||
      (OPTION_IDS.includes(a.first) && OPTION_IDS.includes(a.last) && a.first !== a.last);
    if (!ok) throw new Error('Em cada cena, escolha o que faria primeiro e o que menos faria.');
  }
}

// Estados no vocabulário do método: luz, ou sombra por excesso / por escassez.
// "disponivel" e "discreta" ficam na luz para a cliente: pouca presença não é problema.
export function classify(g) {
  if (g.offered < 8 || g.askedAnswered < 3) return 'insuficiente';
  if (g.excess !== null && g.firstE >= 3 && g.excess >= 0.35 && g.excess >= (g.light ?? 0)) return 'excesso';
  if (g.demand !== null && g.demand <= 0.2 && (g.presence <= 0.2 || g.rejection >= 0.35)) return 'escassez';
  if (g.light !== null && g.light >= 0.3) return 'luz';
  if (g.demand !== null && g.demand >= 0.4) return 'disponivel';
  return 'discreta';
}
export const STATE_NAMES = { luz: 'Na luz', excesso: 'Na sombra por excesso', escassez: 'Na sombra por escassez', disponivel: 'Disponível quando a vida pede', discreta: 'Mais discreta', insuficiente: 'Sem dados suficientes' };

function tally(dilemmas) {
  const t = Object.fromEntries(IDS.map(id => [id, { offeredL: 0, offeredE: 0, firstL: 0, firstE: 0, lastL: 0, lastE: 0, asked: 0, askedAnswered: 0, askedHit: 0, askedRejected: 0 }]));
  for (const { q, first, last } of dilemmas) {
    t[q.asks].asked++;
    if (first === null) continue;
    t[q.asks].askedAnswered++;
    for (const o of q.options) {
      const g = t[o.goddess];
      g[`offered${o.mode}`]++;
      if (o.id === first) g[`first${o.mode}`]++;
      if (o.id === last) g[`last${o.mode}`]++;
      if (o.goddess === q.asks && o.mode === 'L') {
        if (o.id === first) g.askedHit++;
        if (o.id === last) g.askedRejected++;
      }
    }
  }
  return t;
}
// Força de cada deusa nas escolhas: "faria primeiro" soma, "menos faria" desconta metade.
const pullOf = c => ratio(c.firstL + c.firstE - 0.5 * (c.lastL + c.lastE), c.offeredL + c.offeredE);

// ---------- Desempate da regente (estilo Akinator) ----------
export function finalistsOf(gods, coverage) {
  if (coverage < 0.5) return [];
  const ranked = gods.filter(g => g.pull !== null && g.state !== 'insuficiente').sort((a, b) => b.pull - a.pull);
  if (!ranked.length) return [];
  return ranked.filter(g => ranked[0].pull - g.pull <= FINAL_MARGIN).slice(0, MAX_FINALISTS).map(g => g.id);
}
// Refaz o desempate a partir das respostas. Elimina quem fica 2 escolhas atrás da líder.
export function replayDuel(finalists, duel = []) {
  if (!Array.isArray(duel)) throw new Error('Desempate inválido.');
  const wins = Object.fromEntries(finalists.map(g => [g, 0]));
  let alive = [...finalists];
  const steps = [];
  const finished = () => alive.length <= 1 || steps.length >= Math.min(MAX_DUEL, TIEBREAK.length);
  for (const answer of duel) {
    if (finished()) throw new Error('Desempate inválido.');
    const prompt = TIEBREAK[steps.length];
    const option = answer && answer.id === prompt.id ? prompt.options.find(o => o.id === answer.pick) : null;
    if (!option || !alive.includes(option.goddess)) throw new Error('Desempate inválido.');
    wins[option.goddess]++;
    const lead = Math.max(...alive.map(g => wins[g]));
    alive = alive.filter(g => lead - wins[g] < 2);
    steps.push({ id: prompt.id, goddess: option.goddess, alive: [...alive] });
  }
  const done = finished();
  const best = Math.max(0, ...alive.map(g => wins[g]));
  const top = alive.filter(g => wins[g] === best);
  return { finalists, wins, alive, steps, done, winner: done && top.length === 1 ? top[0] : null, tied: done && top.length > 1 ? top : [],
    next: done ? null : { id: TIEBREAK[steps.length].id, prompt: TIEBREAK[steps.length].prompt, options: TIEBREAK[steps.length].options.filter(o => alive.includes(o.goddess)).map(({ id, text }) => ({ id, text })), step: steps.length + 1, max: Math.min(MAX_DUEL, TIEBREAK.length) } };
}

function profileCore(answers) {
  validateAnswers(answers);
  const byId = new Map(answers.map(a => [a.id, a]));
  const dilemmas = QUESTIONS.filter(q => q.kind === 'dilemma').map(q => ({ q, first: byId.get(q.id).first, last: byId.get(q.id).last }));
  const t = tally(dilemmas);
  const gods = Object.entries(GODDESSES).map(([id, meta]) => {
    const c = t[id], offered = c.offeredL + c.offeredE;
    const g = { id, ...meta, ...c, offered,
      presence: ratio(c.firstL + c.firstE, offered), light: ratio(c.firstL, c.offeredL), excess: ratio(c.firstE, c.offeredE),
      rejection: ratio(c.lastL + c.lastE, offered), demand: ratio(c.askedHit, c.askedAnswered), pull: pullOf(c) };
    g.state = classify(g);
    return g;
  });
  const answered = dilemmas.filter(d => d.first !== null).length;
  return { byId, dilemmas, gods, answered, coverage: answered / dilemmas.length };
}
// Usado pela API do desempate durante o questionário.
export function duelFor(answers, duel = []) {
  const core = profileCore(answers);
  const finalists = finalistsOf(core.gods, core.coverage);
  if (finalists.length <= 1) { if (duel.length) throw new Error('Desempate inválido.'); return { needed: false, done: true, next: null }; }
  const state = replayDuel(finalists, duel);
  return { needed: true, done: state.done, next: state.next, finalists: finalists.length };
}

export function score(answers, duel = []) {
  const { dilemmas, gods, answered, coverage } = profileCore(answers);
  const godById = Object.fromEntries(gods.map(g => [g.id, g]));
  const finalists = finalistsOf(gods, coverage);
  let dominant = null, coDominants = [], method = 'insuficiente', duelState = null;
  if (finalists.length === 1) { dominant = finalists[0]; method = 'direto'; if (duel.length) throw new Error('Desempate inválido.'); }
  else if (finalists.length > 1) {
    duelState = replayDuel(finalists, duel);
    if (duelState.winner) { dominant = duelState.winner; method = 'desempate'; }
    else { coDominants = duelState.done ? duelState.tied : finalists; method = duelState.done ? 'empate' : 'sem-desempate'; }
  }
  const excess = gods.filter(g => g.state === 'excesso').sort((a, b) => b.excess - a.excess).map(g => g.id);
  const scarcity = gods.filter(g => g.state === 'escassez').sort((a, b) => a.demand - b.demand || a.presence - b.presence).map(g => g.id);
  const lightRanked = gods.filter(g => g.state === 'luz').sort((a, b) => b.light - a.light);
  const allies = lightRanked.filter(g => g.id !== dominant).slice(0, 2).map(g => g.id);

  // Caminho da escolha, para mostrar como se chegou à regente.
  // O eixo mostrado é o da regente (ou da mais forte), para o caminho ficar coerente.
  const ranked = gods.filter(g => g.pull !== null).sort((a, b) => b.pull - a.pull);
  const path = { axis: godById[dominant || coDominants[0] || ranked[0]?.id]?.axis || null,
    ranking: ranked.map(g => ({ id: g.id, pull: g.pull })),
    finalists, method, duel: duelState ? { wins: duelState.wins, steps: duelState.steps.map(s => ({ id: s.id, goddess: s.goddess, alive: s.alive })) } : null };

  // Áreas: sempre aponta quem rege, quem ajuda e o que atrapalha ou falta. Empates são resolvidos
  // pelo desenho geral da própria pessoa, nunca por uma ordem fixa das deusas.
  const globalRank = g => godById[g].pull ?? -9;
  const areas = Object.entries(AREAS).map(([id, name]) => {
    const all = dilemmas.filter(d => d.q.area === id), sub = all.filter(d => d.first !== null);
    const at = tally(sub);
    const rows = IDS.map(g => { const c = at[g]; return { g, first: c.firstL + c.firstE, last: c.lastL + c.lastE, light: c.firstL, excess: c.firstE, offered: c.offeredL + c.offeredE, askedMiss: c.askedAnswered - c.askedHit, asked: c.askedAnswered }; });
    const best = (key, tie, min = 0) => { const r = [...rows].filter(x => key(x) > min).sort((a, b) => key(b) - key(a) || tie(b.g) - tie(a.g)); return r[0]?.g || null; };
    const areaScore = r => r.first - 0.5 * r.last;
    const ranking = sub.length ? [...rows].sort((a, b) => areaScore(b) - areaScore(a) || globalRank(b.g) - globalRank(a.g)).map(r => ({ id: r.g, score: areaScore(r), first: r.first })) : [];
    const leads = sub.length >= 2 ? ranking[0].id : null;
    // Quem ajuda é sempre outra deusa, não a própria regente da área.
    const others = g => g !== leads;
    const helpsHere = best(r => others(r.g) ? r.light : 0, g => godById[g].light ?? 0);
    const helpsElse = allies.find(others) || (dominant && others(dominant) ? dominant : null) || IDS.filter(g => others(g) && (godById[g].light ?? 0) > 0).sort((a, b) => godById[b].light - godById[a].light)[0] || ranking.find(r => others(r.id))?.id || null;
    const hindersHere = best(r => r.excess, g => godById[g].excess ?? 0);
    const lacks = best(r => r.asked ? r.askedMiss / r.asked : 0, g => -(godById[g].demand ?? 1));
    return { id, name, answered: sub.length, total: all.length, leads, ranking: ranking.slice(0, 3),
      helps: helpsHere || helpsElse, helpsSource: helpsHere ? 'area' : 'geral',
      hinders: hindersHere, lacks: hindersHere ? null : lacks,
      // Em cada área: em quantas das cenas respondidas a deusa foi a primeira escolha.
      presence: Object.fromEntries(rows.map(r => [r.g, sub.length ? r.first / sub.length : null])) };
  });

  // Dependência emocional: opções marcadas pela autora (cuidar por obrigação, ceder a quem ganha mais...).
  // Compara com o acaso: numa cena com k opções marcadas, quem escolhe ao acaso pega uma delas em k/4 das vezes.
  const dep = { offered: 0, scenes: 0, expected: 0, first: 0, last: 0, areas: {}, patterns: {}, goddesses: {}, evidence: [] };
  for (const { q, first, last } of dilemmas) {
    if (first === null) continue;
    const marked = q.options.filter(o => o.dep).length;
    if (marked) { dep.scenes++; dep.expected += marked / q.options.length; }
    for (const o of q.options) if (o.dep) {
      dep.offered++;
      if (o.id === last) dep.last++;
      if (o.id !== first) continue;
      const pattern = typeof o.dep === 'string' ? o.dep : 'geral';
      dep.first++; dep.areas[q.area] = (dep.areas[q.area] || 0) + 1; dep.patterns[pattern] = (dep.patterns[pattern] || 0) + 1;
      dep.goddesses[o.goddess] = (dep.goddesses[o.goddess] || 0) + 1;
      dep.evidence.push({ scene: q.id, area: q.area, text: o.text, pattern, goddess: o.goddess });
    }
  }
  dep.rate = ratio(dep.first, dep.scenes);
  // Cortes provisórios (calibrar no piloto): moderado a partir de 1,4 vez o acaso; alto a partir de 1,8 vez.
  dep.vsChance = dep.expected ? Math.round(dep.first / dep.expected * 100) / 100 : null;
  dep.level = dep.scenes < 4 ? 'insuficiente' : dep.first >= 4 && dep.vsChance >= 1.8 ? 'alto' : dep.first >= 3 && dep.vsChance >= 1.4 ? 'moderado' : 'baixo';

  const flags = [];
  if (answered < dilemmas.length * 0.7) flags.push('Muitas cenas ficaram sem resposta. O mapa mostra só o que foi possível ler.');
  if (!dominant && coDominants.length) flags.push('Duas deusas dividem o comando nas suas escolhas. Isso também é um resultado: a consulta ajuda a ver qual delas pesa mais hoje.');
  else if (!dominant) flags.push('Nenhuma deusa ficou claramente à frente. O mapa mostra o conjunto, sem escolher uma à força.');
  return { version: VERSION, gods, dominant, coDominants, allies, excess, scarcity, areas, dependency: dep, path, flags, coverage };
}
