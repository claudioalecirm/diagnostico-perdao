// api/enviar.js — Diagnóstico de Perdão · Claudio Alecrim
// Recebe: nome, email, telefone, perfil, vinculoPrimario, vinculoSecundario, somaIntensidade
// Faz: monta HTML da devolutiva → Resend (aluno) + Resend (Claudio) + Notion

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const {
    nome,
    email,
    telefone,
    perfil,
    vinculoPrimario,
    vinculoSecundario,
    somaIntensidade,
  } = req.body;

  if (!nome || !email || !perfil || !vinculoPrimario) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  // ── Conteúdo fixo por perfil ────────────────────────────────────────────

  const PERFIS = {
    LIVRE: {
      nome:        'Livre',
      subtitulo:   'A ferida existiu. Mas você não está sendo governado por ela.',
      descricao:   'Seu diagnóstico aponta para uma pessoa que, em grande medida, já passou pelo processo de soltar. Isso não significa que você nunca foi ferido — significa que a ferida não está mais no comando. Você consegue lembrar sem ser sequestrado pela memória. Consegue falar do assunto sem que o peito aperte do mesmo jeito que antes.',
      pratica:     'Na prática, isso aparece assim: quando o nome da pessoa surge numa conversa, você não precisa mudar de assunto. Quando uma situação parecida acontece, você não reage da mesma forma de antes. Há espaço entre o estímulo e a resposta — e esse espaço é sinal de que o processo aconteceu, mesmo que de forma incompleta.',
      custo:       'Mesmo no perfil Livre, o perdão tem camadas. O que você processou foi real. Mas há uma diferença entre não carregar mais e ter libertado completamente. O custo agora é menor — mas pode estar nas margens: na forma como você age em situações semelhantes, nas histórias que você conta sobre o passado, na presença ou ausência de empatia por quem ainda está preso onde você já esteve.',
      custo_rel:   'Relacionamentos leves, mas com possíveis áreas de reserva não nomeadas.',
      custo_dec:   'Decisões mais livres, sem o peso reativo de quem ainda está preso.',
      custo_esp:   'Oração sem grandes bloqueios, mas com áreas que ainda precisam de entrega consciente.',
      virada:      'A liberdade que você já tem é um capital real. A próxima etapa não é resolver uma crise — é consolidar o que foi liberado e garantir que as últimas camadas não fiquem escondidas debaixo de uma performance de superação. Há uma diferença entre ter perdoado e ter transformado. Você já deu o primeiro passo. O processo de mentoria existe para que o que foi iniciado se torne estrutura permanente.',
      frase:       'Você não está mais preso. Mas há territórios que ainda esperam ser habitados com liberdade.',
      cta:         'Você tem algo raro: o início de um caminho já percorrido. A mentoria com Claudio existe justamente para esse momento — quando você não precisa mais de socorro, mas quer profundidade real. Use o fôlego que você já tem para construir o que vem a seguir.',
    },
    PROCESSANDO: {
      nome:        'Processando',
      subtitulo:   'Você sabe que tem algo a resolver. E já está em movimento.',
      descricao:   'Você não está ignorando. Você sabe que tem uma conta aberta com o perdão — e em algum momento, de alguma forma, começou a encarar isso. O bloqueio existe, mas não está te paralisando completamente. Há dias que é mais leve. Há dias que a memória pesa mais. Você está no meio do processo.',
      pratica:     'Na prática: você consegue falar sobre o que aconteceu sem entrar em colapso, mas ainda sente o peso quando o assunto surge de verdade. Em algumas situações, a reação ainda é mais intensa do que deveria ser. Você sabe que precisa avançar — mas ainda não encontrou a estrutura certa para isso.',
      custo:       'O risco do perfil Processando é a ilusão de progresso sem conclusão. Você já iniciou — e isso é real. Mas processo sem estrutura pode virar loop. Você pode ficar anos processando sem de fato liberar. O custo não é imobilidade — é energia desperdiçada em algo que poderia ser resolvido.',
      custo_rel:   'Relações com períodos de abertura e fechamento. Ainda há testes de confiança implícitos.',
      custo_dec:   'Decisões influenciadas nos momentos de maior pressão emocional.',
      custo_esp:   'Oração com oscilações. Momentos de proximidade genuína e momentos de distância.',
      virada:      'Você já iniciou. Isso é mais do que a maioria dos homens faz. A diferença entre quem processa e quem conclui não é força de vontade — é estrutura e acompanhamento. O fôlego que você vai ganhar na Mesa de Governo não é o fim da jornada: é o impulso que falta para dar o passo seguinte com quem entende onde você está.',
      frase:       'Você iniciou. O que falta agora não é coragem — é estrutura para concluir.',
      cta:         'Você está no ponto certo para iniciar a mentoria. Não porque está quebrado — mas porque já está em movimento e sabe que processo sem estrutura vira loop. O fôlego que você ganhou na Mesa de Governo é o ponto de partida certo para ir além do processamento e chegar na liberdade de verdade.',
    },
    PRESO: {
      nome:        'Preso',
      subtitulo:   'Há um peso real aqui. Você carrega isso há mais tempo do que admite.',
      descricao:   'Seu diagnóstico aponta para um bloqueio ativo. Não é uma impressão — é uma leitura clara do que suas respostas revelaram. Há algo que aconteceu, alguém que te feriu de uma forma que ainda tem efeito hoje. Você pode não nomear isso como falta de perdão — pode chamar de mágoa, de precaução, de cuidado. Mas o padrão é o mesmo.',
      pratica:     'Na prática, isso aparece assim: há assuntos que você evita. Há pessoas cujo nome muda seu humor sem você perceber. Há situações que deveriam ser neutras mas ativam algo dentro de você que não tem proporção com o momento atual. O passado está votando no seu presente — e você provavelmente já sentiu isso.',
      custo:       'Ninguém carrega esse peso de graça. O custo do perfil Preso é progressivo e silencioso — vai tomando espaço nas suas relações, nas suas decisões, no seu limite de intimidade com Deus. Não é dramático. É lento. É o tipo de coisa que, daqui a dez anos, você vai olhar para trás e perceber o quanto ficou na mesa.',
      custo_rel:   'Relações com teto de profundidade. Proximidade que chega num ponto e não avança mais.',
      custo_dec:   'Decisões com componente defensivo embutido — proteger ao invés de construir.',
      custo_esp:   'Bloqueio na oração especialmente nas áreas onde a ferida está concentrada.',
      virada:      'Soltar esse peso não é fraqueza. É a decisão mais estratégica que um homem pode tomar. O que você não resolve hoje continua votando amanhã — nas suas relações, na sua liderança, na sua caminhada espiritual. A Mesa de Governo foi o primeiro movimento. A mentoria é onde esse processo ganha estrutura, continuidade e resultado real.',
      frase:       'O que você não resolve continua governando — só que por baixo dos panos.',
      cta:         'O fôlego que você ganhou na Mesa de Governo é real. Mas o perfil Preso precisa de mais do que um evento — precisa de processo. A mentoria com Claudio existe para isso: transformar o movimento iniciado em libertação estruturada. Não deixa o ímpeto de hoje virar lembrança amanhã.',
    },
    ACORRENTADO: {
      nome:        'Acorrentado',
      subtitulo:   'O bloqueio de perdão está ditando padrões importantes da sua vida.',
      descricao:   'Seu diagnóstico é direto: há um peso pesado aqui. Não é apenas uma mágoa — é uma estrutura interna construída ao longo do tempo para sobreviver a algo que foi injusto, doloroso ou que não devia ter acontecido. Você não precisava de mais informação para saber disso. Mas agora você tem o espelho em mãos.',
      pratica:     'Na prática, esse perfil aparece em tudo: na dificuldade de confiar, na necessidade de controle, na fadiga que não tem explicação racional, nos conflitos que se repetem com personagens diferentes. A ferida não ficou no passado — ela se instalou como filtro. Tudo que entra na sua vida passa por ela antes de chegar em você.',
      custo:       'O custo do perfil Acorrentado é alto e concreto: ele limita o quanto você consegue receber de qualquer relação, o quanto você consegue se aproximar de Deus de verdade, o quanto você consegue liderar sem o peso defensivo que transforma liderança em controle. Você pode estar funcionando bem por fora. Mas há um teto invisível em tudo — e você já sentiu isso.',
      custo_rel:   'Relações com padrão de ruptura, distância ou dependência disfuncional.',
      custo_dec:   'Decisões marcadas por hipervigilância, necessidade de controle ou fuga de risco.',
      custo_esp:   'Relação com Deus mediada pela ferida — dificuldade de confiar, de entregar, de receber.',
      virada:      'A corrente não define quem você é — define o que está te impedindo de ser. Essa distinção muda tudo. Você não está quebrado. Você está carregando algo que foi pesado demais para ser resolvido sozinho. O fôlego que você vai ganhar na Mesa de Governo é o primeiro ar limpo. A mentoria é onde você aprende a respirar de novo — com estrutura, com acompanhamento, com alguém que entende o caminho.',
      frase:       'Você não está quebrado. Você está carregando algo que não precisa mais ser seu.',
      cta:         'O perfil Acorrentado é o que mais precisa de estrutura — e o que mais transforma quando o processo acontece de verdade. O evento da Mesa de Governo foi o início de um movimento que não pode parar aqui. A mentoria com Claudio é o próximo passo natural: onde o que foi desamarrado começa a se tornar liberdade permanente.',
    },
  };

  // ── Conteúdo fixo por vínculo ───────────────────────────────────────────

  const VINCULOS = {
    'Figura de Autoridade': {
      descricao: 'A ferida com uma figura de autoridade é das mais profundas porque chegou cedo. Veio de quem deveria proteger, direcionar e validar. Quando essa figura falha, abandona, controla ou fere — o impacto não fica só na memória. Ele se instala como um filtro para toda relação de autoridade que vem depois.',
      leitura:   'Seu padrão de resposta a líderes, mentores e figuras de referência está sendo influenciado por algo que aconteceu antes. Isso pode aparecer como desconfiança automática, necessidade de aprovação excessiva, ou dificuldade de se submeter sem sentir ameaça. O perdão aqui não é absolver o que foi errado — é soltar o filtro que esse erro instalou em você.',
    },
    'Vínculos Próximos': {
      descricao: 'A traição de um igual dói diferente da de uma autoridade. Você não esperava proteção — esperava lealdade. Quando um amigo, irmão ou sócio falha, abandona, trai ou usa, o impacto vai direto para a capacidade de confiar em quem está perto.',
      leitura:   'Você provavelmente construiu, com o tempo, um sistema de proteção nas relações próximas: mantém distância estratégica, testa as pessoas antes de abrir, ou estabelece expectativas baixas como forma de não ser pego de surpresa. Esse sistema funcionou para te proteger. Mas agora ele também te isola. O perdão aqui não é voltar a ser vulnerável de qualquer jeito — é poder escolher confiar de novo, quando fizer sentido.',
    },
    'Relacionamento Íntimo': {
      descricao: 'A ferida no relacionamento íntimo tem um lugar especial — porque esse é o vínculo onde você mais se expôs. Onde você foi mais verdadeiro. Quando a rejeição, a traição ou o abandono vêm de dentro desse vínculo, o impacto vai além da relação. Atinge a forma como você se enxerga.',
      leitura:   'Esse tipo de ferida costuma aparecer na sua relação atual — ou na dificuldade de construir uma. Pode ser excesso de controle, ciúme não proporcional, distância emocional como proteção, ou uma sensação de que intimidade real é perigosa demais. O perdão aqui é um dos mais difíceis — e um dos que mais liberam quando acontece de verdade.',
    },
    'Contexto e Instituições': {
      descricao: 'Há feridas que não têm um rosto específico — têm um ambiente, um sistema, uma instituição. A igreja que julgou. A empresa que descartou. O sistema que falhou. Esse tipo de ferida é mais difícil de nomear porque não tem um culpado claro — mas o impacto é tão real quanto qualquer outro.',
      leitura:   'Você provavelmente tem uma relação ambivalente com estruturas coletivas: igrejas, organizações, empresas, comunidades. Parte de você quer pertencer — parte ficou em guarda desde que algo deu errado num contexto assim. O perdão aqui não é validar o que foi feito de errado. É soltar a amargura que impede você de se conectar de verdade com qualquer comunidade que venha depois.',
    },
    'Perdão de Si Mesmo': {
      descricao: 'Há feridas que não vieram de fora — ou vieram, mas você se tornou o principal executor da punição. Erros que você não consegue largar. Decisões que você ainda julga com dureza. Uma voz interna que cobra além do necessário. Essa é, muitas vezes, a conta mais difícil de fechar.',
      leitura:   'O perdão de si mesmo não é autoindulgência. É o reconhecimento de que você não precisa mais se punir pelo que já foi. Que arrependimento sem perdão próprio vira ciclo — e ciclo vira prisão. Você pode estar carregando culpa por algo que já foi resolvido do lado de fora — mas ainda não foi resolvido dentro. Esse é o território onde a graça precisa entrar de verdade.',
    },
  };

  const p  = PERFIS[perfil]              || PERFIS['PROCESSANDO'];
  const v1 = VINCULOS[vinculoPrimario]   || VINCULOS['Figura de Autoridade'];
  const v2 = VINCULOS[vinculoSecundario] || null;

  // ── Monta HTML do email ─────────────────────────────────────────────────

  const primeiroNome = nome.split(' ')[0];

  const htmlEmail = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Seu Diagnóstico de Perdão</title>
