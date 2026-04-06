import { useState, useEffect, useRef } from "react";

// ============================================================
// PERGUNTAS — linguagem neutra, intenção oculta: padrão de perdão
// ============================================================
const PERGUNTAS = [
  {
    id: 1,
    texto: "Quando alguém te decepciona de forma séria, qual é a sua reação mais honesta nos dias seguintes?",
    opcoes: [
      "Fico bem rápido, prefiro não ficar preso nisso",
      "Processo internamente mas demoro para voltar ao normal",
      "Fico repassando a situação várias vezes na cabeça",
      "Mantenho distância e dificilmente volto ao mesmo nível de proximidade",
    ],
  },
  {
    id: 2,
    texto: "Você consegue lembrar com detalhes de situações em que foi prejudicado por alguém há mais de 3 anos?",
    opcoes: [
      "Raramente — o tempo apaga bastante",
      "Às vezes, quando algo me lembra",
      "Sim, com clareza de detalhes e sentimentos",
      "Sim, e ainda sinto algo quando lembro",
    ],
  },
  {
    id: 3,
    texto: "Quando pensa em uma pessoa específica com quem teve um conflito grave, o que acontece dentro de você?",
    opcoes: [
      "Nada em especial — já passei por isso",
      "Um leve desconforto, mas consigo manter paz",
      "Uma tensão que prefiro não explorar",
      "Uma mistura de raiva, tristeza ou mágoa que ainda está viva",
    ],
  },
  {
    id: 4,
    texto: "Como você reage quando alguém próximo comete o mesmo erro pela segunda ou terceira vez?",
    opcoes: [
      "Converso novamente e tento entender",
      "Começo a criar reservas internamente",
      "Reduz significativamente minha confiança nessa pessoa",
      "Encerro ou redefino o nível da relação",
    ],
  },
  {
    id: 5,
    texto: "Em que medida situações do passado influenciam como você age em relacionamentos hoje?",
    opcoes: [
      "Pouco — cada situação é nova para mim",
      "Um pouco — às vezes pego padrões antigos",
      "Bastante — tenho dificuldade de separar",
      "Muito — sinto que carrego peso de relações passadas",
    ],
  },
  {
    id: 6,
    texto: "Você consegue distinguir claramente quem você é hoje de quem te machucou no passado?",
    opcoes: [
      "Sim, com clareza total",
      "Na maioria das vezes sim",
      "Às vezes confundo minhas reações com o que aprendi naquelas situações",
      "Tenho dificuldade — sinto que aquilo me moldou de formas que ainda não entendo bem",
    ],
  },
  {
    id: 7,
    texto: "Quando você imagina o futuro da sua vida — realizações, relacionamentos, propósito — aparece algum peso ou sensação de bloqueio?",
    opcoes: [
      "Não — vejo o futuro com leveza",
      "Uma leve hesitação às vezes",
      "Sim, sinto que algo me segura",
      "Sim, e não sei exatamente de onde vem",
    ],
  },
  {
    id: 8,
    texto: "Como você lida com pessoas que te fizeram mal e continuam presentes na sua vida (família, trabalho, contexto social)?",
    opcoes: [
      "Com tranquilidade — consigo interagir normalmente",
      "Com cuidado — mantenho distância emocional",
      "Com tensão — preferia não precisar lidar",
      "É uma fonte constante de desconforto interno",
    ],
  },
  {
    id: 9,
    texto: "Você acredita que as pessoas que te prejudicaram merecem bem-estar e prosperidade na vida delas?",
    opcoes: [
      "Sim, genuinamente desejo isso",
      "Racionalmente sei que devo querer, mas sinto resistência",
      "Honestamente? Não sinto isso naturalmente",
      "Esse pensamento me incomoda ou gera conflito interno",
    ],
  },
  {
    id: 10,
    texto: "Quando algo dá errado na sua vida hoje — um fracasso, uma perda — você conecta isso a algo que aconteceu antes?",
    opcoes: [
      "Raramente — analiso cada situação separadamente",
      "Às vezes sim, mas de forma passageira",
      "Com frequência, vejo padrões que se repetem",
      "Sinto que estou pagando por algo ou que as coisas não mudam para mim",
    ],
  },
  {
    id: 11,
    texto: "Como você se sente quando alguém que te prejudicou parece estar indo bem na vida?",
    opcoes: [
      "Neutro — a vida delas não tem a ver comigo",
      "Um leve incômodo que passo rápido",
      "Injustiça — sinto que deveria ser diferente",
      "Uma reação forte que me surpreende ou me envergonha",
    ],
  },
  {
    id: 12,
    texto: "Você consegue falar sobre episódios dolorosos do passado sem que sua emoção seja ativada no momento?",
    opcoes: [
      "Sim, com facilidade",
      "Na maioria das vezes sim",
      "Depende muito do episódio",
      "Não — falar sobre isso ainda mexe comigo",
    ],
  },
  {
    id: 13,
    texto: "Que papel a figura paterna ou de liderança teve na forma como você lida com traições e decepções hoje?",
    opcoes: [
      "Tive bons modelos — aprendi a lidar bem",
      "Foi neutro — nem positivo nem negativo",
      "Faltou referência — tive que descobrir sozinho",
      "Foi uma fonte de decepção que ainda ressoa em mim",
    ],
  },
  {
    id: 14,
    texto: "Você já tomou decisões importantes na sua vida — sobre carreira, relacionamentos, propósito — motivado principalmente pelo que não queria que acontecesse?",
    opcoes: [
      "Raramente — decido mais pelo que quero alcançar",
      "Às vezes — um mix dos dois",
      "Com frequência — o medo de repetir algo ruim guia bastante",
      "Sim, boa parte das minhas escolhas vem de um lugar de fuga",
    ],
  },
  {
    id: 15,
    texto: "Se você pudesse encerrar completamente a influência que o passado tem sobre você hoje, o que mudaria na sua vida?",
    opcoes: [
      "Pouca coisa — já estou bem resolvido",
      "Algumas relações melhorariam",
      "Minha paz interior seria muito maior",
      "Tudo mudaria — sinto que o passado ainda controla partes importantes de mim",
    ],
  },
];

