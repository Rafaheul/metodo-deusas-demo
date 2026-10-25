// API local da versão estática: substitui o servidor, guardando o mapa só neste aparelho.
import { publicQuestions, VERSION } from './lib/questions.js';
import { score, duelFor } from './lib/scoring.js';
import { freeResult, fullReport } from './lib/entrance.js';
const CONFIG = {"version":"deusas-dilemas-0.4.0","demoMode":true,"retentionDays":30,"contacts":{"whatsapp":"","instagram":"","website":""},"ebooks":{"artemis":{"checkoutUrl":"https://pay.hotmart.com/C108188273G","priceBRL":9.99,"title":"Um Caminho Só Seu"},"atena":{"checkoutUrl":"https://pay.hotmart.com/E108188311S","priceBRL":9.99,"title":"A Estratégia e a Armadura"},"hestia":{"checkoutUrl":"https://pay.hotmart.com/Q108188340A","priceBRL":9.99,"title":"Um Centro Para Voltar"},"hera":{"checkoutUrl":"https://pay.hotmart.com/H108188363R","priceBRL":9.99,"title":"Parceria Sem Se Perder"},"demeter":{"checkoutUrl":"https://pay.hotmart.com/Q108188384G","priceBRL":9.99,"title":"Quem Cuida de Você"},"persefone":{"checkoutUrl":"https://pay.hotmart.com/N108188399J","priceBRL":9.99,"title":"O Que Você Quer"},"afrodite":{"checkoutUrl":"https://pay.hotmart.com/E108188420M","priceBRL":9.99,"title":"O Prazer Que Ficou Para Depois"}},"videos":{"artemis":{"src":"","poster":"","captions":""},"atena":{"src":"","poster":"","captions":""},"hestia":{"src":"","poster":"","captions":""},"hera":{"src":"","poster":"","captions":""},"demeter":{"src":"","poster":"","captions":""},"persefone":{"src":"","poster":"","captions":""},"afrodite":{"src":"","poster":"","captions":""}},"report":{"checkoutUrl":"","priceBRL":null},"consultationUrl":"","methodUrl":""};
const KEY = 'deusas-estatico-resultado', DAYS = 30;
const load = () => { try { const r = JSON.parse(localStorage.getItem(KEY)); return r && r.expires > Date.now() ? r : null; } catch { return null; } };
const save = r => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} };
const drop = () => { try { localStorage.removeItem(KEY); } catch {} };
let memory = null; // se o navegador não deixar guardar, o mapa vive só nesta aba
const current = () => load() || memory;
async function call(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const stale = () => { throw new Error('O questionário foi atualizado. Recarregue a página para começar a nova versão.'); };
  if (url === '/api/config') return structuredClone(CONFIG);
  if (url === '/api/questions') return { version: VERSION, questions: publicQuestions() };
  if (url === '/api/current') return { id: current()?.id || null };
  if (url === '/api/tiebreak' && method === 'POST') { if (body.version !== VERSION) stale(); return duelFor(body.answers, Array.isArray(body.duel) ? body.duel : []); }
  if (url === '/api/results' && method === 'POST') {
    if (body.version !== VERSION) stale();
    if (body.consent !== true || body.adult !== true) throw new Error('Confirme sua idade e a autorização para gerar o resultado.');
    const profile = score(body.answers, Array.isArray(body.duel) ? body.duel : []);
    const r = { id: crypto.randomUUID(), profile, access: 'locked', expires: Date.now() + DAYS * 864e5 };
    memory = r; save(r);
    return { id: r.id, result: freeResult(profile), report: null };
  }
  const m = url.match(/^\/api\/results\/([a-f0-9-]{36})(\/unlock)?$/);
  const r = current();
  if (m && r && r.id === m[1]) {
    if (method === 'DELETE') { memory = null; drop(); return { deleted: true }; }
    const fresh = r.profile.version === VERSION;
    if (method === 'POST' && m[2] && fresh) { r.access = 'unlocked'; memory = r; save(r); }
    return { id: r.id, result: freeResult(r.profile), report: fresh && r.access === 'unlocked' ? fullReport(r.profile) : null };
  }
  if (m) throw new Error('Este resultado não está disponível neste navegador.');
  throw new Error('Endereço não encontrado.');
}
window.DeusasLocal = { call };