</head>
<body style="margin:0;padding:20px 0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;">
<div style="max-width:620px;margin:0 auto;background:#111111;border:1px solid #1e1e1e;">

  <!-- CABEÇALHO -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background:#0d0d0d;padding:28px 40px 24px;border-bottom:3px solid #c8a97a;">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;">Diagnóstico de Perdão</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;">Claudio Alecrim</p>
      </td>
    </tr>
  </table>

  <!-- SAUDAÇÃO -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;">Seu resultado</p>
        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;font-weight:400;line-height:1.3;color:#e8e0d4;">${primeiroNome}, seu diagnóstico está aqui.</h1>
        <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;color:#9a8a7a;">O que você vai ler a seguir não é uma sentença — é um espelho. Não existe resposta certa ou errada. Existe o que você realmente está carregando. E a única coisa que importa agora é o que você vai fazer com isso.</p>
        <div style="height:1px;background:#1e1e1e;"></div>
      </td>
    </tr>
  </table>

  <!-- BLOCO 1: PERFIL DE INTENSIDADE -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c8a97a;">Nível de Bloqueio</p>
        <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#e8e0d4;">Seu perfil de perdão</h2>

        <div style="background:#0d0d0d;border:1px solid #2a2a2a;border-left:4px solid #c8a97a;padding:20px 24px;margin-bottom:16px;">
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;">Seu perfil</p>
          <p style="margin:0 0 10px;font-family:Georgia,serif;font-size:26px;font-style:italic;color:#c8a97a;">${p.nome}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#7a6a5a;">${p.subtitulo}</p>
        </div>

        <div style="background:#0a0a0a;border:1px solid #1e1e1e;padding:18px 22px;margin-bottom:16px;">
          <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">O que isso significa</p>
          <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:#9a8a7a;">${p.descricao}</p>
        </div>

        <div style="background:#0a0a0a;border:1px solid #1e1e1e;padding:18px 22px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">Como aparece na prática</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:#9a8a7a;">${p.pratica}</p>
        </div>

        <div style="height:1px;background:#1e1e1e;"></div>
      </td>
    </tr>
  </table>

  <!-- BLOCO 2: VÍNCULO FERIDO -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c8a97a;">Onde está concentrado</p>
        <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#e8e0d4;">O vínculo mais afetado</h2>
        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;font-style:italic;color:#5a4a3a;">O tipo de relação onde a ferida costuma estar mais ativa</p>

        <!-- Card vínculo primário -->
        <div style="background:#0d0d0d;border:1px solid #2a2a2a;border-top:3px solid #c8a97a;padding:18px 22px;margin-bottom:12px;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">Vínculo Primário</p>
          <p style="margin:0 0 10px;font-family:Georgia,serif;font-size:18px;color:#e8e0d4;">${vinculoPrimario}</p>
          <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#9a8a7a;">${v1.descricao}</p>
        </div>

        ${v2 ? `<!-- Card vínculo secundário -->
        <div style="background:#0d0d0d;border:1px solid #2a2a2a;border-top:3px solid #3a3020;padding:18px 22px;margin-bottom:12px;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">Vínculo Secundário</p>
          <p style="margin:0 0 10px;font-family:Georgia,serif;font-size:18px;color:#e8e0d4;">${vinculoSecundario}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#9a8a7a;">${v2.descricao}</p>
        </div>` : ''}

        <!-- Leitura combinada -->
        <div style="border-left:3px solid #c8a97a;padding:16px 20px;background:#0d0d0d;margin-bottom:24px;">
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">O que isso revela</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:#9a8a7a;">${v1.leitura}</p>
        </div>

        <div style="height:1px;background:#1e1e1e;"></div>
      </td>
    </tr>
  </table>

  <!-- BLOCO 3: O QUE ESTÁ CUSTANDO -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c8a97a;">O preço que você paga</p>
        <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#e8e0d4;">O que esse bloqueio está custando</h2>
        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;font-style:italic;color:#5a4a3a;">Ninguém carrega esse peso de graça</p>

        <div style="border-left:3px solid #c8a97a;padding:18px 22px;background:#0d0d0d;margin-bottom:16px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#e8e0d4;font-style:italic;">${p.custo}</p>
        </div>

        <!-- 3 cards de impacto -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr>
            <td width="33%" style="padding-right:6px;vertical-align:top;">
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;padding:14px;text-align:center;">
                <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">Relações</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#9a8a7a;">${p.custo_rel}</p>
              </div>
            </td>
            <td width="33%" style="padding:0 3px;vertical-align:top;">
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;padding:14px;text-align:center;">
                <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">Decisões</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#9a8a7a;">${p.custo_dec}</p>
              </div>
            </td>
            <td width="33%" style="padding-left:6px;vertical-align:top;">
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;padding:14px;text-align:center;">
                <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">Espiritualidade</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#9a8a7a;">${p.custo_esp}</p>
              </div>
            </td>
          </tr>
        </table>

        <div style="height:1px;background:#1e1e1e;"></div>
      </td>
    </tr>
  </table>

  <!-- BLOCO 4: O OUTRO LADO -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c8a97a;">O contraste</p>
        <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#e8e0d4;">O que muda quando esse peso vai embora</h2>
        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;font-style:italic;color:#5a4a3a;">Perdão não é esquecimento — é a decisão de não deixar o passado governar o presente</p>

        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:#9a8a7a;">${p.virada}</p>

        <div style="background:#0d0d0d;border:1px solid #2a2a2a;padding:22px;margin-bottom:24px;text-align:center;">
          <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;line-height:1.6;color:#c8a97a;">"${p.frase}"</p>
        </div>

        <div style="height:1px;background:#1e1e1e;"></div>
      </td>
    </tr>
  </table>

  <!-- BLOCO 5: CTA -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c8a97a;">O próximo passo</p>
        <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#e8e0d4;">Isso tem solução — e ela tem um caminho.</h2>

        <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:#9a8a7a;">${p.cta}</p>

        <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:#9a8a7a;">O perdão é um processo — e processos precisam de estrutura, de acompanhamento e de alguém que já entende o que está acontecendo dentro de você. O fôlego que você ganhou na Mesa de Governo é o ponto de partida. A mentoria é onde esse movimento se torna resultado permanente.</p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr>
            <td style="text-align:center;padding:8px 0;">
              <a href="https://claudioalecrim.com.br"
                 style="display:inline-block;background:#c8a97a;color:#0a0a0a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 32px;font-weight:700;">
                Quero iniciar minha mentoria com Claudio Alecrim
              </a>
            </td>
          </tr>
        </table>

        <div style="height:1px;background:#1e1e1e;"></div>
      </td>
    </tr>
  </table>

  <!-- ASSINATURA -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:28px 40px 32px;">
        <div style="background:#0d0d0d;border:1px solid #1e1e1e;padding:20px 24px;">
          <p style="margin:0 0 2px;font-family:Georgia,serif;font-size:17px;color:#ffffff;font-weight:700;">Claudio Alecrim</p>
          <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:12px;color:#4a4035;">Mentor de Homens · Governo Pessoal</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#c8a97a;">claudioalecrim.com.br</p>
        </div>
      </td>
    </tr>
  </table>

  <!-- RODAPÉ -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background:#0a0a0a;border-top:1px solid #1e1e1e;padding:20px 40px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#3a3030;text-align:center;line-height:1.7;">
          Claudio Alecrim · Diagnóstico de Perdão<br>claudioalecrim.com.br
        </p>
      </td>
    </tr>
  </table>

