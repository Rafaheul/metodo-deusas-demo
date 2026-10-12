// Banco privado: o navegador recebe apenas publicQuestions(), sem chaves de deusa ou traço.
// v0.4: cenas com dilema (escolha "faria primeiro" + "menos faria"), afirmações de traço
// e banco de desempate da regente (lib/tiebreak.mjs). Uma opção pode ter um 4º campo: o padrão de
// dependência emocional que ela expressa (ver DEP_PATTERNS em lib/reports.mjs).
// Cenas autorais em revisão. Afirmações de traço adaptadas do IPIP (domínio público);
// a tradução não foi validada para o português.
import { DILEMMAS, AREAS } from './dilemmas.js';
export const VERSION = 'deusas-dilemas-0.4.0';
export const GODDESSES = {
  artemis: { name: 'Ártemis', axis: 'autonomia', capacity: 'Autonomia e limites', symbol: '↗' },
  atena: { name: 'Atena', axis: 'autonomia', capacity: 'Estratégia e discernimento', symbol: '◇' },
  hestia: { name: 'Héstia', axis: 'autonomia', capacity: 'Presença e centro interior', symbol: '◉' },
  hera: { name: 'Hera', axis: 'vinculo', capacity: 'Compromisso e parceria', symbol: '∞' },
  demeter: { name: 'Deméter', axis: 'vinculo', capacity: 'Cuidado e sustentação', symbol: '❧' },
  persefone: { name: 'Perséfone', axis: 'vinculo', capacity: 'Escuta e receptividade', symbol: '✧' },
  afrodite: { name: 'Afrodite', axis: 'transformacao', capacity: 'Criatividade e vitalidade', symbol: '✳' }
};
export { AREAS };
export const TRAITS = { O: 'Abertura a experiências', C: 'Organização e constância', E: 'Energia social', A: 'Cooperação', N: 'Sensibilidade ao estresse' };
export const OPTION_IDS = ['a', 'b', 'c', 'd'];
// [texto, invertido]. Quatro por traço, dois diretos e dois invertidos.
const traitRows = {
  E: [['Em encontros, costumo ser uma das pessoas que mais animam a conversa.'], ['Puxo assunto com facilidade com pessoas que acabei de conhecer.'], ['Em grupo, prefiro ficar mais na minha.', true], ['Falo pouco quando estou com gente que não conheço bem.', true]],
  A: [['Me interesso de verdade pela vida das pessoas ao meu redor.'], ['Percebo com facilidade quando alguém não está bem.'], ['Os problemas dos outros não me interessam muito.', true], ['Às vezes sou dura ou ríspida com as pessoas sem perceber.', true]],
  C: [['Costumo me preparar com antecedência para o que vou fazer.'], ['Gosto das coisas organizadas e no lugar.'], ['Costumo deixar minhas coisas espalhadas.', true], ['Esqueço de devolver as coisas ao lugar depois de usar.', true]],
  N: [['Fico estressada com facilidade.'], ['Me preocupo bastante com as coisas.'], ['Na maior parte do tempo, me sinto tranquila.', true], ['Raramente me sinto para baixo.', true]],
  O: [['Tenho uma imaginação muito viva.'], ['Ideias novas me vêm com facilidade.'], ['Assuntos muito teóricos ou abstratos não me atraem.', true], ['Prefiro o jeito conhecido de fazer as coisas a experimentar um novo.', true]]
};
const traitItems = [0, 1, 2, 3].flatMap(i => Object.entries(traitRows).map(([trait, rows]) => ({
  id: `b${trait}${i + 1}`, kind: 'trait', trait, text: rows[i][0], reverse: rows[i][1] || false
})));
const dilemmaItems = DILEMMAS.map(d => ({
  id: d.id, kind: 'dilemma', area: d.area, asks: d.asks, scene: d.scene,
  options: d.options.map(([text, goddess, mode, dep], i) => ({ id: OPTION_IDS[i], text, goddess, mode, dep: dep || false }))
}));
// Áreas intercaladas para a pessoa não perceber blocos; afirmações espalhadas por igual entre as cenas.
const byArea = Object.keys(AREAS).map(a => dilemmaItems.filter(d => d.area === a));
const interleaved = [];
for (let i = 0; i < Math.max(...byArea.map(l => l.length)); i++) for (const list of byArea) if (list[i]) interleaved.push(list[i]);
export const QUESTIONS = [];
interleaved.forEach((d, i) => {
  QUESTIONS.push(d);
  const due = Math.floor((i + 1) * traitItems.length / interleaved.length) - Math.floor(i * traitItems.length / interleaved.length);
  for (let k = 0; k < due; k++) QUESTIONS.push(traitItems[QUESTIONS.filter(q => q.kind === 'trait').length]);
});
export const DILEMMA_ITEMS = dilemmaItems;
export const TRAIT_ITEMS = traitItems;
export function publicQuestions() {
  return QUESTIONS.map(q => q.kind === 'dilemma'
    ? { id: q.id, kind: 'dilemma', area: AREAS[q.area], scene: q.scene, options: q.options.map(({ id, text }) => ({ id, text })) }
    : { id: q.id, kind: 'trait', scene: 'Pensando em como você costuma ser no dia a dia:', action: q.text });
}
