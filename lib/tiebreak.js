// Banco privado de desempate da regente (v0.4). Quando duas ou três deusas ficam
// empatadas no topo, a pessoa vê algumas telas rápidas só com as opções das finalistas.
// Cada pergunta tem uma opção por deusa, sempre na luz: o desempate mede quem rege, não sombra.
// Revisado por três leitoras com lentes diferentes; aguarda a revisão da autora.
import { GODDESSES } from './questions.js';
export const TIEBREAK_RAW = [
  { id: "tb1", prompt: "O que você protege com mais cuidado?", options: {
    artemis: "Minha liberdade de escolher meus próprios caminhos.",
    atena: "Minha clareza para entender a situação antes de agir.",
    hestia: "Meus momentos de silêncio, quando eu volto para mim.",
    hera: "Os compromissos que assumi com quem eu amo.",
    demeter: "O cuidado que eu dou e também o que eu recebo de quem eu amo.",
    persefone: "Minha sensibilidade e o que eu sinto, mesmo sem saber explicar.",
    afrodite: "Meu jeito de aproveitar a vida e as coisas que me dão prazer." } },
  { id: "tb2", prompt: "Qual destas situações mais te machucaria?", options: {
    artemis: "Ser impedida de seguir meu caminho ou de fazer minhas escolhas.",
    atena: "Ser tratada como se eu não soubesse pensar.",
    hestia: "Viver sem paz, sem um canto meu, sempre no meio do barulho.",
    hera: "Alguém quebrar um combinado sério que tinha assumido comigo.",
    demeter: "Ter meu cuidado recusado por quem eu amo.",
    persefone: "Ter meus sentimentos tratados como bobagem ou exagero.",
    afrodite: "Passar os dias sem tempo para nada que me dê prazer e alegria." } },
  { id: "tb3", prompt: "Do que você não abriria mão de jeito nenhum?", options: {
    artemis: "Da minha independência: meu dinheiro, minhas escolhas, meu caminho.",
    atena: "Da minha lucidez: ver os fatos como são, mesmo quando incomodam.",
    hestia: "Dos meus momentos sozinha, em silêncio, no meu canto.",
    hera: "Da lealdade: estar ao lado de quem eu escolhi, nos dias bons e ruins.",
    demeter: "De poder nutrir quem eu amo: comida boa, colo e apoio.",
    persefone: "Da minha intuição e do meu jeito sensível de ver a vida.",
    afrodite: "Do prazer e da beleza nas pequenas coisas do dia a dia." } },
  { id: "tb4", prompt: "O que mais te enche de energia?", options: {
    artemis: "Ter um desafio só meu e liberdade para enfrentar do meu jeito.",
    atena: "Resolver um problema difícil que estava travando todo mundo.",
    hestia: "Fazer uma coisa de cada vez, com calma e atenção total.",
    hera: "Sentir que formo um time de verdade com alguém, um contando com o outro.",
    demeter: "Cuidar de algo e ver crescer: uma planta, um projeto, uma pessoa.",
    persefone: "Uma conversa sem pressa, em que a gente vai fundo no que sente.",
    afrodite: "Viver algo que me encanta: uma música, um sabor, um lugar bonito." } },
  { id: "tb5", prompt: "O que mais te deixa orgulhosa de você?", options: {
    artemis: "Ter chegado onde cheguei com as minhas próprias pernas.",
    atena: "Ter tomado decisões inteligentes quando a situação era difícil.",
    hestia: "Ter construído um lar e uma rotina que me trazem paz.",
    hera: "Ter cumprido minha palavra e sustentado um compromisso por muitos anos.",
    demeter: "Ver alguém que eu ajudei a crescer seguindo bem a própria vida.",
    persefone: "Ter atravessado fases difíceis sem endurecer nem perder minha sensibilidade.",
    afrodite: "Ter criado algo bonito que tem a minha cara." } },
  { id: "tb6", prompt: "No fundo, o que mais dá sentido aos seus dias?", options: {
    artemis: "Ter um objetivo meu e ir atrás dele com tudo.",
    atena: "Entender bem cada situação e encontrar a melhor saída.",
    hestia: "Ter momentos quietos só meus, longe da correria.",
    hera: "Construir algo que dure junto com quem eu escolhi ter ao lado.",
    demeter: "Sentir que minha presença faz bem a quem está perto de mim.",
    persefone: "Me deixar tocar pelas pessoas e pelo que a vida traz.",
    afrodite: "Viver com intensidade e me sentir viva de verdade." } },
  { id: "tb7", prompt: "Depois de uma semana difícil, o que mais te põe de pé de novo?", options: {
    artemis: "Sair para me mexer sozinha: uma corrida, uma trilha, um treino puxado.",
    atena: "Montar um plano simples para a próxima semana.",
    hestia: "Ficar quieta em casa, com tudo em ordem e o celular longe.",
    hera: "Estar perto de quem eu escolhi e sentir que a gente segue junto.",
    demeter: "Me cuidar como cuido dos outros: comida caseira, cama cedo e colo.",
    persefone: "Escrever sobre o que senti até a semana fazer sentido para mim.",
    afrodite: "Um banho demorado, perfume, música boa e uma roupa que eu amo." } },
  { id: "tb8", prompt: "Você ganhou um dia inteiro livre, sem nenhum compromisso. O que você faz?", options: {
    artemis: "Saio sozinha para explorar um lugar que eu ainda não conheço.",
    atena: "Estudo um assunto que me intriga e anoto as ideias.",
    hestia: "Fico em casa, arrumo meu canto com calma e aproveito o silêncio.",
    hera: "Faço um programa especial com quem eu amo, só nosso.",
    demeter: "Cuido das plantas, faço um bolo e levo um pedaço para alguém.",
    persefone: "Leio um romance ou vejo um filme que me faz sentir muita coisa.",
    afrodite: "Vou a um lugar bonito, como algo delicioso e aproveito cada momento." } },
  { id: "tb9", prompt: "Quando a vida fica corrida demais, do que você sente mais falta?", options: {
    artemis: "De tempo para correr atrás dos meus próprios planos.",
    atena: "De planejar com calma, em vez de só apagar incêndio.",
    hestia: "De silêncio e de um tempo quieta no meu canto.",
    hera: "Dos programas de sempre com as pessoas que eu escolhi, só nossos.",
    demeter: "De cozinhar sem pressa e receber bem quem eu gosto.",
    persefone: "De tempo para sentir as coisas sem pressa e ouvir minha intuição.",
    afrodite: "De me arrumar, sair, dançar e sentir prazer nas coisas." } },
  { id: "tb10", prompt: "Em que momento você mais perde a noção do tempo?", options: {
    artemis: "Quando estou correndo atrás de uma meta minha e sinto que estou chegando.",
    atena: "Quando estou estudando um assunto a fundo ou montando uma estratégia.",
    hestia: "Quando faço algo calmo com toda a atenção, como meditar ou organizar meu canto.",
    hera: "Quando estou fazendo planos de futuro com as pessoas que eu amo.",
    demeter: "Quando estou ensinando alguém com paciência, até a pessoa conseguir sozinha.",
    persefone: "Quando escuto a história de alguém e me coloco no lugar da pessoa.",
    afrodite: "Quando estou dançando, criando algo com as mãos ou curtindo uma boa música." } }
];
export const MAX_DUEL = 5;
const IDS = Object.keys(GODDESSES);
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
// Letras diferentes por pergunta, para a mesma letra não indicar sempre a mesma deusa.
export const TIEBREAK = TIEBREAK_RAW.map((t, k) => {
  const order = IDS.map((_, i) => IDS[(i + k * 3) % IDS.length]);
  return { id: t.id, prompt: t.prompt, options: order.map((g, i) => ({ id: LETTERS[i], goddess: g, text: t.options[g] })) };
});
