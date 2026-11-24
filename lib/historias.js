// Histórias da revista (23/11/2026): o lado de identificação, para a pessoa se ler no arquétipo.
// Regra do método mantida: a deusa dá nome a uma capacidade. Os textos dizem "quando Atena rege",
// "talvez você se reconheça", e nunca "você é Atena".
// Os mitos são recontados com palavras próprias, a partir da mitologia grega (domínio público).
// Cada deusa tem duas partes:
//   regente: epigrafe, mito (texto longo), retrato, areas, estados (luz, excesso, escassez), perguntas
//   dom: a página de dominante (empresta, mito curto, reconhece) e par[regente] = as duas juntas
// Notas de fonte respeitadas: Atena é pragmática (não paralisa analisando); o "sim" que não sabe
// dizer não é de Deméter; viver do olhar do outro é de Perséfone, não de Afrodite.

export const HISTORIAS = {
  // ====================================================================== ATENA
  atena: {
    epigrafe: 'Atena não nasceu pequena. Saiu da cabeça do pai já adulta, já pronta, já de armadura.',
    mito: {
      titulo: 'A deusa que nasceu pronta',
      texto: [
        'Antes de Atena, havia Métis, a deusa do bom conselho. Ela esperava um filho de Zeus quando um oráculo avisou que a criança seria mais sábia que o pai. Com medo de perder o trono, Zeus engoliu Métis inteira. Meses depois veio uma dor de cabeça que nenhum deus conseguia aliviar. Hefesto, o ferreiro, abriu a cabeça de Zeus com um golpe de machado, e de lá saltou Atena: adulta, de elmo e lança, com um grito de guerra que fez o Olimpo tremer.',
        'Ela não conheceu colo de mãe. Cresceu ao lado do pai, como a filha em quem ele mais confiava, e se sentia mais à vontade entre os heróis e as suas estratégias do que entre as outras deusas.',
        'Quando Atenas ainda não tinha nome, ela disputou a cidade com Poseidon. Ele bateu o tridente na rocha e fez brotar uma fonte, mas a água era salgada. Ela plantou uma oliveira, que dava sombra, alimento, óleo para a lamparina e madeira para o fogo. A cidade escolheu o que servia à vida de todo dia, e ganhou o nome dela.',
        'Atena também era a deusa da tecelagem e dos trabalhos feitos à mão. E era a conselheira dos heróis: deu a Perseu o escudo polido com que ele venceu a Medusa e acompanhou Ulisses nos vinte anos de volta para casa, sempre com uma saída na hora certa. A coruja, que enxerga no escuro, ficou sendo a sua ave.'
      ],
      destaque: 'Entre a fonte e a oliveira, Atena escolhe o que funciona.',
      leitura: 'No mito, Atena pula a infância: nasce adulta e armada, sem colo. Em muitas mulheres guiadas por ela, a história se parece. Cresceram cedo, entenderam antes de sentir, aprenderam a resolver antes de pedir. A armadura veio junto, e por muito tempo ajudou.'
    },
    retrato: {
      abre: 'Quando Atena rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a que perguntava por quê. A que desmontava as coisas para ver como funcionavam, lia tudo o que encontrava e ficava mais à vontade conversando com os adultos do que brincando de casinha. Talvez tenha sido próxima do pai, ou de alguém que admirava pelo que sabia fazer.'],
        ['A jovem', 'O caminho costuma ser escolhido pela cabeça: o curso que dá futuro, o emprego que faz sentido, a amiga que entende de planilha. Enquanto outras se perdiam em paixões, você fazia planos. E muitas vezes os planos davam certo.'],
        ['A mulher', 'Hoje, é para você que as pessoas ligam quando a coisa aperta. No trabalho, você enxerga o problema antes dos outros. Em casa, a lista está na sua cabeça. Você decide rápido, explica bem e raramente perde a calma. O que pouca gente vê é o cansaço de estar sempre um passo à frente.']
      ],
      reconhece: [
        'Prefiro resolver a reclamar.',
        'Quando alguém chora perto de mim, a minha primeira reação é procurar uma solução.',
        'Tenho pouca paciência com quem decide só pela emoção.',
        'Já me chamaram de fria, e isso doeu mais do que eu mostrei.',
        'Confio mais nos fatos do que nos sentimentos, inclusive nos meus.',
        'Fico inquieta quando não sei o que vai acontecer.',
        'Me sinto mais à vontade numa reunião do que numa roda de desabafo.',
        'Admiro quem sabe o que está fazendo.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Atena já trabalha por você.'
    },
    areas: {
      trabalho: 'É o território natural dela. Você organiza, prioriza e entrega. O cuidado é não virar a pessoa que resolve tudo e, por isso, recebe tudo.',
      dinheiro: 'Você gosta de saber para onde vai cada real. Planilha, meta e reserva dão segurança. Gastar com o que não tem utilidade custa mais do que deveria.',
      amor: 'Você escolhe com a cabeça e ama com lealdade, e admira quem a faz pensar. O desafio é deixar o outro chegar perto do que você sente, e não só do que você pensa.',
      familia: 'Você organiza a festa, lembra do remédio e resolve a papelada. Às vezes a família conta tanto com a sua competência que esquece de perguntar como você está.',
      amizades: 'Poucas amizades, escolhidas a dedo, com conversas de verdade. Você é a amiga do bom conselho. Pedir colo costuma ser bem mais difícil do que oferecer uma saída.',
      pessoal: 'O corpo e o descanso costumam ficar para depois. Parar parece tempo perdido, até o dia em que o cansaço decide por você.',
      mudancas: 'Você atravessa mudanças com plano A, B e C. O que desestabiliza não é a mudança: é não ter controle sobre ela.'
    },
    estados: {
      luz: {
        titulo: 'Quando Atena está na medida',
        cena: 'Uma terça-feira comum. Chega um problema no trabalho e você não se apavora: separa o que é urgente, pede ajuda a quem sabe, decide e segue. À noite, alguém de casa conta um dia difícil, e você escuta até o fim antes de dar qualquer conselho.',
        protege: 'Na luz, Atena protege o seu tempo e as suas escolhas. Você sabe o que quer e encontra o caminho mais curto até lá.',
        custa: 'Quase nada, desde que ela saiba a hora de sair de cena. Nem tudo na vida pede estratégia.',
        volta: 'Para continuar na medida, vale manter por perto o que não tem utilidade nenhuma: um prazer, uma conversa sem pauta, uma tarde sem plano.'
      },
      excesso: {
        titulo: 'A armadura que não sai',
        cena: 'Ela chega em casa e continua no trabalho. Responde mensagens no jantar, corrige o filho antes de ouvir, explica ao marido por que ele está errado. Quando a amiga desabafa, ela já tem três soluções prontas. Um dia alguém pergunta: e você, como está? Ela responde que está tudo sob controle. E está mesmo. Só que, lá dentro, faz tempo que ela não sabe o que sente.',
        protege: 'Essa armadura nasceu para proteger. Ela evita que você seja pega desprevenida, exposta ou vista como incapaz. Em algum momento da sua história, isso foi necessário.',
        custa: 'O custo é a distância. As pessoas admiram, mas não chegam perto. E o que não é sentido não vai embora: costuma voltar como cansaço, irritação ou noites mal dormidas.',
        volta: 'Atena não volta à medida com mais controle. Ela volta quando outras deusas ganham espaço. Não se briga com a armadura: aprende-se a tirá-la aos poucos.'
      },
      escassez: {
        titulo: 'A decisão que fica com os outros',
        cena: 'Ela tem opinião, mas espera alguém decidir. Na reunião, pensa a resposta certa e não fala. Em casa, deixa as contas com o marido porque "não é boa com números". Depois se irrita por viver uma vida que não planejou.',
        protege: 'Ficar sem Atena também protege: evita ameaçar quem se sente diminuído pela sua competência e evita o risco de errar sozinha.',
        custa: 'O custo é viver em cima das escolhas dos outros, e sentir que a vida acontece com você, e não por você.',
        volta: 'Atena volta com decisões pequenas: escolher o restaurante, montar o orçamento do mês, dizer o que pensa numa reunião. Decidir é testar: você escolhe, olha o resultado e ajusta.'
      }
    },
    perguntas: [
      'Quando foi a primeira vez que você precisou ser forte cedo demais?',
      'Que mulher te irrita pelo jeito de sentir? O que ela se permite que você não se permite?',
      'O que você está sentindo agora, sem explicar o porquê?',
      'Se você tirasse a armadura por um dia inteiro, quem estaria por perto para ver?'
    ],
    dom: {
      empresta: 'o plano: um jeito de transformar o que você sente em passos',
      titulo: 'A oliveira e a fonte',
      texto: 'Atena saiu da cabeça de Zeus já adulta, de elmo e lança. Quando Atenas ainda não tinha nome, ela disputou a cidade com Poseidon. Ele fez brotar da rocha uma fonte de água salgada; ela plantou uma oliveira, que dava sombra, alimento, óleo e lenha. A cidade escolheu o que servia à vida de todo dia e ganhou o nome dela. Deusa da estratégia e dos trabalhos feitos à mão, Atena aconselhava os heróis e sempre tinha uma saída na hora certa. A coruja, que enxerga no escuro, era a sua ave.',
      reconhece: [
        'Gosto de entender como as coisas funcionam.',
        'Numa crise, sou a que mantém a cabeça fria.',
        'Prefiro um plano a uma promessa.',
        'Admiro quem sabe o que está fazendo.'
      ],
      par: {
        artemis: 'Ártemis escolhe o alvo; Atena desenha o caminho até ele. Juntas, fazem da sua independência um plano, e não só um impulso. A atenção fica para os dias em que as duas resolvem tudo sozinhas: pedir ajuda também é estratégia.',
        hestia: 'Héstia guarda o centro; Atena leva para o mundo o que nasce dali. Com ela por perto, a sua calma vira decisão, e a sua profundidade ganha forma, prazo e voz.',
        hera: 'Hera sustenta o compromisso; Atena cuida para que ele seja justo. Com as duas, a parceria tem acordos claros, contas em dia e alguém que pensa no futuro de vocês.',
        demeter: 'Deméter cuida; Atena organiza o cuidado. Com ela ao lado, ajudar deixa de ser assumir tudo e vira divisão de tarefas, combinado e limite de tempo.',
        persefone: 'Perséfone escuta o que ninguém disse; Atena transforma isso em escolha. Com ela por perto, a sua sensibilidade ganha critério, e a opinião dos outros deixa de decidir por você.',
        afrodite: 'Afrodite traz a ideia; Atena traz o acabamento. Com as duas, a sua criatividade sai do papel e chega ao fim, que é justamente onde ela costuma tropeçar sozinha.'
      }
    }
  },

  // ====================================================================== ÁRTEMIS
  artemis: {
    epigrafe: 'Aos três anos, Ártemis subiu no colo do pai e fez os seus pedidos. Não pediu palácio nem marido: pediu um arco e o caminho.',
    mito: {
      titulo: 'A que pediu o arco',
      texto: [
        'Leto esperava gêmeos de Zeus, e Hera, ciumenta, proibiu que qualquer terra a recebesse. Leto vagou até encontrar Delos, uma ilha que flutuava solta no mar. Ali nasceu Ártemis, primeiro. E, ainda recém-nascida, ajudou a mãe a trazer ao mundo o irmão, Apolo. Desde então, era chamada pelas mulheres na hora do parto.',
        'Aos três anos, no colo do pai, fez os seus pedidos: nunca ser obrigada a casar, ter arco e flechas, uma túnica curta para correr, companheiras para caçar e as montanhas como casa. Zeus, encantado, disse sim a tudo.',
        'Ártemis viveu nas matas com as suas ninfas, longe do Olimpo e das intrigas. Protegia os filhotes, as meninas e as mulheres, e respondia rápido a quem pedisse ajuda. Também sabia defender o seu território. Quando o caçador Actéon a espiou banhando-se num lago, ela o transformou num cervo, e ele nunca mais voltou para casa.',
        'Ela era a deusa da lua crescente, que ilumina o caminho no escuro. Não esperava ser escolhida, nem salva, nem convidada. Escolhia o alvo, puxava a corda e não errava.'
      ],
      destaque: 'Ártemis não espera que abram a porta. Ela já está na mata.',
      leitura: 'No mito, Ártemis pede o próprio caminho antes que alguém escolha por ela. Em muitas mulheres guiadas por ela, a história se parece. Cedo souberam o que queriam, defenderam o próprio espaço e confiaram mais nas próprias pernas do que em promessas. A liberdade veio junto com uma solidão que nem sempre se conta.'
    },
    retrato: {
      abre: 'Quando Ártemis rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a que subia em árvore, corria com os meninos e voltava para casa com o joelho ralado. Vestido de festa incomodava. Você defendia o irmão menor, o bicho da rua, a colega de quem riam. E já não gostava que decidissem por você.'],
        ['A jovem', 'Você queria sair, viajar, ter o seu dinheiro e a sua chave. As amigas eram quase irmãs, uma turma para enfrentar o mundo. Os namoros eram bem-vindos, desde que não tentassem segurar você no lugar.'],
        ['A mulher', 'Hoje, você tem metas e corre atrás delas. Resolve sozinha, defende quem precisa e se irrita com injustiça. O corpo pede movimento, o ar livre faz bem. O que pouca gente vê é como é difícil, para você, pedir ajuda e ficar quando a conversa aperta.']
      ],
      reconhece: [
        'Quando coloco um objetivo na cabeça, ninguém me segura.',
        'Prefiro fazer sozinha a esperar alguém.',
        'Não suporto que mandem em mim.',
        'Me sinto bem ao ar livre, andando, me mexendo.',
        'Defendo quem é mais fraco, mesmo quando o problema não é meu.',
        'Já me afastei de alguém na primeira briga, sem conversar.',
        'Tenho mais facilidade de ajudar do que de ser ajudada.',
        'Preciso de espaço, e me sinto presa quando não tenho.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Ártemis já corre por você.'
    },
    areas: {
      trabalho: 'Você rende quando tem autonomia e um alvo claro. Projeto que é seu, você abraça. O cuidado é não transformar cada colega em concorrente nem carregar sozinha o que podia ser dividido.',
      dinheiro: 'Ter o próprio dinheiro é liberdade, e você não abre mão disso. Depender de alguém para pagar as contas incomoda mais do que qualquer aperto.',
      amor: 'Você ama sem se prender, e quer ao lado alguém que tenha a própria vida. O desafio é deixar o outro chegar perto sem sentir que perdeu o caminho.',
      familia: 'Você é a que defende, a que enfrenta, a que diz o que ninguém tem coragem de dizer. Às vezes a distância é o jeito que você encontra de continuar amando.',
      amizades: 'Amigas são irmãs de caminhada. Você é leal e protege, mas se afasta rápido de quem trai a confiança, às vezes sem conversar.',
      pessoal: 'O corpo pede movimento: trilha, corrida, dança, mar. Ficar parada por muito tempo costuma pesar mais do que o cansaço.',
      mudancas: 'Mudança, para você, muitas vezes é escolha. O difícil não é partir: é ficar quando ficar seria o mais corajoso.'
    },
    estados: {
      luz: {
        titulo: 'Quando Ártemis está na medida',
        cena: 'Você decide começar um projeto que é só seu. Separa as horas da semana, avisa em casa e cumpre. Quando uma amiga pede ajuda, você ajuda. Quando você precisa, também pede, e não sente que perdeu nada com isso.',
        protege: 'Na luz, Ártemis protege o seu caminho. Você sabe o que quer, diz o que cabe na sua agenda e defende quem precisa.',
        custa: 'Quase nada, desde que ela lembre que algumas jornadas pedem companhia.',
        volta: 'Para continuar na medida, vale cuidar dos vínculos que ficam: um acordo, uma parceria, alguém que você deixa ajudar.'
      },
      excesso: {
        titulo: 'A mata onde ninguém entra',
        cena: 'Ela resolve tudo sozinha. Carrega as compras mesmo com alguém oferecendo ajuda, trabalha até tarde por uma causa e não conta para ninguém que está cansada. Na primeira discussão com a amiga, some. Diz que precisa de espaço, e precisa mesmo. Só que o espaço foi ficando grande, e quase ninguém mais consegue chegar.',
        protege: 'Essa independência nasceu para proteger. Ela evita depender de quem pode não aparecer. Em algum momento da sua história, contar só com você foi o mais seguro.',
        custa: 'O custo é a solidão, e o cansaço de carregar sozinha o que podia ser dividido. Ninguém fica perto de quem nunca precisa.',
        volta: 'Ártemis não volta à medida com mais distância. Ela volta quando você aprende a ficar e a receber: num acordo cumprido a dois, num cuidado aceito sem dívida.'
      },
      escassez: {
        titulo: 'O caminho que ficou para depois',
        cena: 'Ela tinha um plano: o curso, a viagem, o negócio. Aí apareceu alguém, depois a família, depois o trabalho dos outros. Hoje a agenda dela é inteira dos outros. Quando perguntam o que ela quer, ela não sabe responder, e diz sim para tudo porque não tem um alvo próprio para defender.',
        protege: 'Ficar sem Ártemis também protege: ter um caminho próprio poderia ameaçar quem depende de você, e ninguém se sente abandonado.',
        custa: 'O custo é viver a vida dos outros, e sentir uma raiva quieta de mulheres que foram atrás do que queriam.',
        volta: 'Ártemis volta com um alvo pequeno e seu: uma hora por semana para um projeto, uma caminhada sozinha, um não dito com calma porque aquele horário já tem dona.'
      }
    },
    perguntas: [
      'Se ninguém dependesse de você por um mês, o que você faria?',
      'Que mulher te irrita pelo jeito de depender dos outros? O que ela se permite que você não se permite?',
      'De quem você aceitaria ajuda sem sentir que perdeu alguma coisa?',
      'Qual alvo é seu, e não de alguém que você ama?'
    ],
    dom: {
      empresta: 'a direção: um alvo que é seu',
      titulo: 'A que pediu o arco',
      texto: 'Ártemis nasceu de Leto e Zeus, numa ilha onde a mãe se escondia da fúria de Hera. Nasceu primeiro e, recém-nascida, ajudou a mãe a trazer ao mundo o irmão gêmeo, Apolo. Aos três anos, no colo do pai, fez os seus pedidos: nunca ser obrigada a casar, ter arco e flechas, uma túnica curta para correr, companheiras para caçar e as montanhas como casa. Zeus disse sim a tudo. Ártemis viveu nas matas, protegendo os animais jovens, as meninas e as mulheres na hora do parto, e respondia rápido a quem pedisse a sua ajuda.',
      reconhece: [
        'Quando coloco um objetivo na cabeça, ninguém me segura.',
        'Gosto de fazer as coisas do meu jeito e no meu tempo.',
        'Me sinto bem ao ar livre, andando, me mexendo.',
        'Defendo quem é mais fraco, mesmo quando o problema não é meu.'
      ],
      par: {
        atena: 'Atena traça o plano; Ártemis vai até o fim. Com as duas, você não só sabe o que quer como corre atrás. A atenção fica para os dias em que as duas resolvem fazer tudo sozinhas: pedir ajuda também é estratégia.',
        hestia: 'Héstia guarda o centro; Ártemis leva você para fora dele. Com ela ao lado, a sua calma encontra um alvo, e o que você sente lá dentro ganha um caminho no mundo.',
        hera: 'Hera constrói o nós; Ártemis guarda o eu. Com as duas, a parceria não engole os seus projetos, e você ama sem deixar de ter um caminho seu.',
        demeter: 'Deméter cuida dos outros; Ártemis lembra que você também tem um alvo. Com ela por perto, o cuidado ganha limite, e sobra força para correr atrás do que é seu.',
        persefone: 'Perséfone se abre a tudo; Ártemis dá a direção. Com ela ao lado, você escuta o mundo e, ainda assim, sabe para onde está indo.',
        afrodite: 'Afrodite deseja; Ártemis mira. Com as duas, o desejo vira meta, e o entusiasmo do começo encontra pernas para chegar ao fim.'
      }
    }
  },

  // ====================================================================== HÉSTIA
  hestia: {
    epigrafe: 'Héstia não tem aventuras para contar. Ela é o fogo aceso para onde todas as aventuras voltam.',
    mito: {
      titulo: 'O fogo do centro',
      texto: [
        'Héstia foi a primeira filha de Cronos e Reia, e a primeira que o pai engoliu, com medo de que um filho tomasse o seu trono. Quando Zeus obrigou Cronos a devolver os irmãos, ela foi a última a sair. Por isso os gregos a chamavam de a primeira e a última.',
        'Poseidon e Apolo a pediram em casamento. Ela recusou os dois e jurou, com a mão sobre a cabeça de Zeus, continuar inteira, dona de si. Zeus aceitou e deu a ela um lugar que nenhum outro deus tinha: o centro de cada casa e de cada templo.',
        'Héstia era a lareira. Quase não tem retratos nem histórias de amor ou de guerra, porque não era vista em forma de mulher: era vista no fogo aceso. Em toda refeição, recebia a primeira e a última oferenda. Cada cidade grega mantinha uma chama dela que nunca se apagava, e quando um grupo partia para fundar uma cidade nova, levava consigo um pouco desse fogo.',
        'Uma casa só virava lar quando a lareira era acesa. Um recém-nascido só era recebido na família depois de ser levado ao redor dela. Héstia não saía para buscar nada. Era para ela que tudo voltava.'
      ],
      destaque: 'Héstia não sai em busca de nada. É para ela que se volta.',
      leitura: 'No mito, Héstia não precisa ir a lugar nenhum para ser o centro. Em muitas mulheres guiadas por ela, a história se parece: uma calma que vem de dentro, uma casa que tem alma, uma vida interior mais rica do que deixam ver. O mundo nem sempre enxerga, e ela nem sempre faz questão.'
    },
    retrato: {
      abre: 'Quando Héstia rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a que brincava sozinha por horas sem se entediar. Tinha um cantinho seu, gostava de arrumar as coisas e observava mais do que falava. Os adultos diziam que você era quieta, e você estava, na verdade, inteira lá dentro.'],
        ['A jovem', 'Menos festas, mais livros, diário, música, oração ou caminhada. Poucas amizades, e fundas. Você percebia o clima de um lugar assim que entrava, e preferia sair cedo a ficar onde não se sentia em casa.'],
        ['A mulher', 'Hoje, a sua casa é abrigo, e as pessoas gostam de descansar perto de você. Você tem os seus rituais, trabalha bem quando ninguém interrompe e não precisa de plateia. O que pouca gente vê é que, às vezes, quem você ama nem sabe o que você sente.']
      ],
      reconhece: [
        'Preciso de um tempo sozinha para voltar a mim.',
        'Gosto da casa do meu jeito, com objetos que têm história.',
        'Consigo ficar em silêncio sem me sentir mal.',
        'Tenho pequenos rituais que me organizam por dentro.',
        'Prefiro uma conversa profunda a uma festa cheia.',
        'Quando tudo vira bagunça, algo em mim continua calmo.',
        'Às vezes deixo de dizer o que penso para não criar atrito.',
        'Não faço questão de aparecer, e às vezes isso me deixa invisível.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Héstia já mantém o fogo aceso por você.'
    },
    areas: {
      trabalho: 'Você rende quando pode se concentrar. Faz bem feito, sem alarde. O cuidado é não deixar que o seu trabalho fique invisível só porque você não gosta de se mostrar.',
      dinheiro: 'Você precisa de pouco para estar bem, e gasta com o que tem sentido. A questão costuma ser cobrar o justo pelo que você faz.',
      amor: 'Você ama em silêncio, com presença e constância. O desafio é dizer em voz alta o que sente, para que o outro não precise adivinhar.',
      familia: 'Você é o lugar para onde a família volta. A sua casa tem cheiro, ordem e calma. Às vezes você cede para manter a paz, e a sua vontade some da mesa.',
      amizades: 'Poucas e fundas. Você escuta sem pressa e guarda o que ouve. Também precisa de tempo sem ninguém, e isso não é desamor.',
      pessoal: 'Silêncio, chá, oração, jardim, uma casa arrumada: é assim que você se reencontra. Sem esses momentos, tudo parece barulho.',
      mudancas: 'Mudanças de fora abalam menos quando o centro está firme. O que desestabiliza é perder o seu canto, o seu ritmo, o seu silêncio.'
    },
    estados: {
      luz: {
        titulo: 'Quando Héstia está na medida',
        cena: 'O dia começa com dez minutos de silêncio. Depois vem o trabalho, as pessoas, o barulho, e você atravessa tudo sem se perder. À noite, a casa está em paz, e quando alguém pergunta o que você acha, você diz.',
        protege: 'Na luz, Héstia protege o seu centro. Você sabe voltar para si, e quem está perto sente essa calma.',
        custa: 'Quase nada, desde que ela não confunda recolhimento com sumiço.',
        volta: 'Para continuar na medida, vale levar para fora um pouco do que nasce no silêncio: uma opinião, um projeto, uma decisão.'
      },
      excesso: {
        titulo: 'A porta que se fecha',
        cena: 'Ela prefere não ir. Prefere não opinar, não discutir, não aparecer. Na reunião, tem a melhor ideia e guarda. Em casa, cede para não criar clima. Quando algo dá errado, diz que está tudo bem, que é o tempo das coisas. Ela está calma, de verdade. Só que o mundo foi ficando do lado de fora da porta.',
        protege: 'Esse recolhimento nasceu para proteger. Ele evita que você seja atacada, julgada ou invadida. Em algum momento da sua história, se retirar foi o jeito de ficar inteira.',
        custa: 'O custo é ficar invisível. Projetos que precisavam da sua voz passam, e quem você ama não sabe o que você sente.',
        volta: 'Héstia não volta à medida com mais silêncio. Ela volta quando outras deusas ganham espaço: um objetivo seu, uma opinião dita, um plano com data.'
      },
      escassez: {
        titulo: 'Uma casa sem fogo',
        cena: 'A televisão fica ligada mesmo sem ninguém assistir. Entre uma tarefa e outra, ela pega o celular. A agenda está cheia, a casa é lugar de passagem, e quando o barulho para, vem uma inquietação sem nome. Então ela liga alguma coisa de novo.',
        protege: 'Ficar sem Héstia também protege: o barulho evita encontrar o que o silêncio mostraria.',
        custa: 'O custo é viver sem um centro para onde voltar. Tudo cansa, e nada parece de verdade seu.',
        volta: 'Héstia volta com pouco: cinco minutos sem tela, uma vela acesa, um canto da casa só seu. O silêncio, no começo, incomoda. Depois, vira casa.'
      }
    },
    perguntas: [
      'Você consegue ficar vinte minutos sozinha, sem tela e sem tarefa? O que aparece?',
      'O que as pessoas que você ama ainda não sabem sobre o que você sente?',
      'Onde o seu silêncio está ajudando, e onde está adiando uma conversa?',
      'Qual é o ritual pequeno que devolve você a você mesma?'
    ],
    dom: {
      empresta: 'o centro: um lugar dentro de você para onde voltar',
      titulo: 'A primeira e a última',
      texto: 'Héstia foi a primeira filha de Cronos e Reia, e a primeira que o pai engoliu, com medo de perder o trono. Quando Zeus obrigou Cronos a devolver os filhos, ela foi a última a sair. Por isso os gregos a chamavam de a primeira e a última. Pedida em casamento por Apolo e por Poseidon, recusou os dois e pediu para continuar inteira. Zeus deu a ela o centro de cada casa: a lareira. Héstia quase não tem aventuras nem retratos. Ela era o próprio fogo aceso, a primeira a receber a oferenda em toda refeição, e a chama que as famílias levavam consigo quando partiam para fundar uma cidade nova.',
      reconhece: [
        'Preciso de um tempo sozinha para voltar a mim.',
        'Gosto da casa do meu jeito, com objetos que têm história.',
        'Consigo ficar em silêncio sem me sentir mal.',
        'Quando tudo vira bagunça, algo em mim continua calmo.'
      ],
      par: {
        atena: 'Atena olha para fora e resolve. Héstia olha para dentro e acalma. Juntas, desenham uma mulher que planeja sem se perder de si: depois do dia cheio, é Héstia quem lembra que existe uma casa, um chá e um silêncio esperando por você.',
        artemis: 'Ártemis corre o mundo; Héstia guarda a casa para onde ela volta. Com as duas, a sua liberdade tem um centro: você vai longe sem se perder de si.',
        hera: 'Hera cuida do vínculo; Héstia cuida do fogo que aquece esse vínculo por dentro. Com ela por perto, a parceria tem também silêncio, ritual e uma casa que é lar, e não vitrine.',
        demeter: 'Deméter cuida de todos; Héstia lembra que existe uma mulher dentro da cuidadora. Com ela ao lado, sobra um tempo para você, e um canto da casa onde ninguém precisa de nada.',
        persefone: 'Perséfone sente o mundo inteiro; Héstia oferece um lugar para pousar o que foi sentido. Com as duas, a sua sensibilidade tem raiz, e você escuta os outros sem se perder deles.',
        afrodite: 'Afrodite acende; Héstia mantém aceso. Com ela por perto, a paixão encontra continuidade, e o prazer pode ser também silêncio, casa e ritual.'
      }
    }
  },

  // ====================================================================== HERA
  hera: {
    epigrafe: 'Hera foi a única deusa do Olimpo que escolheu reinar ao lado de alguém. E levou a promessa a sério até o fim.',
    mito: {
      titulo: 'A rainha que prometeu',
      texto: [
        'Hera também era filha de Cronos e Reia, e também foi engolida pelo pai e devolvida por Zeus. Zeus a quis por muito tempo, e ela não cedeu. Então, numa tarde de tempestade, ele se transformou num cuco encharcado e pousou no colo dela. Hera aqueceu o passarinho junto ao peito. Zeus voltou à forma de deus e pediu que ela fosse dele. Ela aceitou com uma condição: casamento.',
        'A festa reuniu todo o Olimpo, e conta-se que a noite de núpcias durou trezentos anos. Hera virou a rainha dos deuses e a protetora do casamento e das esposas. Para ela, a palavra dada era sagrada.',
        'Zeus não pensava igual. Teve amores com deusas, ninfas e mortais, e Hera sofreu cada um deles. A sua fúria, porém, quase nunca ia para o marido. Ia para as outras: perseguiu Leto, que esperava os gêmeos de Zeus, e o pequeno Héracles, filho de outra mulher.',
        'Ainda assim, Hera se renovava. Todo ano se banhava numa fonte sagrada e voltava inteira, como no primeiro dia. Os gregos a honravam em três fases da vida: a menina, a mulher completa e a mulher sozinha. Em cada uma, Hera era a mesma: alguém que leva o compromisso a sério.'
      ],
      destaque: 'Para Hera, a palavra dada é uma casa. Ela mora dentro dela.',
      leitura: 'No mito, Hera dá tudo a um compromisso e espera o mesmo de volta. Em muitas mulheres guiadas por ela, a história se parece: a parceria é projeto de vida, a lealdade não se negocia e a traição dói como poucas coisas. Quando o outro não corresponde, a raiva costuma ir para longe do lugar certo.'
    },
    retrato: {
      abre: 'Quando Hera rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a que brincava de casamento, organizava o grupo e escolhia uma melhor amiga para a vida inteira. Levava a sério as promessas de criança, e sofria muito quando era deixada de fora.'],
        ['A jovem', 'Os namoros, para você, eram coisa séria desde cedo. Você sonhava com uma família, uma casa, um nome a dois. Ou se dedicava de corpo e alma a um grupo, a uma equipe, a uma causa que fosse de todos.'],
        ['A mulher', 'Hoje, a parceria é a base da sua vida. Você sabe sustentar acordos, fazer o casal ou a equipe funcionar e estar presente nos dias difíceis. O que pouca gente vê é o quanto dói quando alguém trata como pouco aquilo que, para você, é sagrado.']
      ],
      reconhece: [
        'Quando me comprometo, vou até o fim.',
        'Lealdade, para mim, não se negocia.',
        'Gosto de fazer parte de algo maior: um casal, uma família, uma equipe.',
        'Me importo com o lugar que ocupo ao lado de quem amo.',
        'Traição é das poucas coisas que eu não sei perdoar.',
        'Já senti mais raiva da outra do que de quem me traiu.',
        'Me sinto incompleta quando estou sem par.',
        'Fico atenta a sinais de que algo mudou na relação.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Hera já sustenta um vínculo por você.'
    },
    areas: {
      trabalho: 'Você é a que veste a camisa. Leal à equipe, cumpre o combinado e espera o mesmo. O cuidado é não confundir lealdade com aceitar tudo.',
      dinheiro: 'Dinheiro, para você, costuma ser projeto do casal ou da família. Vale perguntar se existe também um dinheiro que é só seu.',
      amor: 'É o território dela. Você quer compromisso, presença e reciprocidade, e oferece o mesmo. O desafio é que a relação não vire a sua identidade inteira.',
      familia: 'Datas, almoços, tradições: você mantém a família unida. Às vezes carrega o peso de manter uma imagem que já não corresponde ao que acontece em casa.',
      amizades: 'Amigas para a vida inteira, e um grupo que você ajuda a manter junto. Quando entra um amor sério, é comum as amigas ficarem em segundo plano.',
      pessoal: 'O seu tempo costuma ser tempo a dois ou em família. Ter um projeto só seu pode parecer egoísmo, e não é.',
      mudancas: 'Mudanças que mexem com vínculos são as mais difíceis: uma separação, um filho que sai de casa, um grupo que se desfaz. Você precisa de tempo para refazer o seu lugar.'
    },
    estados: {
      luz: {
        titulo: 'Quando Hera está na medida',
        cena: 'Domingo à noite, você e o seu par sentam para combinar a semana: quem leva, quem busca, quem paga o quê. Na segunda, você vai ao seu curso, que é só seu, e o outro segura as pontas. Ninguém se sente traído por isso.',
        protege: 'Na luz, Hera protege os seus vínculos. Você constrói parcerias que duram, com acordos claros e respeito dos dois lados.',
        custa: 'Quase nada, desde que o nós não apague o eu.',
        volta: 'Para continuar na medida, vale manter algo que seja só seu dentro da parceria: um projeto, uma amiga, um horário.'
      },
      excesso: {
        titulo: 'Quando o nós engole o eu',
        cena: 'Ela organiza a vida em torno da relação. Deixou o curso porque ele não gostava, foi se afastando das amigas, olha o celular dele quando ele dorme. Quando aparece uma colega simpática no trabalho dele, é com a colega que ela fica furiosa. Ele chega tarde, e ela finge que não viu. Tudo para não perder o lugar que construiu.',
        protege: 'Esse apego nasceu para proteger. Ele evita a dor de ser deixada e a vergonha de uma separação. Em algum momento da sua história, perder um vínculo foi ameaçador demais.',
        custa: 'O custo é perder a si mesma. Projetos, amizades e limites vão sumindo, e a sua paz passa a depender do humor do outro.',
        volta: 'Hera não volta à medida com mais vigilância. Ela volta quando você tem um caminho seu: um projeto, uma meta, um espaço que não depende de ninguém.'
      },
      escassez: {
        titulo: 'Os laços que se desfazem sem conversa',
        cena: 'Quando a relação começa a ficar séria, ela encontra um defeito. Quando o grupo pede compromisso, ela some. Diz que não acredita em casamento, nem em sociedade, nem em promessa. E segue sozinha, achando que é escolha, sem perceber que é medo de repetir uma história antiga.',
        protege: 'Ficar sem Hera também protege: sem compromisso, não há risco de viver a decepção que você já viu acontecer.',
        custa: 'O custo é a vida sem raiz. Vínculos que começam e não ficam, e uma solidão que nem sempre foi escolhida.',
        volta: 'Hera volta com acordos pequenos e cumpridos: um combinado com uma amiga, uma rotina a dois, uma conversa difícil em vez de um sumiço.'
      }
    },
    perguntas: [
      'Se essa relação acabasse hoje, quem você seria na segunda-feira?',
      'Que mulher te irrita pelo jeito de amar? O que ela se permite que você não se permite?',
      'Quando você sente raiva numa relação, para onde essa raiva vai?',
      'Que projeto é só seu, dentro ou fora da parceria?'
    ],
    dom: {
      empresta: 'a palavra dada: a força de sustentar o que você escolheu',
      titulo: 'A rainha que prometeu',
      texto: 'Zeus quis Hera por muito tempo, e ela não cedeu. Numa tarde de tempestade, ele se transformou num cuco encharcado e pousou no colo dela. Hera aqueceu o passarinho junto ao peito, e Zeus, de volta à forma de deus, pediu que ela fosse dele. Ela aceitou com uma condição: casamento. Virou a rainha do Olimpo e a protetora das esposas e das alianças. Zeus nem sempre foi fiel, e Hera sofreu cada traição. Ainda assim, todo ano se banhava numa fonte sagrada e voltava inteira. Para ela, a palavra dada era sagrada.',
      reconhece: [
        'Quando me comprometo, vou até o fim.',
        'Lealdade, para mim, não se negocia.',
        'Gosto de fazer parte de algo maior: um casal, uma família, uma equipe.',
        'Acordo quebrado me dói mais do que eu admito.'
      ],
      par: {
        atena: 'Atena decide; Hera sustenta o que foi decidido. Com ela ao lado, os seus planos ganham parceria de longo prazo, e a sua competência encontra com quem dividir a vida.',
        artemis: 'Ártemis vai sozinha; Hera lembra que algumas jornadas pedem companhia. Com ela por perto, a sua independência aprende a ficar, a combinar e a construir junto.',
        hestia: 'Héstia guarda o lar; Hera dá a ele uma família, uma mesa, um nós. Com as duas, a sua casa é ao mesmo tempo refúgio e lugar de encontro.',
        demeter: 'Deméter cuida; Hera faz do cuidado uma aliança. Com ela ao lado, você cobra reciprocidade, e o vínculo deixa de ser só doação.',
        persefone: 'Perséfone se adapta; Hera firma. Com ela por perto, a sua escuta ganha compromisso, e as relações deixam de depender só do humor de cada dia.',
        afrodite: 'Afrodite acende a paixão; Hera dá a ela uma casa. Com as duas, o encanto do começo encontra continuidade, e o amor dura além da novidade.'
      }
    }
  },

  // ====================================================================== DEMÉTER
  demeter: {
    epigrafe: 'Quando levaram a sua filha, Deméter parou o mundo. Nada mais brotou na terra até que a menina voltasse.',
    mito: {
      titulo: 'A mãe que fez o inverno',
      texto: [
        'Deméter era a deusa do trigo e da colheita, a que fazia a terra dar alimento. A sua alegria era a filha, Perséfone. Um dia, a menina colhia flores num campo quando a terra se abriu e Hades, o senhor do mundo dos mortos, a levou para o seu reino.',
        'Deméter procurou a filha por nove dias e nove noites, com uma tocha em cada mão, sem comer e sem se banhar. Quando soube que Zeus tinha permitido o rapto, deixou o Olimpo. Disfarçada de velha, chegou à cidade de Elêusis e foi trabalhar como ama de um bebê da casa real. Cuidou dele com tanto amor que, toda noite, o colocava no fogo para torná-lo imortal, até que a mãe do menino viu e gritou de susto.',
        'Então Deméter mostrou quem era, pediu que construíssem um templo para ela e se fechou lá dentro. E parou de fazer a terra brotar. Os campos secaram, a fome chegou, os sacrifícios aos deuses cessaram. Um por um, os deuses do Olimpo foram pedir que ela voltasse. Ela respondeu que só voltaria com a filha.',
        'Zeus cedeu. Mas Perséfone tinha comido algumas sementes de romã no mundo de baixo, e por isso passaria parte do ano lá. Quando a filha volta, Deméter se alegra e a terra floresce. Quando a filha desce, chega o inverno.'
      ],
      destaque: 'O amor de Deméter alimenta o mundo. E o mundo inteiro sente quando ela para.',
      leitura: 'No mito, Deméter dá tudo enquanto tem por quem cuidar, e se apaga quando perde. Em muitas mulheres guiadas por ela, a história se parece: cuidar é o jeito de amar, a casa cheia é a casa feliz, e o próprio cansaço vem sempre por último. Ela sustenta muita gente. A pergunta é quem a sustenta.'
    },
    retrato: {
      abre: 'Quando Deméter rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a que cuidava do irmão menor, da boneca, do passarinho caído. Brincava de mãe ou de professora, ajudava na cozinha e percebia antes de todos quando alguém da casa estava triste.'],
        ['A jovem', 'Você era a amiga que todos procuravam na hora do aperto. Talvez tenha escolhido uma profissão de cuidado, ou sonhado cedo com ter filhos. Já esquecia de si para estar disponível.'],
        ['A mulher', 'Hoje, muita gente conta com você: filhos, pais, amigas, colegas. Você lembra dos remédios, das datas, de quem está sem comer. O sim sai antes de você pensar. O que pouca gente vê é o cansaço, e uma pergunta que quase ninguém faz: e você, quem cuida?']
      ],
      reconhece: [
        'Percebo quando alguém não está bem, mesmo sem ele dizer.',
        'Digo sim antes de pensar se tenho tempo.',
        'Faço pelos outros o que eles poderiam fazer sozinhos.',
        'Gosto de ver as pessoas alimentadas, confortáveis, cuidadas.',
        'Me sinto culpada quando penso primeiro em mim.',
        'Fico sem graça quando alguém quer cuidar de mim.',
        'Já pensei: faço tudo, e ninguém reconhece.',
        'Quando um filho, um projeto ou uma pessoa cresce, uma parte de mim sofre.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Deméter já cuida de alguém por você.'
    },
    areas: {
      trabalho: 'Você acompanha, ensina, sustenta processos e cuida da equipe. O cuidado é não virar a pessoa que cobre a falta de todo mundo.',
      dinheiro: 'O dinheiro costuma ir primeiro para os outros: filhos, pais, quem precisa. Vale perguntar quanto do orçamento é para cuidar de você.',
      amor: 'Você ama cuidando, e às vezes cuida do par como de um filho. O desafio é deixar que ele também cuide de você.',
      familia: 'É o território dela. Você é a mesa posta, o colo, a lembrança. Às vezes carrega a família inteira nas costas, e ninguém pergunta se pesa.',
      amizades: 'Você é a amiga que aparece com a sopa. Oferece muito, e recebe menos do que precisaria, porque raramente pede.',
      pessoal: 'O próprio corpo costuma ficar no fim da fila. Consulta adiada, descanso que não vem, comida feita para todos e beliscada em pé.',
      mudancas: 'As mudanças mais difíceis são as perdas e as despedidas: o filho que cresce, alguém que parte. Você precisa aprender a soltar e a deixar crescer.'
    },
    estados: {
      luz: {
        titulo: 'Quando Deméter está na medida',
        cena: 'A amiga liga pedindo ajuda com a mudança. Você olha a agenda e diz: no sábado de manhã eu posso. Leva um bolo, ajuda três horas e volta para casa. À tarde, deita um pouco, porque o seu corpo também merece cuidado.',
        protege: 'Na luz, Deméter protege quem você ama e também você. Você cuida, nutre e faz crescer, sem se esvaziar.',
        custa: 'Quase nada, desde que o cuidado inclua você.',
        volta: 'Para continuar na medida, vale manter duas perguntas por perto: isso é algo que eu quero fazer agora? Eu tenho tempo e energia?'
      },
      excesso: {
        titulo: 'A mesa que nunca fecha',
        cena: 'O telefone toca e ela já está indo. Resolve o problema da irmã, faz o trabalho do filho, cobre a colega que faltou. Em casa, todos comem, e ela belisca em pé. Ninguém pede nada, e ela faz assim mesmo. Um dia esquece o aniversário de alguém, chega atrasada, perde um prazo. Não é distração: é uma raiva que nunca foi dita.',
        protege: 'Esse cuidado sem fim nasceu para proteger. Ele garante o seu lugar entre as pessoas e afasta a culpa de parecer egoísta. Em algum momento da sua história, ser necessária foi o jeito de ser amada.',
        custa: 'O custo é o esgotamento, e um ressentimento silencioso. Quem é sempre cuidado também perde a chance de crescer sozinho.',
        volta: 'Deméter não volta à medida com mais cuidado. Cuidar de si é o primeiro passo, e ele costuma escorregar de volta para os outros. Por isso vem junto com uma vida própria, para onde levar essa energia.'
      },
      escassez: {
        titulo: 'A horta sem água',
        cena: 'Ela começa e não sustenta: a planta morre, o projeto para, a consulta fica para depois. Quando alguém precisa dela, sente um incômodo que não sabe explicar. E quando alguém oferece cuidado, ela agradece e logo devolve o favor, para não ficar devendo.',
        protege: 'Ficar sem Deméter também protege: evita repetir uma mãe que se anulou e evita ser sugada por quem depende.',
        custa: 'O custo é a falta de nutrição, para os outros e para você. A vida fica seca, e receber parece perigoso.',
        volta: 'Deméter volta com cuidados pequenos e diários: uma planta regada, uma refeição feita com calma para você, um carinho aceito sem pressa de devolver.'
      }
    },
    perguntas: [
      'Quem cuida de você?',
      'Que mulher te irrita pelo jeito de não cuidar de ninguém? O que ela se permite que você não se permite?',
      'Que raiva você engoliu por medo de parecer egoísta?',
      'O que você faria com uma tarde inteira só para você?'
    ],
    dom: {
      empresta: 'o cuidado: o dom de nutrir o que importa, inclusive você',
      titulo: 'A mãe da colheita',
      texto: 'Deméter era a deusa do trigo, a que fazia a terra dar alimento. Quando Hades levou a sua filha, Perséfone, para o mundo de baixo, ela procurou a menina por nove dias com uma tocha em cada mão, sem comer e sem descansar. Depois, recolheu-se num templo e parou de fazer a terra brotar. A fome chegou ao mundo, e os deuses tiveram de ceder. Perséfone voltou, mas passaria parte do ano lá embaixo. Desde então, quando a filha volta, a terra floresce; quando ela desce, chega o inverno.',
      reconhece: [
        'Percebo quando alguém não está bem, mesmo sem ele dizer.',
        'Gosto de ver as pessoas alimentadas, confortáveis, cuidadas.',
        'Me faz bem ajudar algo a crescer: uma planta, um projeto, uma pessoa.',
        'Lembro dos aniversários, dos remédios e dos detalhes.'
      ],
      par: {
        atena: 'Atena resolve; Deméter cuida de quem está envolvido. Com ela ao lado, as suas decisões levam em conta as pessoas, e a sua competência ganha calor.',
        artemis: 'Ártemis defende; Deméter acolhe. Com as duas, você protege quem é mais fraco e ainda sabe oferecer colo, e não só uma saída.',
        hestia: 'Héstia mantém o fogo; Deméter põe a comida na mesa. Com ela por perto, a sua casa interior se abre para os outros, e a sua calma vira cuidado.',
        hera: 'Hera cuida do vínculo; Deméter cuida das pessoas dentro dele. Com as duas, a família tem compromisso e tem carinho. A atenção é para não carregar tudo sozinha.',
        persefone: 'No mito, Deméter e Perséfone são mãe e filha. Em você, a escuta sensível ganha mãos: você percebe o que o outro sente e sabe o que fazer com isso. Só cuide para que alguém cuide de você também.',
        afrodite: 'Afrodite cria; Deméter faz crescer. Com ela ao lado, as suas ideias deixam de ser só começos e ganham alguém que rega todo dia.'
      }
    }
  },

  // ====================================================================== PERSÉFONE
  persefone: {
    epigrafe: 'Perséfone desceu como menina e voltou como rainha. Entre uma coisa e outra, provou as sementes da romã.',
    mito: {
      titulo: 'A menina que virou rainha',
      texto: [
        'Antes de ser rainha, Perséfone era Core, que quer dizer a menina. Filha de Deméter, vivia ao lado da mãe, nos campos floridos. Um dia, colhendo flores, viu um narciso de cem flores num só caule. Quando se abaixou para colhê-lo, a terra se abriu, e Hades, o senhor do mundo de baixo, a levou no seu carro para o reino dos mortos.',
        'Lá embaixo, Perséfone chorou e se recusou a comer. Em cima, a mãe procurava por ela e deixava o mundo sem colheita. Quando Zeus enfim mandou buscá-la, Hades ofereceu à menina uma romã, e ela comeu algumas sementes. Quem prova o alimento do mundo de baixo fica ligado a ele. Por isso, Perséfone passaria parte do ano lá e parte com a mãe.',
        'Mas a história não termina como um rapto. Perséfone se tornou a rainha do mundo de baixo. Era ela quem recebia as almas que chegavam e guiava os poucos vivos que desciam até lá, como Orfeu e Psiquê.',
        'Cada vez que Perséfone sobe, a primavera volta à terra. Ela conhece os dois mundos: a luz dos campos e o escuro de baixo. Foi lá embaixo que a menina deixou de ser filha de alguém e passou a ser rainha.'
      ],
      destaque: 'Perséfone não escolheu descer. Mas foi lá embaixo que ela se tornou quem era.',
      leitura: 'No mito, Perséfone passa de menina guiada pela mãe a rainha que conhece os dois mundos. Em muitas mulheres guiadas por ela, a história se parece: uma sensibilidade que capta o que ninguém disse, uma facilidade de se moldar ao outro, e um momento da vida em que foi preciso descer para depois voltar mais inteira.'
    },
    retrato: {
      abre: 'Quando Perséfone rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a sonhadora da casa. Inventava histórias, conversava com amigos imaginários, sentia o humor dos adultos antes de qualquer palavra. Era a filha boazinha, próxima da mãe, que fazia o possível para agradar.'],
        ['A jovem', 'Você se moldava ao grupo, ao namorado, ao que esperavam. Mudou de ideia sobre o curso mais de uma vez. Era atraída por mistério, poesia, sonhos e espiritualidade, e as pessoas confiavam a você segredos que não contavam a ninguém.'],
        ['A mulher', 'Hoje, você escuta como poucas e percebe o que está por baixo das palavras. Talvez já tenha atravessado uma fase escura e voltado diferente, mais funda. O que pouca gente vê é o quanto é difícil, para você, decidir sozinha o que quer.']
      ],
      reconhece: [
        'Percebo o clima de um lugar assim que entro.',
        'Sonho muito, e alguns sonhos me dizem coisas.',
        'Me adapto fácil ao que o outro espera de mim.',
        'Peço muitas opiniões antes de decidir.',
        'Já passei por uma fase difícil que me mudou por dentro.',
        'As pessoas me contam coisas que não contam a ninguém.',
        'Me pergunto que impressão estou causando.',
        'Tenho mais facilidade de imaginar do que de começar.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Perséfone já escuta por você.'
    },
    areas: {
      trabalho: 'Você lê as pessoas e o contexto como poucas: ótima para escutar, mediar, criar. O cuidado é não deixar que a opinião dos outros decida os seus rumos.',
      dinheiro: 'Dinheiro pode parecer assunto distante, e às vezes fica nas mãos de outra pessoa. Ter o seu próprio critério para gastar é um bom começo.',
      amor: 'Você se entrega e se transforma no amor. O desafio é não virar quem o outro quer que você seja.',
      familia: 'Você sente tudo o que acontece na casa, mesmo o que não é dito. Às vezes ainda é a filha que tenta agradar, mesmo depois de adulta.',
      amizades: 'Você é a confidente. Escuta sem julgar e acolhe o que ninguém mais acolhe. Vale ter amigas que também perguntem o que você quer.',
      pessoal: 'Sonhos, intuição, leitura, arte, espiritualidade: o seu mundo interior é vasto. O corpo e a rotina pedem um pouco de chão.',
      mudancas: 'Você atravessa fases de escuridão e volta transformada. Essa travessia é um dos seus dons, desde que você não espere alguém decidir por você quando é hora de subir.'
    },
    estados: {
      luz: {
        titulo: 'Quando Perséfone está na medida',
        cena: 'Uma amiga conta um problema e você percebe o que ela não disse. Escuta, acolhe e, no fim, pergunta: e o que você quer? Mais tarde, diante de uma decisão sua, você ouve duas pessoas, anota o próprio critério e escolhe.',
        protege: 'Na luz, Perséfone protege a sua sensibilidade. Você percebe nuances, imagina caminhos e atravessa mudanças sem endurecer.',
        custa: 'Quase nada, desde que escutar os outros não substitua a sua escolha.',
        volta: 'Para continuar na medida, vale manter por perto uma decisão pequena com prazo: ouvir, sim, e depois escolher.'
      },
      excesso: {
        titulo: 'O espelho que decide',
        cena: 'Antes de escolher a roupa, ela pensa no que vão achar. Antes de decidir a viagem, pergunta para três amigas. No namoro, gosta do que ele gosta. No trabalho, espera alguém dizer o que fazer. Quando perguntam o que ela quer, ela sorri e diz: tanto faz. E, de tanto ser o que os outros esperam, foi esquecendo quem é.',
        protege: 'Essa receptividade sem limite nasceu para proteger. Se outra pessoa escolhe, você não é responsável pelo resultado. Em algum momento da sua história, agradar foi o jeito mais seguro de ser aceita.',
        custa: 'O custo é viver um roteiro escrito por outros, e um cansaço sem causa aparente, de quem está sempre se ajustando.',
        volta: 'Perséfone não volta à medida com mais escuta. Ela volta quando outras deusas ganham espaço: um critério seu, um alvo seu, uma escolha feita sem pedir licença.'
      },
      escassez: {
        titulo: 'A porta que não abre para baixo',
        cena: 'Ela diz que não sonha, ou que não se lembra dos sonhos. Quando alguém chora, muda de assunto. Explica tudo com lógica, inclusive a própria dor, e segue em frente rápido demais. Nas mudanças, endurece. Diz que está bem, e funciona, mas por dentro algo ficou sem lugar.',
        protege: 'Ficar sem Perséfone também protege: evita perder o controle e evita descer a lugares que dão medo.',
        custa: 'O custo é uma vida sem profundidade, e mudanças atravessadas a seco, sem deixar que elas transformem você.',
        volta: 'Perséfone volta pelas portas pequenas: anotar um sonho, ouvir alguém sem resolver nada, deixar uma tristeza existir por uma tarde.'
      }
    },
    perguntas: [
      'O que você quer? A resposta não pode ter outra pessoa dentro.',
      'Que mulher te irrita pelo jeito de decidir sozinha? O que ela se permite que você não se permite?',
      'Qual foi a sua descida, e o que você trouxe de lá?',
      'Que intuição você deixou de ouvir por parecer bobagem?'
    ],
    dom: {
      empresta: 'a escuta: a capacidade de receber o que ainda não tem nome',
      titulo: 'A rainha dos dois mundos',
      texto: 'Perséfone era a filha de Deméter, a menina dos campos floridos. Um dia, colhendo flores, foi levada por Hades para o mundo de baixo. Lá, provou algumas sementes de romã, e por isso ficou ligada aos dois mundos: passa parte do ano com a mãe, e então a primavera volta à terra, e parte lá embaixo. Mas Perséfone não ficou só como a menina levada. Tornou-se a rainha do mundo de baixo, a que recebe quem chega e guia quem precisa atravessar.',
      reconhece: [
        'Percebo o clima de um lugar assim que entro.',
        'Sonho muito, e alguns sonhos me dizem coisas.',
        'Já passei por uma fase difícil que me mudou por dentro.',
        'As pessoas me contam coisas que não contam a ninguém.'
      ],
      par: {
        atena: 'Atena enxerga os fatos; Perséfone escuta o que está por baixo deles. Com ela por perto, os seus planos levam em conta o que as pessoas sentem, e a sua razão ganha intuição.',
        artemis: 'Ártemis segue em linha reta; Perséfone percebe os atalhos invisíveis. Com as duas, a sua direção fica mais sensível ao caminho e a quem está nele.',
        hestia: 'Héstia olha para dentro; Perséfone desce ainda mais fundo. Com as duas, a sua vida interior é rica, cheia de imagens e sentido. Só cuide para que ela também chegue ao mundo de fora.',
        hera: 'Hera sustenta o vínculo; Perséfone escuta o que ele precisa. Com ela ao lado, você percebe o outro nas entrelinhas, e a parceria ganha delicadeza.',
        demeter: 'No mito, Deméter e Perséfone são mãe e filha. Em você, o cuidado ganha escuta: você não dá só o que acha que o outro precisa, mas percebe o que ele de fato precisa.',
        afrodite: 'Afrodite deseja; Perséfone imagina. Com as duas, a sua criatividade tem profundidade, e o encanto vem junto com mistério.'
      }
    }
  },

  // ====================================================================== AFRODITE
  afrodite: {
    epigrafe: 'Afrodite nasceu da espuma do mar e chegou à terra já inteira. Por onde ela pisava, nasciam flores.',
    mito: {
      titulo: 'A que nasceu da espuma',
      texto: [
        'Afrodite não teve infância. Nasceu adulta da espuma do mar e foi levada pelo vento até a ilha de Chipre, sobre uma concha. Quando pisou na areia, nasceram grama e flores sob os seus pés. As Horas, deusas das estações, a vestiram e a enfeitaram de ouro, e a levaram ao Olimpo. Todos os deuses ficaram encantados.',
        'Zeus a casou com Hefesto, o ferreiro manco, o mais trabalhador dos deuses. Mas Afrodite seguia o próprio desejo. Amou Ares, o deus da guerra, e amou mortais, como o belo Adônis e o pastor Anquises. Os seus amores eram de ida e volta: ela desejava e era desejada, e nunca foi vítima de ninguém.',
        'O poder de Afrodite era fazer as coisas ganharem vida. Conta-se que um escultor chamado Pigmalião esculpiu uma mulher tão bela que se apaixonou pela estátua. Afrodite ouviu o seu pedido, e o mármore ficou morno, macio, e a estátua abriu os olhos.',
        'Ela tinha um cinto bordado que despertava o desejo em quem o visse, e até Hera, a rainha, um dia pediu emprestado. Afrodite era a deusa da beleza, do amor e da criação. Onde ela chegava, as coisas deixavam de ser só úteis e passavam a ser vivas.'
      ],
      destaque: 'Onde Afrodite passa, alguma coisa ganha vida.',
      leitura: 'No mito, Afrodite não pede licença para existir nem para desejar. Em muitas mulheres guiadas por ela, a história se parece: uma vida intensa, um olhar atento à beleza, uma criatividade que transforma o comum em especial. O desafio raramente é começar. É ficar.'
    },
    retrato: {
      abre: 'Quando Afrodite rege, a vida costuma ter um desenho parecido com este. Leia devagar e veja o que é seu.',
      fases: [
        ['A menina', 'Talvez você fosse a que dançava pela casa, se fantasiava, mexia na maquiagem da mãe e enfeitava tudo o que via. Desenhava, inventava, se apaixonava por um livro, uma cor, uma música. E encantava os adultos sem nem tentar.'],
        ['A jovem', 'Vieram as paixões intensas, as viagens, a arte, os cursos trocados no meio do caminho. As pessoas gostavam de estar perto de você, e você vivia cada coisa como se fosse a única.'],
        ['A mulher', 'Hoje, você transforma ambientes e pessoas. Cria, enfeita, celebra, dá gosto à vida dos outros. O que pouca gente vê é a pilha de começos sem fim, e o tédio que chega quando a novidade acaba.']
      ],
      reconhece: [
        'Reparo em cores, cheiros e texturas que ninguém nota.',
        'Gosto de deixar as coisas bonitas, mesmo as pequenas.',
        'Quando me apaixono por uma ideia, mergulho de cabeça.',
        'Tenho muitos projetos começados e poucos terminados.',
        'A rotina me cansa mais do que o trabalho.',
        'Já gastei o que não podia com algo que me encantou.',
        'Me sinto viva quando danço, crio ou estou com quem gosto.',
        'Já marquei com entusiasmo e desmarquei em cima da hora.'
      ],
      fecha: 'Cada frase marcada é um lugar onde Afrodite já traz vida por você.'
    },
    areas: {
      trabalho: 'Você brilha onde há espaço para criar, comunicar e encantar. O cuidado é que a fase do meio e a do fim não fiquem sempre para os outros.',
      dinheiro: 'Dinheiro é para viver: uma roupa bonita, um jantar, uma viagem. O desafio é o encanto do momento não atropelar as contas do mês.',
      amor: 'Você ama com intensidade e com o corpo inteiro. A paixão vem fácil; o desafio é o amor continuar quando a novidade passa.',
      familia: 'Você é a que traz alegria, enfeita a festa e faz a família rir. Às vezes a rotina da casa pesa mais em você do que deveria.',
      amizades: 'Muitas amizades, encontros animados, gente que se sente especial perto de você. Vale cuidar de manter as que ficam.',
      pessoal: 'Prazer, corpo, beleza e criação são o seu alimento. Sem eles, os dias ficam cinzas.',
      mudancas: 'Mudança é fácil, às vezes até desejada. O difícil é ficar quando o começo acaba e chega a parte que pede constância.'
    },
    estados: {
      luz: {
        titulo: 'Quando Afrodite está na medida',
        cena: 'No sábado, você arruma a mesa com flores para receber as amigas. No domingo, termina a tela que começou no mês passado. Na segunda, põe uma roupa que te deixa bonita para trabalhar, e ninguém precisa elogiar para você saber.',
        protege: 'Na luz, Afrodite protege a sua alegria. Você cria, ama e dá vida ao que toca.',
        custa: 'Quase nada, desde que cada começo tenha um fim possível.',
        volta: 'Para continuar na medida, vale ter por perto algo que dure: uma rotina, um compromisso, um projeto levado até o fim.'
      },
      excesso: {
        titulo: 'O próximo começo',
        cena: 'Segunda ela começa a academia. Quarta, um curso de cerâmica. Sexta, se apaixona por uma ideia de negócio. Compra o material, conta para todo mundo, e na semana seguinte já está em outra. Marca o jantar com entusiasmo e desmarca no dia. Os armários guardam começos. O dia comum, sem novidade, parece vazio.',
        protege: 'Essa busca por intensidade nasceu para proteger. Ela mantém a vida acesa e evita o vazio do dia comum. Em algum momento da sua história, a novidade foi o que fazia você se sentir viva.',
        custa: 'O custo é a falta de continuidade: projetos que não chegam ao fim, relações que não amadurecem, contas que chegam depois.',
        volta: 'Afrodite não volta à medida com mais novidade. Ela volta quando outras deusas ganham espaço: um centro para onde voltar e um compromisso que você cumpre.'
      },
      escassez: {
        titulo: 'Os dias sem cor',
        cena: 'Ela se veste para não chamar atenção. Diz que não tem tempo para essas coisas: dança, pintura, um banho demorado. Os dias são todos úteis e todos iguais. Quando vê uma mulher que se arruma, ri, dança, pensa que é exagero. E, por dentro, algo sente falta.',
        protege: 'Ficar sem Afrodite também protege: evita ser julgada, exposta ou criticada pelo próprio desejo.',
        custa: 'O custo é uma vida sem prazer e sem brilho, em que tudo é dever e nada é só seu.',
        volta: 'Afrodite volta pelos sentidos: uma música no caminho, um perfume, uma flor na mesa, uma criação pequena feita só pelo prazer de fazer.'
      }
    },
    perguntas: [
      'O que te dá prazer e não serve para absolutamente nada?',
      'Que mulher te irrita pelo jeito de se vestir ou de desejar? O que ela se permite que você não se permite?',
      'Que começo seu merece um fim?',
      'Quando foi a última vez que você fez algo só porque era bonito?'
    ],
    dom: {
      empresta: 'o desejo: o brilho que faz a vida valer a pena',
      titulo: 'A que nasceu da espuma',
      texto: 'Afrodite nasceu adulta da espuma do mar e foi levada pelo vento até a ilha de Chipre. Onde ela pisava, nascia grama. Deusa da beleza, do amor e da criação, seguia o próprio desejo, e os seus amores eram de ida e volta: desejava e era desejada. O seu poder era dar vida às coisas. Quando o escultor Pigmalião se apaixonou pela estátua que tinha feito, foi Afrodite quem ouviu o pedido dele: o mármore ficou morno, e a estátua abriu os olhos.',
      reconhece: [
        'Reparo em cores, cheiros e texturas que ninguém nota.',
        'Gosto de deixar as coisas bonitas, mesmo as pequenas.',
        'Quando me apaixono por uma ideia, mergulho de cabeça.',
        'Me sinto viva quando danço, crio ou estou com quem gosto.'
      ],
      par: {
        atena: 'Atena pensa; Afrodite sente o gosto da vida. Com ela ao lado, os seus planos ganham beleza, e sobra espaço para o que não tem utilidade nenhuma além de dar prazer.',
        artemis: 'Ártemis corre atrás do alvo; Afrodite lembra de aproveitar o caminho. Com as duas, a sua independência tem também encanto, corpo e alegria.',
        hestia: 'Héstia guarda o silêncio; Afrodite traz a música. Com ela por perto, a sua calma tem cor, e o recolhimento vira também prazer.',
        hera: 'Hera dá continuidade; Afrodite dá chama. Com as duas, o compromisso não vira rotina: a parceria segue viva, com desejo e surpresa.',
        demeter: 'Deméter cuida de todos; Afrodite lembra que você também merece prazer. Com ela ao lado, o seu cuidado inclui você, e a vida deixa de ser só dever.',
        persefone: 'Perséfone sente; Afrodite cria a partir do que sente. Com ela por perto, a sua sensibilidade vira arte, beleza e presença.'
      }
    }
  }
};
