// Banco privado v0.4: cenas com dilema e quatro reações igualmente aceitáveis.
// Cada reação tem chave [deusa, modo]: 'L' = na luz, 'E' = na sombra por excesso.
// 4º campo opcional: padrão de dependência emocional (cuidar, ceder, agradar, abrir-mao, aprovacao, necessaria, culpa).
// Regra de chave da dependência: cuidar ou assumir o que é do outro por dever = Deméter E; manter o vínculo
// ou a paz acima de si, ou ceder a quem ganha mais = Hera E; deixar a opinião, o humor ou a aprovação do
// outro decidir = Perséfone E. Dependência nunca fica na luz. Cenas t7, d7, r7, f7, a7, p7, m7: novas na v0.4.
// `asks` = capacidade que a cena pede. A sombra por escassez é lida pela ausência
// dessa capacidade quando ela é pedida. Rascunho autoral para revisão de Yasnnajára Alves.
// Ordem das reações aqui = a, b, c, d. A tela embaralha a ordem de exibição.
export const AREAS = {
  trabalho: 'Trabalho',
  dinheiro: 'Dinheiro',
  amor: 'Relação amorosa',
  familia: 'Família',
  amizades: 'Amizades e grupos',
  pessoal: 'Tempo pessoal e corpo',
  mudancas: 'Mudanças e decisões'
};