// ============================================================
// SISTEMA DE PONTUAÇÃO (0-3 por resposta, 0 = mais leve, 3 = mais preso)
// ============================================================
const PESOS = [0, 1, 2, 3];

function calcularPerfil(respostas) {
  const total = respostas.reduce((acc, r) => acc + PESOS[r], 0);
  const max = PERGUNTAS.length * 3;
  const pct = (total / max) * 100;

  if (pct <= 25) return "LIVRE";
  if (pct <= 50) return "PROCESSANDO";
  if (pct <= 75) return "PRESO";
  return "ACORRENTADO";
}

// ============================================================
// CHAMADA À API CLAUDE
// ============================================================
async function gerarDevolutiva(nome, respostas) {
  const perfil = calcularPerfil(respostas);
  const totalPontos = respostas.reduce((acc, r) => acc + PESOS[r], 0);

  const resumoRespostas = PERGUNTAS.map((p, i) => ({
    pergunta: p.texto,
    resposta: p.opcoes[respostas[i]],
  }));

  const prompt = `Você é Claudio Alecrim, mentor de homens. Tom: direto, confrontador, com autoridade espiritual e emocional. Sem clichês motivacionais. Fala como quem conhece o homem por dentro.

O homem se chama ${nome}. Ele respondeu um diagnóstico emocional. Perfil calculado: ${perfil}. Pontuação: ${totalPontos}/${PERGUNTAS.length * 3}.

Respostas dele:
${resumoRespostas.map((r, i) => `${i + 1}. ${r.pergunta}\nResposta: ${r.resposta}`).join("\n\n")}

Escreva uma devolutiva pessoal e impactante em formato JSON com esta estrutura exata:
{
  "titulo": "título forte e personalizado com o nome dele",
  "abertura": "1 parágrafo direto que descreve o padrão emocional dele sem usar a palavra perdão — como se você o conhecesse por dentro (4-6 linhas)",
  "padrao": "nome do padrão emocional que você identifica nele (ex: 'O Guardião das Feridas', 'O Homem em Guarda', 'O Prisioneiro Silencioso', 'O Arquivista da Dor')",
  "descricao_padrao": "2 parágrafos descrevendo como esse padrão opera na vida dele — comportamentos, relações, decisões — sem citar perdão diretamente",
  "custo": "1 parágrafo confrontador sobre o que esse padrão está custando para ele hoje — seja específico e duro",
  "virada": "1 parágrafo que abre a porta — o que muda quando esse peso vai embora. Não prometa, mostre o contraste.",
  "chamada": "1 frase poderosa de encerramento que convida sem implorar"
}

Responda APENAS o JSON. Sem explicações, sem markdown, sem texto fora do JSON.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  }),
});

  const data = await response.json();
  const text = data.content[0].text.trim();
  return JSON.parse(text);
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function DiagnosticoPerdao() {
  const [etapa, setEtapa] = useState("intro"); // intro | dados | perguntas | carregando | devolutiva
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [devolutiva, setDevolutiva] = useState(null);
  const [erro, setErro] = useState("");
  const [animating, setAnimating] = useState(false);
  const progressRef = useRef(null);

  const perfil = respostas.length === PERGUNTAS.length ? calcularPerfil(respostas) : null;

  const PERFIL_CORES = {
    LIVRE: { bg: "#1a2e1a", accent: "#4ade80", label: "Caminho Aberto" },
    PROCESSANDO: { bg: "#1e2a1e", accent: "#86efac", label: "Em Movimento" },
    PRESO: { bg: "#2d1a1a", accent: "#f87171", label: "Peso Interno" },
    ACORRENTADO: { bg: "#1f0a0a", accent: "#ef4444", label: "Bloqueio Profundo" },
  };

  // ⚠️ Cole aqui a URL do webhook gerada no Make (passo 2.1 do guia)
  const WEBHOOK_MAKE_URL = "https://hook.us2.make.com/nf93l27rjl27o3d6scayax3nldlz8yx9";

  // ⚠️ Cole aqui o link da sua página de mentoria ou WhatsApp
  const LINK_MENTORIA = "https://wa.me/55SEUNUMERO";

  async function iniciarDevolutiva(respostasFinais) {
    setEtapa("carregando");
    try {
      const resultado = await gerarDevolutiva(nome, respostasFinais);
      const perfilCalculado = calcularPerfil(respostasFinais);
      const pontuacao = respostasFinais.reduce((acc, r) => acc + PESOS[r], 0);

      setDevolutiva(resultado);
      setEtapa("devolutiva");

      // Monta HTML da devolutiva para o email (com pitch de mentoria)
      const devolutivaHtml = `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#222;padding:40px 24px;background:#fff;">
          <p style="font-size:11px;color:#aaa;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Claudio Alecrim · Diagnóstico Pessoal</p>
          <h1 style="font-size:26px;font-weight:400;line-height:1.3;margin:0 0 20px;color:#111;">${resultado.titulo}</h1>
          <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 24px;">${resultado.abertura}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;"/>
          <p style="font-size:17px;font-style:italic;color:#8a6a3a;margin:0 0 8px;">${resultado.padrao}</p>
          <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 20px;">${resultado.descricao_padrao}</p>
          <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 20px;">${resultado.custo}</p>
          <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 24px;">${resultado.virada}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;"/>
          <p style="font-size:17px;font-style:italic;color:#111;margin:0 0 32px;">${resultado.chamada}</p>
          <div style="background:#faf7f2;border-left:3px solid #c8a97a;padding:24px;border-radius:2px;">
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 12px;">
              Este diagnóstico revelou um padrão que, quando trabalhado com intenção, abre caminho para relacionamentos mais livres, decisões mais claras e um propósito sem o peso do passado.
            </p>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
              Se quiser aprofundar esse trabalho de forma individual e estruturada, a Mentoria Governo Pessoal foi criada exatamente para isso.
            </p>
            <a href="${LINK_MENTORIA}" style="display:inline-block;background:#c8a97a;color:#fff;padding:12px 28px;text-decoration:none;font-size:13px;font-weight:500;font-family:sans-serif;letter-spacing:1px;">
              CONHECER A MENTORIA
            </a>
          </div>
          <p style="font-size:11px;color:#bbb;margin:32px 0 0;text-align:center;">Claudio Alecrim · resultado.mesadegoverno@gmail.com</p>
        </div>
      `;

      // Disparo silencioso do webhook Make (não bloqueia a UI)
      if (WEBHOOK_MAKE_URL !== "COLE_AQUI_A_URL_DO_WEBHOOK_MAKE") {
        fetch(WEBHOOK_MAKE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            email,
            perfil: perfilCalculado,
            pontuacao,
            devolutiva_html: devolutivaHtml,
          }),
        }).catch(() => {}); // silencia erros de rede — não impede a devolutiva
      }

    } catch (e) {
      setErro("Erro ao gerar devolutiva. Tente novamente.");
      setEtapa("perguntas");
      setPerguntaAtual(PERGUNTAS.length - 1);
    }
  }

  function responder(indice) {
    if (animating) return;
    setAnimating(true);
    const novasRespostas = [...respostas, indice];
    setRespostas(novasRespostas);

    setTimeout(() => {
      if (perguntaAtual < PERGUNTAS.length - 1) {
        setPerguntaAtual((p) => p + 1);
        setAnimating(false);
      } else {
        iniciarDevolutiva(novasRespostas);
      }
    }, 400);
  }

  const progresso = ((perguntaAtual) / PERGUNTAS.length) * 100;

  // ============================================================
  // ESTILOS GLOBAIS
  // ============================================================
  const estilos = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #0a0a0a;
      color: #e8e0d4;
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
    }

    .app {
      min-height: 100vh;
      background: #0a0a0a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      position: relative;
      overflow: hidden;
    }

    .app::before {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at 30% 20%, rgba(139,90,43,0.08) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(80,50,20,0.06) 0%, transparent 50%);
      pointer-events: none;
    }

    .card {
      background: #111;
      border: 1px solid #1e1e1e;
      border-radius: 2px;
      padding: 40px 32px;
      max-width: 520px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .marca {
      font-family: 'Cormorant Garamond', serif;
      font-size: 11px;
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #5a4a3a;
      margin-bottom: 32px;
    }

    .titulo-principal {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(28px, 6vw, 38px);
      font-weight: 300;
      line-height: 1.2;
      color: #e8e0d4;
      margin-bottom: 16px;
    }

    .titulo-principal em {
      font-style: italic;
      color: #c8a97a;
    }

    .subtexto {
      font-size: 14px;
      font-weight: 300;
      color: #6b6055;
      line-height: 1.7;
      margin-bottom: 40px;
    }

    .btn-primario {
      background: #c8a97a;
      color: #0a0a0a;
      border: none;
      padding: 14px 32px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }

    .btn-primario:hover { background: #d4b88a; }

    .input-field {
      background: #0d0d0d;
      border: 1px solid #1e1e1e;
      border-radius: 1px;
      padding: 14px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: #e8e0d4;
      width: 100%;
      margin-bottom: 12px;
      outline: none;
      transition: border-color 0.2s;
    }

    .input-field:focus { border-color: #3a2e20; }
    .input-field::placeholder { color: #3a3530; }

    .label-input {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #4a4035;
      margin-bottom: 8px;
      display: block;
    }

    .barra-progresso {
      background: #1a1a1a;
      height: 1px;
      width: 100%;
      margin-bottom: 32px;
      position: relative;
    }

    .barra-progresso-fill {
      height: 1px;
      background: #c8a97a;
      transition: width 0.6s ease;
    }

    .numero-pergunta {
      font-size: 11px;
      letter-spacing: 0.3em;
      color: #3a3530;
      margin-bottom: 24px;
    }

    .texto-pergunta {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(20px, 4vw, 26px);
      font-weight: 400;
      line-height: 1.4;
      color: #e8e0d4;
      margin-bottom: 32px;
    }

    .opcao {
      background: transparent;
      border: 1px solid #1e1e1e;
      padding: 14px 18px;
      margin-bottom: 10px;
      cursor: pointer;
      width: 100%;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #8a7a6a;
      line-height: 1.5;
      transition: all 0.15s;
      border-radius: 1px;
    }

    .opcao:hover {
      background: #161310;
      border-color: #3a2e20;
      color: #c8a97a;
    }

    .loading-container {
      text-align: center;
      padding: 40px 0;
    }

    .loading-sigil {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px;
      color: #c8a97a;
      margin-bottom: 24px;
      animation: pulso 2s ease-in-out infinite;
    }

    @keyframes pulso {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    .loading-texto {
      font-size: 12px;
      letter-spacing: 0.25em;
      color: #4a4035;
      text-transform: uppercase;
    }

    .devolutiva-header {
      border-bottom: 1px solid #1e1e1e;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }

    .devolutiva-titulo {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(22px, 5vw, 30px);
      font-weight: 400;
      line-height: 1.3;
      color: #e8e0d4;
      margin-bottom: 16px;
    }

    .perfil-badge {
      display: inline-block;
      padding: 6px 14px;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      font-weight: 500;
    }

    .devolutiva-padrao {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-style: italic;
      color: #c8a97a;
      margin-bottom: 6px;
    }

    .secao-titulo {
      font-size: 9px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #3a3530;
      margin-bottom: 12px;
      margin-top: 24px;
    }

    .devolutiva-texto {
      font-size: 14px;
      font-weight: 300;
      color: #9a8a7a;
      line-height: 1.8;
      margin-bottom: 8px;
    }

    .chamada-final {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-style: italic;
      color: #e8e0d4;
      line-height: 1.5;
      padding: 24px 0;
      border-top: 1px solid #1e1e1e;
      margin-top: 24px;
    }

    .erro-texto {
      color: #ef4444;
      font-size: 12px;
      margin-top: 8px;
    }

    .divider {
      height: 1px;
      background: #161310;
      margin: 20px 0;
    }
  `;

  // ============================================================
  // RENDER POR ETAPA
  // ============================================================
  return (
    <>
      <style>{estilos}</style>
      <div className="app">
        {/* INTRO */}
        {etapa === "intro" && (
          <div className="card">
            <div className="marca">Claudio Alecrim · Diagnóstico</div>
            <h1 className="titulo-principal">
              O que você carrega <em>sem saber</em>
            </h1>
            <p className="subtexto">
              15 perguntas sobre como você reage, decide e se relaciona.<br />
              Sem respostas certas ou erradas.<br />
              Só o que é verdadeiro para você agora.
            </p>
            <button className="btn-primario" onClick={() => setEtapa("dados")}>
              Começar diagnóstico
            </button>
          </div>
        )}

        {/* COLETA DE DADOS */}
        {etapa === "dados" && (
          <div className="card">
            <div className="marca">Claudio Alecrim · Diagnóstico</div>
            <h2 className="titulo-principal" style={{ fontSize: "24px", marginBottom: "8px" }}>
              Antes de começar
            </h2>
            <p className="subtexto" style={{ marginBottom: "32px" }}>
              Sua devolutiva será enviada para este email ao final.
            </p>
            <div style={{ marginBottom: "20px" }}>
              <label className="label-input">Seu nome</label>
              <input
                className="input-field"
                placeholder="Como prefere ser chamado"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "32px" }}>
              <label className="label-input">Seu email</label>
              <input
                className="input-field"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {erro && <p className="erro-texto">{erro}</p>}
            <button
              className="btn-primario"
              onClick={() => {
                if (!nome.trim() || !email.trim() || !email.includes("@")) {
                  setErro("Preencha seu nome e um email válido.");
                  return;
                }
                setErro("");
                setEtapa("perguntas");
              }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* PERGUNTAS */}
        {etapa === "perguntas" && (
          <div className="card">
            <div className="barra-progresso">
              <div className="barra-progresso-fill" style={{ width: `${progresso}%` }} />
            </div>

            <div className="numero-pergunta">
              {String(perguntaAtual + 1).padStart(2, "0")} / {String(PERGUNTAS.length).padStart(2, "0")}
            </div>

            <p className="texto-pergunta">{PERGUNTAS[perguntaAtual].texto}</p>

            <div style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s" }}>
              {PERGUNTAS[perguntaAtual].opcoes.map((opcao, i) => (
                <button
                  key={i}
                  className="opcao"
                  onClick={() => responder(i)}
                  disabled={animating}
                >
                  {opcao}
                </button>
              ))}
            </div>

            {erro && <p className="erro-texto">{erro}</p>}
          </div>
        )}

        {/* CARREGANDO */}
        {etapa === "carregando" && (
          <div className="card">
            <div className="loading-container">
              <div className="loading-sigil">◈</div>
              <p className="loading-texto">Lendo seu padrão</p>
            </div>
          </div>
        )}

        {/* DEVOLUTIVA */}
        {etapa === "devolutiva" && devolutiva && (
          <div className="card">
            <div className="marca">Claudio Alecrim · Diagnóstico Pessoal</div>

            <div className="devolutiva-header">
              <h2 className="devolutiva-titulo">{devolutiva.titulo}</h2>
              {perfil && (
                <span
                  className="perfil-badge"
                  style={{
                    background: PERFIL_CORES[perfil]?.bg || "#1a1a1a",
                    color: PERFIL_CORES[perfil]?.accent || "#c8a97a",
                    border: `1px solid ${PERFIL_CORES[perfil]?.accent || "#c8a97a"}22`,
                  }}
                >
                  {PERFIL_CORES[perfil]?.label || perfil}
                </span>
              )}
            </div>

            <p className="devolutiva-texto">{devolutiva.abertura}</p>

            <div className="divider" />

            <p className="devolutiva-padrao">{devolutiva.padrao}</p>
            <div className="secao-titulo">Seu padrão</div>
            <p className="devolutiva-texto">{devolutiva.descricao_padrao}</p>

            <div className="secao-titulo">O que isso custa</div>
            <p className="devolutiva-texto">{devolutiva.custo}</p>

            <div className="secao-titulo">O outro lado</div>
            <p className="devolutiva-texto">{devolutiva.virada}</p>

            <div className="chamada-final">{devolutiva.chamada}</div>

                <p style={{ fontSize: "11px", color: "#3a3530", textAlign: "center", marginTop: "16px" }}>
              Uma cópia foi enviada para {email}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