</div>
</body>
</html>`;

  // ── Email resumo para Claudio ───────────────────────────────────────────

  const htmlClaudio = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#0a0a0a;font-family:Arial,sans-serif;color:#e8e0d4;">
<div style="max-width:520px;margin:0 auto;background:#111;border:1px solid #1e1e1e;padding:32px;">
  <p style="margin:0 0 4px;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;">Novo lead</p>
  <h2 style="margin:0 0 24px;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#c8a97a;">Diagnóstico de Perdão</h2>
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#5a4a3a;width:40%;">Nome</td><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#e8e0d4;">${nome}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#5a4a3a;">Email</td><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#e8e0d4;">${email}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#5a4a3a;">WhatsApp</td><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#e8e0d4;">${telefone}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#5a4a3a;">Perfil</td><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#c8a97a;font-weight:700;">${perfil}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#5a4a3a;">Pontuação</td><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#e8e0d4;">${somaIntensidade}/30</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#5a4a3a;">Vínculo Primário</td><td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#e8e0d4;">${vinculoPrimario}</td></tr>
    <tr><td style="padding:8px 0;font-size:13px;color:#5a4a3a;">Vínculo Secundário</td><td style="padding:8px 0;font-size:14px;color:#e8e0d4;">${vinculoSecundario}</td></tr>
  </table>
</div>
</body>
</html>`;

  // ── Envios em paralelo: email aluno + email Claudio + Notion ────────────

  const RESEND_KEY  = process.env.RESEND_API_KEY;
  const NOTION_KEY  = process.env.NOTION_TOKEN;
  const NOTION_DB   = process.env.NOTION_DB_PERDAO || '6c2ccb678e614316ae4ef5dd50341c18';
  const FROM        = 'resultado@claudioalecrim.com.br';
  const EMAIL_ADMIN = 'resultado.mesadegoverno@gmail.com';

  const [resAluno, resClaudio, resNotion] = await Promise.allSettled([

    // Email para o respondente
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: `${primeiroNome}, seu Diagnóstico de Perdão está aqui`,
        html: htmlEmail,
      }),
    }),

    // Notificação para Claudio
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [EMAIL_ADMIN],
        subject: `Novo lead: ${nome} — ${perfil}`,
        html: htmlClaudio,
      }),
    }),

    // Salvar no Notion
    fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB },
        properties: {
          'Nome': {
            title: [{ text: { content: nome } }],
          },
          'Email': {
            email: email,
          },
          'Telefone': {
            phone_number: telefone,
          },
          'Perfil': {
            select: { name: perfil },
          },
          'Pontuação': {
            number: somaIntensidade,
          },
          'Vínculo Primário': {
            select: { name: vinculoPrimario },
          },
          'Vínculo Secundário': {
            select: { name: vinculoSecundario },
          },
          'Status': {
            select: { name: 'Novo' },
          },
        },
      }),
    }),

  ]);

  // Loga erros sem quebrar o fluxo
  if (resAluno.status === 'rejected') {
    console.error('Resend aluno:', resAluno.reason);
  }
  if (resClaudio.status === 'rejected') {
    console.error('Resend Claudio:', resClaudio.reason);
  }
  if (resNotion.status === 'rejected') {
    console.error('Notion:', resNotion.reason);
  }

  // Só retorna erro pro usuário se o email principal falhou
  if (resAluno.status === 'rejected') {
    return res.status(500).json({ error: 'Erro ao enviar email. Tente novamente.' });
  }

  const emailStatus = await resAluno.value.json().catch(() => ({}));
  if (resAluno.value && !resAluno.value.ok) {
    console.error('Resend error body:', emailStatus);
    return res.status(500).json({ error: 'Erro ao enviar email. Tente novamente.' });
  }

  return res.status(200).json({ ok: true });
}
