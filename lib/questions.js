// Banco privado: o navegador recebe apenas publicQuestions(), sem as chaves de deusa.
// v0.4: cenas com dilema (escolha "faria primeiro" + "menos faria") e banco de desempate da
// regente (lib/tiebreak.mjs). As 20 afirmações do Big Five saíram em 24/10/2026: não entravam no
// cálculo das deusas, só em "Seu jeito de funcionar", que saiu do relatório junto.
// Uma opção pode ter um 4º campo: o padrão de dependência emocional que ela expressa (ver DEP_PATTERNS em lib/reports.mjs).
// Cenas autorais em revisão.
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
export const OPTION_IDS = ['a', 'b', 'c', 'd'];
const dilemmaItems = DILEMMAS.map(d => ({
  id: d.id, kind: 'dilemma', area: d.area, asks: d.asks, scene: d.scene,
  options: d.options.map(([text, goddess, mode, dep], i) => ({ id: OPTION_IDS[i], text, goddess, mode, dep: dep || false }))
}));
// Áreas intercaladas para a pessoa não perceber blocos.
const byArea = Object.keys(AREAS).map(a => dilemmaItems.filter(d => d.area === a));
export const QUESTIONS = [];
for (let i = 0; i < Math.max(...byArea.map(l => l.length)); i++) for (const list of byArea) if (list[i]) QUESTIONS.push(list[i]);
export const DILEMMA_ITEMS = dilemmaItems;
export function publicQuestions() {
  return QUESTIONS.map(q => ({ id: q.id, kind: 'dilemma', area: AREAS[q.area], scene: q.scene, options: q.options.map(({ id, text }) => ({ id, text })) }));
}