export const DILEMMAS = [
  // ── TRABALHO ────────────────────────────────────────────
  { id: 't1', area: 'trabalho', asks: 'atena',
    scene: 'Faltam dois dias para uma entrega grande da sua equipe. Uma colega te chama no privado: a parte dela está atrasada, o filho dela está doente e o chefe ainda não sabe de nada.',
    options: [
      ['Fico até mais tarde e faço parte do trabalho dela, sem comentar com ninguém.', 'demeter', 'E', 'cuidar'],
      ['Sento com ela, vemos o que dá para entregar e o que precisa de mais prazo, e levamos isso juntas ao chefe.', 'atena', 'L'],
      ['Ofereço ajuda numa parte específica até amanhã à tarde. O resto continua com ela.', 'artemis', 'L'],
      ['Pergunto como ela está e deixo que ela resolva do jeito dela.', 'persefone', 'E']
    ] },
  { id: 't2', area: 'trabalho', asks: 'artemis',
    scene: 'Você está no meio de uma tarefa que exige concentração. Pela terceira vez no dia, uma pessoa da equipe aparece pedindo “só uma ajudinha rápida” em algo que é responsabilidade dela.',
    options: [
      ['Ajudo. Quero manter um bom clima com a equipe.', 'hera', 'E', 'agradar'],
      ['Digo que agora não consigo e marco um horário no fim do dia para ver isso com ela.', 'artemis', 'L'],
      ['Ajudo, e aproveito para mostrar o passo a passo para ela conseguir fazer sozinha da próxima vez.', 'demeter', 'L'],
      ['Coloco o fone e fico mais séria, para ela entender sem eu precisar falar nada.', 'hestia', 'E']
    ] },
  { id: 't3', area: 'trabalho', asks: 'afrodite',
    scene: 'Você trabalha há anos do mesmo jeito. Surge a chance de liderar um projeto novo, diferente de tudo o que já fez, com mais visibilidade e também mais risco.',
    options: [
      ['Aceito. Era exatamente disso que eu estava sentindo falta.', 'afrodite', 'L'],
      ['Peço mais detalhes e fico analisando por semanas antes de ter certeza.', 'atena', 'E'],
      ['Indico alguém com mais experiência. Não me sinto pronta para aparecer tanto agora.', 'hestia', 'E'],
      ['Converso em casa sobre o impacto na nossa rotina antes de responder.', 'hera', 'L']
    ] },
  { id: 't4', area: 'trabalho', asks: 'hestia',
    scene: 'Seu dia de trabalho virou uma sequência de mensagens, reuniões e urgências dos outros. São quatro da tarde e você ainda não fez a única coisa que realmente importava hoje.',
    options: [
      ['Sigo respondendo o que chega. Amanhã eu recupero.', 'persefone', 'E'],
      ['Desligo as notificações por uma hora e faço só aquela tarefa.', 'hestia', 'L'],
      ['Fico até mais tarde para dar conta de tudo.', 'atena', 'E'],
      ['Escolho duas mensagens para responder e aviso os outros que retorno amanhã.', 'artemis', 'L']
    ] },
  { id: 't5', area: 'trabalho', asks: 'hera',
    scene: 'Você e uma colega dividem um projeto há meses. Ultimamente ela tem feito menos a parte dela, e você tem coberto sem dizer nada.',
    options: [
      ['Continuo cobrindo. Uma hora ela percebe.', 'demeter', 'E', 'cuidar'],
      ['Chamo ela para conversar e refazemos a divisão do que cada uma faz.', 'hera', 'L'],
      ['Passo a fazer só a minha parte e deixo o atraso dela aparecer.', 'artemis', 'E'],
      ['Me afasto um pouco dela e passo a falar só o necessário.', 'hestia', 'E']
    ] },
  { id: 't6', area: 'trabalho', asks: 'demeter',
    scene: 'Uma pessoa nova entrou na sua equipe e está perdida. Ninguém foi escolhido para ensinar, e você já está com bastante coisa na sua mesa.',
    options: [
      ['Ofereço um horário fixo por semana para tirar as dúvidas dela.', 'demeter', 'L'],
      ['Monto um documento com o passo a passo das tarefas e envio para ela.', 'atena', 'L'],
      ['Espero a liderança resolver. Ensinar não é minha função.', 'artemis', 'E'],
      ['Observo de longe como ela se vira antes de me aproximar.', 'hestia', 'E']
    ] },
  { id: 't7', area: 'trabalho', asks: 'persefone',
    scene: 'Você entregou um trabalho que te deixou orgulhosa. Sua chefe devolve tudo cheio de pedidos de mudança e quer a nova versão até sexta.',
    options: [
      ['Passo a noite refazendo tudo, até não sobrar nada para ela apontar.', 'atena', 'E'],
      ['Releio os comentários tentando ver o trabalho pelos olhos dela.', 'persefone', 'L'],
      ['Refaço do zero com uma ideia nova. Remendar o que já fiz me desanima.', 'afrodite', 'E'],
      ['Fecho o arquivo e só volto aos comentários amanhã, com a cabeça mais calma.', 'hestia', 'L']
    ] },
  // ── DINHEIRO ────────────────────────────────────────────
  { id: 'd1', area: 'dinheiro', asks: 'artemis',
    scene: 'Entrou um dinheiro extra que você não esperava. Na mesma semana, sua irmã comenta que o mês dela está bem apertado.',
    options: [
      ['Separo uma parte para um plano meu antes de qualquer outra coisa.', 'artemis', 'L'],
      ['Ofereço ajuda à minha irmã antes de ela pedir. Se eu tenho, tenho que ajudar.', 'demeter', 'E', 'cuidar'],
      ['Deixo tudo parado na conta até ter certeza do melhor uso.', 'atena', 'E'],
      ['Aproveito e gasto logo uma boa parte comigo. Dinheiro extra é para curtir.', 'afrodite', 'E']
    ] },
  { id: 'd2', area: 'dinheiro', asks: 'atena',
    scene: 'Você quer fazer um curso caro que pode mudar sua carreira. Ele começa no mês que vem, e o desconto da inscrição termina hoje à noite.',
    options: [
      ['Pago agora. Oportunidade assim não volta.', 'afrodite', 'E'],
      ['Vejo quanto posso pagar por mês sem apertar as contas e decido com esse número.', 'atena', 'L'],
      ['Converso com quem divide as contas comigo sobre como isso afeta nossos planos.', 'hera', 'L'],
      ['Deixo para outra turma. Não sei se é o momento de investir em mim.', 'hestia', 'E']
    ] },
  { id: 'd3', area: 'dinheiro', asks: 'demeter',
    scene: 'Uma amiga próxima pede dinheiro emprestado pela segunda vez. Da primeira, ela demorou muito para devolver, e vocês nunca falaram sobre isso.',
    options: [
      ['Ajudo com um valor que posso perder sem me apertar, e digo isso a ela.', 'demeter', 'L'],
      ['Digo que desta vez não dá, sem explicar muito.', 'artemis', 'E'],
      ['Antes de responder, converso com ela sobre o que aconteceu da primeira vez.', 'hera', 'L'],
      ['Empresto, mas fico chateada e não digo nada.', 'persefone', 'E', 'agradar']
    ] },
  { id: 'd4', area: 'dinheiro', asks: 'afrodite',
    scene: 'Faz meses que você só gasta com contas e com os outros. Passando por uma loja, você vê algo bonito para você, num preço que cabe no bolso.',
    options: [
      ['Compro. Faz tempo que eu não faço nada só para mim.', 'afrodite', 'L'],
      ['Não compro. Se alguém de casa precisa de algo, eu fico para depois.', 'demeter', 'E', 'abrir-mao'],
      ['Espero alguns dias para ver se ainda vou querer.', 'hestia', 'L'],
      ['Compro, mas escondo a sacola para ninguém em casa reclamar.', 'hera', 'E', 'agradar']
    ] },
  { id: 'd5', area: 'dinheiro', asks: 'hestia',
    scene: 'Chega uma cobrança alta que você não esperava. O coração acelera e a primeira vontade é resolver tudo imediatamente.',
    options: [
      ['Pago na hora, para me livrar logo do problema.', 'afrodite', 'E'],
      ['Respiro, guardo o boleto e olho com calma no dia seguinte.', 'hestia', 'L'],
      ['Ligo para a empresa para entender de onde veio o valor antes de pagar.', 'atena', 'L'],
      ['Resolvo tudo sozinha e nem conto em casa.', 'artemis', 'E']
    ] },
  { id: 'd6', area: 'dinheiro', asks: 'persefone',
    scene: 'Uma conhecida apresenta uma oportunidade de renda extra. Os números parecem bons, mas algo no jeito dela de falar te deixa com um pé atrás.',
    options: [
      ['Confio no meu incômodo e digo que não tenho interesse agora.', 'persefone', 'L'],
      ['Peço tudo por escrito e analiso com calma antes de responder.', 'atena', 'L'],
      ['Entro logo. Dá vontade de tentar algo novo.', 'afrodite', 'E'],
      ['Digo que vou pensar e vou adiando a resposta por semanas.', 'hestia', 'E']
    ] },
  { id: 'd7', area: 'dinheiro', asks: 'hera',
    scene: 'Em casa, quem ganha mais é quem cuida de todo o dinheiro. Você entrega a sua parte todo mês, mas não sabe direito quanto entra, quanto sai e quanto sobra.',
    options: [
      ['Deixo como está. Eu confio, e assim não preciso me preocupar com isso.', 'persefone', 'E', 'ceder'],
      ['Proponho que a gente olhe junto as contas da casa, uma vez por mês.', 'hera', 'L'],
      ['Pergunto se está pesando cuidar disso tudo e ofereço uma mão.', 'demeter', 'L'],
      ['Gasto o que sobra do meu dinheiro com o que me dá prazer. A vida é agora.', 'afrodite', 'E']
    ] },
  // ── RELAÇÃO AMOROSA ─────────────────────────────────────
  { id: 'r1', area: 'amor', asks: 'hera',
    scene: 'A pessoa com quem você se relaciona esqueceu, de novo, um combinado importante entre vocês. Pediu desculpas, mas é a terceira vez neste mês.',
    options: [
      ['Aceito as desculpas e passo a lembrar eu mesma dos nossos combinados.', 'demeter', 'E', 'cuidar'],
      ['Digo que isso é importante para mim e proponho um jeito de não esquecermos mais.', 'hera', 'L'],
      ['Paro de combinar coisas com ela e passo a resolver sozinha.', 'artemis', 'E'],
      ['Fico mais quieta por uns dias, até ela perceber que fiquei chateada.', 'hestia', 'E']
    ] },
  { id: 'r2', area: 'amor', asks: 'hestia',
    scene: 'Seu par recebe uma proposta de trabalho em outra cidade e pergunta o que você acha. Você tem trabalho, amigos e uma rotina onde mora hoje.',
    options: [
      ['Digo na hora que vou junto. Onde meu par estiver, é a minha casa.', 'hera', 'E', 'abrir-mao'],
      ['Peço uns dias para entender o que eu quero antes de responder.', 'hestia', 'L'],
      ['Pergunto o que ele sente com essa proposta antes de dizer o que eu penso.', 'persefone', 'L'],
      ['Digo que ele deve ir se quiser. Eu fico, e a gente vê como fica.', 'artemis', 'E']
    ] },
  { id: 'r3', area: 'amor', asks: 'afrodite',
    scene: 'A relação está boa, mas virou rotina: trabalho, casa, série e cama. Você sente falta de alguma coisa, mas não sabe bem do quê.',
    options: [
      ['Planejo algo diferente para nós dois neste fim de semana.', 'afrodite', 'L'],
      ['Concluo que é normal e que não vale a pena mexer nisso agora.', 'atena', 'E'],
      ['Invisto mais nos meus próprios projetos. A relação está bem.', 'artemis', 'E'],
      ['Puxo uma conversa sobre o que cada um está sentindo falta.', 'hera', 'L']
    ] },
  { id: 'r4', area: 'amor', asks: 'persefone',
    scene: 'Seu par anda mais calado há uma semana. Quando você pergunta, a resposta é sempre “está tudo bem”.',
    options: [
      ['Fico mais perto e disponível, sem cobrar uma explicação.', 'persefone', 'L'],
      ['Pergunto de novo, de outros jeitos, até descobrir o que está acontecendo.', 'hera', 'E'],
      ['Cuido de tudo em casa para ele ficar mais tranquilo.', 'demeter', 'E', 'cuidar'],
      ['Sigo minha rotina normalmente e deixo claro que estou aqui se quiser conversar.', 'artemis', 'L']
    ] },
  { id: 'r5', area: 'amor', asks: 'artemis',
    scene: 'No começo da relação, você fazia uma atividade de que gostava muito duas vezes por semana. Aos poucos, foi deixando para ficar mais tempo com seu par. Hoje você sente falta.',
    options: [
      ['Volto para a atividade e combino com meu par os dias que são meus.', 'artemis', 'L'],
      ['Deixo para quando a relação estiver mais tranquila.', 'hera', 'E', 'abrir-mao'],
      ['Pergunto ao meu par se ele se importa antes de decidir.', 'persefone', 'E', 'aprovacao'],
      ['Procuro uma versão nova dessa atividade, que me anime ainda mais.', 'afrodite', 'L']
    ] },
  { id: 'r6', area: 'amor', asks: 'atena',
    scene: 'Vocês vão comprar um carro juntos. Seu par já escolheu o modelo e está empolgado, mas você acha caro para o momento.',
    options: [
      ['Mostro as contas e proponho outro modelo, ou mais tempo para juntar.', 'atena', 'L'],
      ['Concordo. Ele está tão feliz que não quero estragar.', 'persefone', 'E', 'agradar'],
      ['Deixo ele decidir. A maior parte do dinheiro é dele mesmo.', 'hera', 'E', 'ceder'],
      ['Peço uns dias para pensar no que eu realmente acho antes de responder.', 'hestia', 'L']
    ] },
  { id: 'r7', area: 'amor', asks: 'demeter',
    scene: 'Vocês dois tiveram um dia pesado. À noite, seu par começa a desabafar sobre o dia, e você também estava precisando falar do seu.',
    options: [
      ['Escuto e guardo o meu desabafo para outro dia. Não quero pesar na relação.', 'hera', 'E', 'agradar'],
      ['Proponho sair para jantar. Lá a gente se distrai e nem precisa falar do dia.', 'afrodite', 'E'],
      ['Escuto um pouco e depois digo que hoje eu também preciso de colo.', 'demeter', 'L'],
      ['Peço uns minutos sozinha no quarto antes de a gente conversar.', 'hestia', 'L']
    ] },
  // ── FAMÍLIA ─────────────────────────────────────────────
  { id: 'f1', area: 'familia', asks: 'hera',
    scene: 'Almoço de domingo na casa da sua mãe. Todo mundo chega, ninguém ajuda na cozinha, e ela já parece cansada.',
    options: [
      ['Assumo a cozinha. Se eu não fizer, ninguém faz.', 'demeter', 'E', 'cuidar'],
      ['Chamo duas pessoas pelo nome e dividimos as tarefas.', 'hera', 'L'],
      ['Fico na sala. Da outra vez fui eu, hoje é a vez dos outros.', 'artemis', 'E'],
      ['Ajudo um pouco e passo o almoço incomodada, sem falar nada.', 'persefone', 'E', 'agradar']
    ] },
  { id: 'f2', area: 'familia', asks: 'demeter',
    scene: 'Um jovem da família que mora com você (filho, sobrinho, irmão mais novo) esqueceu um trabalho da escola que é para amanhã. São dez da noite.',
    options: [
      ['Fico por perto para tirar dúvidas, mas quem faz o trabalho é ele.', 'demeter', 'L'],
      ['Explico que agora o problema é dele e vou dormir.', 'artemis', 'E'],
      ['Monto com ele um plano do que dá para fazer até meia-noite.', 'atena', 'L'],
      ['Deixo ele se virar e fico acordada, preocupada, sem dizer nada.', 'persefone', 'E']
    ] },
  { id: 'f3', area: 'familia', asks: 'artemis',
    scene: 'Sua família marcou uma viagem e conta com você. Você tinha planejado usar aqueles dias para um projeto seu que vem adiando há meses.',
    options: [
      ['Vou na viagem. O projeto espera.', 'hera', 'E', 'abrir-mao'],
      ['Explico que desta vez não vou, e por quê.', 'artemis', 'L'],
      ['Vou só nos últimos dias, depois de adiantar o projeto.', 'atena', 'L'],
      ['Vou, mas passo a viagem pensando no projeto.', 'persefone', 'E']
    ] },
  { id: 'f4', area: 'familia', asks: 'persefone',
    scene: 'Sua mãe faz um comentário sobre a sua vida que te magoa. Fala como se fosse brincadeira, na frente de todo mundo.',
    options: [
      ['Percebo o que senti e, mais tarde, digo a ela que aquilo me magoou.', 'persefone', 'L'],
      ['Rio junto para não criar clima ruim.', 'hera', 'E', 'agradar'],
      ['Mudo de assunto com calma e depois decido se vale a pena conversar.', 'hestia', 'L'],
      ['Penso que ela é assim mesmo e deixo para lá.', 'atena', 'E']
    ] },
  { id: 'f5', area: 'familia', asks: 'atena',
    scene: 'Seus pais estão envelhecendo e vão precisar de mais cuidado. No grupo da família, cada irmão dá uma opinião diferente e ninguém decide nada.',
    options: [
      ['Faço uma lista do que eles precisam e proponho uma divisão clara.', 'atena', 'L'],
      ['Digo que eu cuido de tudo. Ficaria com culpa se deixasse para os outros.', 'demeter', 'E', 'culpa'],
      ['Espero alguém tomar a frente, para não parecer que estou mandando.', 'hestia', 'E'],
      ['Ligo para cada irmão e tento deixar todo mundo de acordo.', 'hera', 'L']
    ] },
  { id: 'f6', area: 'familia', asks: 'hestia',
    scene: 'É fim de ano e a casa está cheia de parentes há cinco dias. Você está cansada e com saudade do seu silêncio.',
    options: [
      ['Saio para uma caminhada sozinha, mesmo que alguém estranhe.', 'hestia', 'L'],
      ['Aguento calada até irem embora. Não quero que ninguém se sinta mal.', 'persefone', 'E', 'agradar'],
      ['Organizo passeios para todo mundo ficar ocupado.', 'atena', 'E'],
      ['Aviso que vou descansar uma hora no quarto e volto depois.', 'artemis', 'L']
    ] },
  { id: 'f7', area: 'familia', asks: 'afrodite',
    scene: 'Hoje à noite tem um programa que você espera há meses, como um show ou um passeio. À tarde, alguém da família pede sua ajuda numa tarefa que tomaria a sua noite.',
    options: [
      ['Ajudo. Se alguém da família precisa, o meu programa espera.', 'demeter', 'E', 'cuidar'],
      ['Combino de fazermos juntos amanhã cedo, cada um com a sua parte.', 'hera', 'L'],
      ['Vou ao meu programa como planejado e aproveito cada minuto.', 'afrodite', 'L'],
      ['Deixo uma lista detalhada do que fazer e fico conferindo pelo celular.', 'atena', 'E']
    ] },
  // ── AMIZADES E GRUPOS ───────────────────────────────────
  { id: 'a1', area: 'amizades', asks: 'persefone',
    scene: 'Numa roda de amigas, uma delas conta uma conquista. Todas comemoram, mas você percebe que ela está com o olhar triste.',
    options: [
      ['Mais tarde, mando uma mensagem perguntando como ela está de verdade.', 'persefone', 'L'],
      ['Fico perto dela no resto do encontro, mesmo sem perguntar nada.', 'demeter', 'L'],
      ['Comemoro junto e puxo outro assunto animado para levantar o clima.', 'afrodite', 'E'],
      ['Comemoro junto. Não cabe a mim interpretar o que ela sente.', 'atena', 'E']
    ] },
  { id: 'a2', area: 'amizades', asks: 'artemis',
    scene: 'Seu grupo de amigas sempre escolhe o mesmo restaurante, e você não gosta dele. Hoje vão marcar de novo.',
    options: [
      ['Sugiro outro lugar e digo que gostaria de variar.', 'artemis', 'L'],
      ['Vou. O importante é estar com elas.', 'hera', 'E'],
      ['Pesquiso três opções e mando no grupo para votarmos.', 'atena', 'L'],
      ['Digo que não vou desta vez, sem explicar.', 'hestia', 'E']
    ] },
  { id: 'a3', area: 'amizades', asks: 'demeter',
    scene: 'Uma amiga está passando por uma separação e te liga todos os dias, por horas. Você quer estar perto, mas está exausta.',
    options: [
      ['Combino com ela um horário fixo para conversarmos e me dedico a ela nesse tempo.', 'demeter', 'L'],
      ['Paro de atender por uns dias para respirar.', 'artemis', 'E'],
      ['Escuto com atenção e digo, com carinho, que também estou cansada.', 'persefone', 'L'],
      ['Atendo sempre. Amiga de verdade não some numa hora dessas.', 'hera', 'E', 'cuidar']
    ] },
  { id: 'a4', area: 'amizades', asks: 'afrodite',
    scene: 'Você é convidada para uma festa em que vai conhecer pouca gente. Está cansada da semana, mas faz tempo que não sai.',
    options: [
      ['Vou e me deixo aproveitar, mesmo sem conhecer quase ninguém.', 'afrodite', 'L'],
      ['Fico em casa. Vou estar cansada e não vou aproveitar.', 'hestia', 'E'],
      ['Vou, mesmo cansada. Não quero decepcionar quem me convidou.', 'hera', 'E', 'agradar'],
      ['Combino comigo de ficar duas horas e volto cedo.', 'artemis', 'L']
    ] },
  { id: 'a5', area: 'amizades', asks: 'hera',
    scene: 'Você faz parte de um grupo (trabalho voluntário, igreja, academia, curso) que começou a se desorganizar. As pessoas faltam e ninguém fala nada.',
    options: [
      ['Proponho uma conversa com o grupo para combinarmos como seguir.', 'hera', 'L'],
      ['Assumo as tarefas de quem falta para o grupo não acabar.', 'demeter', 'E', 'cuidar'],
      ['Saio do grupo sem muito alarde.', 'artemis', 'E'],
      ['Crio uma escala e passo a cobrar cada pessoa.', 'atena', 'E']
    ] },
  { id: 'a6', area: 'amizades', asks: 'atena',
    scene: 'Uma amiga pede sua opinião sobre um negócio que ela quer abrir. Você vê vários problemas no plano.',
    options: [
      ['Aponto os problemas com exemplos e sugiro o que ela poderia testar antes.', 'atena', 'L'],
      ['Digo que ela vai conseguir. Ela precisa de apoio agora.', 'demeter', 'E'],
      ['Me empolgo com a ideia e já começo a sugerir nome, logo e cores.', 'afrodite', 'E'],
      ['Pergunto o que ela mais quer com esse negócio antes de dar minha opinião.', 'persefone', 'L']
    ] },
  { id: 'a7', area: 'amizades', asks: 'hestia',
    scene: 'Suas amigas querem fazer uma festa grande no seu aniversário, com muita gente. Você gosta do carinho, mas ainda não sabe se é isso que quer.',
    options: [
      ['Topo a festa. É o meu dia, e eu adoro ser celebrada por todo mundo.', 'afrodite', 'E'],
      ['Agradeço e proponho um jantar pequeno, só com as mais próximas.', 'hestia', 'L'],
      ['Aceito, mas assumo a organização para tudo sair do meu jeito.', 'atena', 'E'],
      ['Pergunto o que elas estão imaginando antes de dizer o que eu prefiro.', 'persefone', 'L']
    ] },
  // ── TEMPO PESSOAL E CORPO ───────────────────────────────
  { id: 'p1', area: 'pessoal', asks: 'hestia',
    scene: 'Seu sábado finalmente ficou livre. Na sexta à noite, uma amiga manda mensagem: “bora fazer alguma coisa amanhã?”. Você esperava esse dia para descansar.',
    options: [
      ['Fico em casa e uso o dia para fazer as coisas sem pressa.', 'hestia', 'L'],
      ['Aceito, mas proponho algo mais leve, que também me faça bem.', 'afrodite', 'L'],
      ['Aceito, porque sei que ela está precisando sair.', 'demeter', 'E', 'cuidar'],
      ['Digo que sim. Descanso outro dia.', 'persefone', 'E']
    ] },
  { id: 'p2', area: 'pessoal', asks: 'afrodite',
    scene: 'Você comprou uma roupa linda para um evento. No dia, diante do espelho, ela parece “demais”.',
    options: [
      ['Troco por algo mais discreto. Prefiro não chamar atenção.', 'hestia', 'E'],
      ['Vou com ela. Foi para isso que comprei.', 'afrodite', 'L'],
      ['Mando uma foto para uma amiga e faço o que ela disser.', 'persefone', 'E', 'aprovacao'],
      ['Vou com ela, mas passo a noite conferindo se está tudo no lugar.', 'atena', 'E']
    ] },
  { id: 'p3', area: 'pessoal', asks: 'demeter',
    scene: 'Você está com dor nas costas há semanas. Sabe que precisa ir ao médico, mas a agenda está cheia de compromissos com os outros.',
    options: [
      ['Marco a consulta e remarco um compromisso dos outros para caber.', 'demeter', 'L'],
      ['Pesquiso tudo sobre o sintoma na internet antes de decidir se vou.', 'atena', 'E'],
      ['Espero alguém insistir muito para eu ir.', 'persefone', 'E', 'aprovacao'],
      ['Aviso em casa que nesta semana preciso de um horário só para isso.', 'artemis', 'L']
    ] },
  { id: 'p4', area: 'pessoal', asks: 'persefone',
    scene: 'Você passou por uma fase difícil e agora as coisas se acalmaram. Mesmo assim, às vezes vem uma tristeza sem motivo claro.',
    options: [
      ['Deixo a tristeza estar ali e escrevo ou converso sobre ela.', 'persefone', 'L'],
      ['Encho o dia de atividades para não pensar nisso.', 'atena', 'E'],
      ['Compro alguma coisa ou saio para me animar.', 'afrodite', 'E'],
      ['Peço colo a alguém de confiança.', 'demeter', 'L']
    ] },
  { id: 'p5', area: 'pessoal', asks: 'hera',
    scene: 'Você prometeu a si mesma que ia caminhar três vezes por semana. Já se passaram duas semanas e você foi uma vez só.',
    options: [
      ['Combino com uma amiga de irmos juntas, sempre nos mesmos dias.', 'hera', 'L'],
      ['Desisto por enquanto. Agora não é o momento.', 'hestia', 'E'],
      ['Diminuo para uma caminhada curta, sempre depois do café da manhã.', 'atena', 'L'],
      ['Me cobro bastante e prometo que a semana que vem vai ser diferente.', 'artemis', 'E']
    ] },
  { id: 'p6', area: 'pessoal', asks: 'artemis',
    scene: 'Você está num jantar em família. Já comeu bem, mas insistem para você repetir e ainda comer a sobremesa.',
    options: [
      ['Agradeço e digo que estou satisfeita, mesmo com a insistência.', 'artemis', 'L'],
      ['Repito para não chatear quem cozinhou com tanto carinho.', 'demeter', 'E', 'agradar'],
      ['Aceito só a sobremesa, porque está com uma cara ótima.', 'afrodite', 'L'],
      ['Como tudo e depois fico me sentindo mal comigo mesma.', 'hera', 'E']
    ] },
  { id: 'p7', area: 'pessoal', asks: 'atena',
    scene: 'Na última consulta, o médico pediu mudanças na sua rotina: dormir mais cedo, se mexer mais e comer melhor. Você saiu animada e decidida a mudar.',
    options: [
      ['Compro roupa de treino e me inscrevo em duas aulas para começar com tudo.', 'afrodite', 'E'],
      ['Crio um momento calmo antes de dormir para ouvir o que meu corpo pede.', 'hestia', 'L'],
      ['Encaixo as mudanças no tempo que sobrar depois de dar conta de todo mundo.', 'demeter', 'E', 'abrir-mao'],
      ['Começo só pela caminhada, em dias fixos, e deixo o resto para depois.', 'atena', 'L']
    ] },
  // ── MUDANÇAS E DECISÕES ─────────────────────────────────
  { id: 'm1', area: 'mudancas', asks: 'persefone',
    scene: 'Você encerrou uma etapa importante da vida: um emprego, uma relação, os filhos ficando independentes. Os primeiros dias depois disso são estranhos e silenciosos.',
    options: [
      ['Me ofereço logo para ajudar alguém. Me sinto bem quando sou útil.', 'demeter', 'E', 'necessaria'],
      ['Fico um tempo com esse vazio e observo o que aparece.', 'persefone', 'L'],
      ['Começo algo que eu sempre quis fazer e nunca tinha espaço.', 'afrodite', 'L'],
      ['Me recolho e fico revendo o que eu poderia ter feito diferente.', 'hestia', 'E']
    ] },
  { id: 'm2', area: 'mudancas', asks: 'atena',
    scene: 'Você recebe duas propostas de trabalho: uma estável, com salário menor, e outra mais arriscada, com chance de crescer. Precisa responder em três dias.',
    options: [
      ['Comparo as duas numa folha: dinheiro, tempo, risco e o que eu quero daqui a dois anos.', 'atena', 'L'],
      ['Escolho a que meu coração mandar. Depois vejo o resto.', 'afrodite', 'E'],
      ['Peço a opinião de três pessoas que admiro e vou com o que elas indicarem.', 'persefone', 'E', 'aprovacao'],
      ['Fico com a estável. Arriscar agora seria egoísmo com quem conta comigo.', 'demeter', 'E', 'culpa']
    ] },
  { id: 'm3', area: 'mudancas', asks: 'hestia',
    scene: 'Tudo na sua vida está mudando ao mesmo tempo: casa, trabalho e rotina. Todo mundo dá conselhos sobre o que você deveria fazer.',
    options: [
      ['Reservo um tempo sozinha para ouvir o que eu mesma penso.', 'hestia', 'L'],
      ['Sigo o conselho da pessoa que mais me ajuda. Não quero parecer ingrata.', 'persefone', 'E', 'ceder'],
      ['Peço ajuda prática a duas pessoas de confiança para dividir o que precisa ser feito.', 'demeter', 'L'],
      ['Resolvo tudo de uma vez, na mesma semana, para acabar logo.', 'artemis', 'E']
    ] },
  { id: 'm4', area: 'mudancas', asks: 'afrodite',
    scene: 'Você sempre quis aprender algo artístico: pintar, cantar, dançar ou escrever. Abriu uma turma perto de casa, mas você se acha velha ou sem talento para começar agora.',
    options: [
      ['Me inscrevo e vou, sem cobrar resultado.', 'afrodite', 'L'],
      ['Deixo para quando eu tiver mais tempo.', 'hestia', 'E'],
      ['Pesquiso tudo sobre o curso e a professora antes de decidir.', 'atena', 'E'],
      ['Vou se uma amiga for comigo.', 'persefone', 'E']
    ] },
  { id: 'm5', area: 'mudancas', asks: 'hera',
    scene: 'Você assumiu um compromisso de longo prazo, como um curso, um projeto ou uma sociedade. Na metade do caminho, ficou difícil e menos animador.',
    options: [
      ['Converso com quem está envolvido para ver como ajustar e continuar.', 'hera', 'L'],
      ['Termino de qualquer jeito. Eu não deixo nada pela metade.', 'artemis', 'E'],
      ['Saio e começo algo novo que me anime mais.', 'afrodite', 'E'],
      ['Paro um momento para lembrar por que comecei, e decido com calma.', 'hestia', 'L']
    ] },
  { id: 'm6', area: 'mudancas', asks: 'demeter',
    scene: 'Uma pessoa da família vai precisar morar com você por um tempo, depois de uma cirurgia. Você trabalha o dia todo.',
    options: [
      ['Organizo a casa e divido os cuidados com outros parentes.', 'demeter', 'L'],
      ['Assumo tudo sozinha. Família de verdade é para essas horas.', 'hera', 'E', 'cuidar'],
      ['Converso com a pessoa sobre como ela quer ser cuidada antes de organizar qualquer coisa.', 'persefone', 'L'],
      ['Aceito, mas aviso que não vou poder me envolver muito.', 'artemis', 'E']
    ] },
  { id: 'm7', area: 'mudancas', asks: 'artemis',
    scene: 'Há anos você pensa em mudar de profissão. Surgiu uma vaga de iniciante na área que você quer, pagando quase o mesmo que hoje. As pessoas mais próximas de você acham que não é uma boa ideia.',
    options: [
      ['Deixo passar. Não vale a pena ir contra quem eu amo por isso.', 'hera', 'E', 'abrir-mao'],
      ['Me candidato. É um plano meu, e explico para elas como vou me organizar.', 'artemis', 'L'],
      ['Antes de decidir, sento com elas e escuto o medo de cada uma.', 'persefone', 'L'],
      ['Me empolgo e já conto para todo mundo, antes mesmo de mandar o currículo.', 'afrodite', 'E']
    ] }
];
