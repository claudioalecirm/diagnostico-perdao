import { useState } from "react";

const PERGUNTAS = [
  { id: 1, texto: "Quando alguém te decepciona de forma séria, qual é a sua reação mais honesta nos dias seguintes?", opcoes: ["Fico bem rápido, prefiro não ficar preso nisso", "Processo internamente mas demoro para voltar ao normal", "Fico repassando a situação várias vezes na cabeça", "Mantenho distância e dificilmente volto ao mesmo nível de proximidade"] },
  { id: 2, texto: "Você consegue lembrar com detalhes de situações em que foi prejudicado por alguém há mais de 3 anos?", opcoes: ["Raramente — o tempo apaga bastante", "Às vezes, quando algo me lembra", "Sim, com clareza de detalhes e sentimentos", "Sim, e ainda sinto algo quando lembro"] },
  { id: 3, texto: "Quando pensa em uma pessoa específica com quem teve um conflito grave, o que acontece dentro de você?", opcoes: ["Nada em especial — já passei por isso", "Um leve desconforto, mas consigo manter paz", "Uma tensão que prefiro não explorar", "Uma mistura de raiva, tristeza ou mágoa que ainda está viva"] },
  { id: 4, texto: "Como você reage quando alguém próximo comete o mesmo erro pela segunda ou terceira vez?", opcoes: ["Converso novamente e tento entender", "Começo a criar reservas internamente", "Reduz significativamente minha confiança nessa pessoa", "Encerro ou redefino o nível da relação"] },
  { id: 5, texto: "Em que medida situações do passado influenciam como você age em relacionamentos hoje?", opcoes: ["Pouco — cada situação é nova para mim", "Um pouco — às vezes pego padrões antigos", "Bastante — tenho dificuldade de separar", "Muito — sinto que carrego peso de relações passadas"] },
  { id: 6, texto: "Você consegue distinguir claramente quem você é hoje de quem te machucou no passado?", opcoes: ["Sim, com clareza total", "Na maioria das vezes sim", "Às vezes confundo minhas reações com o que aprendi naquelas situações", "Tenho dificuldade — sinto que aquilo me moldou de formas que ainda não entendo bem"] },
  { id: 7, texto: "Quando você imagina o futuro da sua vida — realizações, relacionamentos, propósito — aparece algum peso ou sensação de bloqueio?", opcoes: ["Não — vejo o futuro com leveza", "Uma leve hesitação às vezes", "Sim, sinto que algo me segura", "Sim, e não sei exatamente de onde vem"] },
  { id: 8, texto: "Como você lida com pessoas que te fizeram mal e continuam presentes na sua vida (família, trabalho, contexto social)?", opcoes: ["Com tranquilidade — consigo interagir normalmente", "Com cuidado — mantenho distância emocional", "Com tensão — preferia não precisar lidar", "É uma fonte constante de desconforto interno"] },
  { id: 9, texto: "Você acredita que as pessoas que te prejudicaram merecem bem-estar e prosperidade na vida delas?", opcoes: ["Sim, genuinamente desejo isso", "Racionalmente sei que devo querer, mas sinto resistência", "Honestamente? Não sinto isso naturalmente", "Esse pensamento me incomoda ou gera conflito interno"] },
  { id: 10, texto: "Quando algo dá errado na sua vida hoje — um fracasso, uma perda — você conecta isso a algo que aconteceu antes?", opcoes: ["Raramente — analiso cada situação separadamente", "Às vezes sim, mas de forma passageira", "Com frequência, vejo padrões que se repetem", "Sinto que estou pagando por algo ou que as coisas não mudam para mim"] },
  { id: 11, texto: "Como você se sente quando alguém que te prejudicou parece estar indo bem na vida?", opcoes: ["Neutro — a vida delas não tem a ver comigo", "Um leve incômodo que passo rápido", "Injustiça — sinto que deveria ser diferente", "Uma reação forte que me surpreende ou me envergonha"] },
  { id: 12, texto: "Você consegue falar sobre episódios dolorosos do passado sem que sua emoção seja ativada no momento?", opcoes: ["Sim, com facilidade", "Na maioria das vezes sim", "Depende muito do episódio", "Não — falar sobre isso ainda mexe comigo"] },
  { id: 13, texto: "Que papel a figura paterna ou de liderança teve na forma como você lida com traições e decepções hoje?", opcoes: ["Tive bons modelos — aprendi a lidar bem", "Foi neutro — nem positivo nem negativo", "Faltou referência — tive que descobrir sozinho", "Foi uma fonte de decepção que ainda ressoa em mim"] },
  { id: 14, texto: "Você já tomou decisões importantes na sua vida motivado principalmente pelo que não queria que acontecesse?", opcoes: ["Raramente — decido mais pelo que quero alcançar", "Às vezes — um mix dos dois", "Com frequência — o medo de repetir algo ruim guia bastante", "Sim, boa parte das minhas escolhas vem de um lugar de fuga"] },
  { id: 15, texto: "Se você pudesse encerrar completamente a influência que o passado tem sobre você hoje, o que mudaria na sua vida?", opcoes: ["Pouca coisa — já estou bem resolvido", "Algumas relações melhorariam", "Minha paz interior seria muito maior", "Tudo mudaria — sinto que o passado ainda controla partes importantes de mim"] },
];

const PESOS = [0, 1, 2, 3];

function calcularPerfil(respostas) {
  const total = respostas.reduce((acc, r) => acc + PESOS[r], 0);
  const pct = (total / (PERGUNTAS.length * 3)) * 100;
  if (pct <= 25) return "LIVRE";
  if (pct <= 50) return "PROCESSANDO";
  if (pct <= 75) return "PRESO";
  return "ACORRENTADO";
}

export default function App() {
  const [etapa, setEtapa] = useState("intro");
  const [popup, setPopup] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const progresso = (perguntaAtual / PERGUNTAS.length) * 100;

  async function enviarParaAPI(respostasFinais) {
    setEnviando(true);
    const perfil = calcularPerfil(respostasFinais);
    const pontuacao = respostasFinais.reduce((acc, r) => acc + PESOS[r], 0);
    const resumo = PERGUNTAS.map((p, i) => ({
      pergunta: p.texto,
      resposta: p.opcoes[respostasFinais[i]],
    }));
    try {
      await fetch("/api/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, perfil, pontuacao, respostas: resumo }),
      });
    } catch (e) {
      console.error(e);
    }
    setEnviando(false);
    setEtapa("confirmacao");
  }

  function responder(indice) {
    if (animating || enviando) return;
    setAnimating(true);
    const novas = [...respostas, indice];
    setRespostas(novas);
    setTimeout(() => {
      if (perguntaAtual < PERGUNTAS.length - 1) {
        setPerguntaAtual((p) => p + 1);
        setAnimating(false);
      } else {
        enviarParaAPI(novas);
      }
    }, 400);
  }

  function validarEAvancar() {
    if (!nome.trim() || !email.trim() || !email.includes("@")) {
      setErro("Preencha seu nome e um email válido.");
      return false;
    }
    setErro("");
    return true;
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a0a;color:#e8e0d4;font-family:'DM Sans',sans-serif;min-height:100vh}
    .app{min-height:100vh;background:#0a0a0a;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 20px;position:relative}
    .app::before{content:'';position:fixed;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at 30% 20%,rgba(139,90,43,0.08) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(80,50,20,0.06) 0%,transparent 50%);pointer-events:none}
    .card{background:#111;border:1px solid #1e1e1e;border-radius:2px;padding:40px 32px;max-width:520px;width:100%;position:relative;z-index:1}
    .marca{font-family:'Cormorant Garamond',serif;font-size:11px;font-weight:300;letter-spacing:0.3em;text-transform:uppercase;color:#5a4a3a;margin-bottom:32px}
    .titulo{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,5vw,36px);font-weight:300;line-height:1.2;color:#e8e0d4;margin-bottom:16px}
    .titulo em{font-style:italic;color:#c8a97a}
    .sub{font-size:14px;font-weight:300;color:#6b6055;line-height:1.7;margin-bottom:32px}
    .btn{background:#c8a97a;color:#0a0a0a;border:none;padding:14px 32px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;width:100%;transition:all 0.2s}
    .btn:hover{background:#d4b88a}
    .btn:disabled{opacity:0.5;cursor:not-allowed}
    .btn-out{background:transparent;color:#c8a97a;border:1px solid #2a1e10;padding:12px 24px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;width:100%;transition:all 0.2s;margin-bottom:12px}
    .btn-out:hover{border-color:#c8a97a;background:#c8a97a11}
    .inp{background:#0d0d0d;border:1px solid #1e1e1e;border-radius:1px;padding:14px 16px;font-family:'DM Sans',sans-serif;font-size:14px;color:#e8e0d4;width:100%;margin-bottom:12px;outline:none;transition:border-color 0.2s}
    .inp:focus{border-color:#3a2e20}
    .inp::placeholder{color:#3a3530}
    .lbl{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#4a4035;margin-bottom:8px;display:block}
    .barra{background:#1a1a1a;height:1px;width:100%;margin-bottom:32px}
    .bfill{height:1px;background:#c8a97a;transition:width 0.6s ease}
    .num{font-size:11px;letter-spacing:0.3em;color:#3a3530;margin-bottom:24px}
    .perg{font-family:'Cormorant Garamond',serif;font-size:clamp(20px,4vw,26px);font-weight:400;line-height:1.4;color:#e8e0d4;margin-bottom:32px}
    .op{background:transparent;border:1px solid #1e1e1e;padding:14px 18px;margin-bottom:10px;cursor:pointer;width:100%;text-align:left;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#8a7a6a;line-height:1.5;transition:all 0.15s;border-radius:1px}
    .op:hover{background:#161310;border-color:#3a2e20;color:#c8a97a}
    .err{color:#ef4444;font-size:12px;margin-top:8px}
    .div{height:1px;background:#1e1e1e;margin:24px 0}
    .aviso{background:#161210;border:1px solid #2a1e10;border-radius:2px;padding:16px;margin-bottom:24px}
    .av-titulo{font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#c8a97a;margin-bottom:8px}
    .av-texto{font-size:13px;color:#7a6a5a;line-height:1.6}
    .av-texto strong{color:#c8a97a;font-weight:500}
    .overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
    .popup{background:#111;border:1px solid #2a1e10;border-radius:2px;padding:36px 32px;max-width:440px;width:100%}
    .pop-icon{font-family:'Cormorant Garamond',serif;font-size:40px;color:#c8a97a;margin-bottom:20px}
    .pop-titulo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;color:#e8e0d4;margin-bottom:12px;line-height:1.3}
    .pop-texto{font-size:13px;font-weight:300;color:#7a6a5a;line-height:1.7;margin-bottom:28px}
    .pop-texto strong{color:#c8a97a;font-weight:500}
    .conf-icon{font-size:48px;margin-bottom:24px}
    .conf-titulo{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,4vw,30px);font-weight:300;color:#e8e0d4;margin-bottom:16px;line-height:1.3}
    .conf-titulo em{color:#c8a97a;font-style:italic}
    .conf-texto{font-size:14px;color:#6b6055;line-height:1.8;margin-bottom:8px}
    .email-box{font-size:13px;color:#c8a97a;letter-spacing:0.05em;margin:16px 0 24px;padding:12px 16px;background:#161210;border:1px solid #2a1e10}
    .rodape{font-size:11px;color:#3a3530;margin-top:20px;text-align:center}
  `;

  return (
    <>
      <style>{css}</style>

      {popup && (
        <div className="overlay">
          <div className="popup">
            <div className="pop-icon">◈</div>
            <h2 className="pop-titulo">Sua devolutiva chega por email</h2>
            <p className="pop-texto">
              Com base nas suas respostas, uma <strong>análise personalizada do seu padrão interno</strong> será preparada — o que está operando em você, o que está custando e o que muda quando esse peso vai embora.
              <br /><br />
              Ela será enviada para o email que você informar. <strong>Verifique sua caixa de entrada</strong> nos próximos minutos após concluir.
            </p>
            <button className="btn" onClick={() => setPopup(false)}>Entendido, continuar</button>
          </div>
        </div>
      )}

      <div className="app">

        {etapa === "intro" && (
          <div className="card">
            <div className="marca">Claudio Alecrim · Diagnóstico</div>
            <h1 className="titulo">O que você carrega <em>sem saber</em></h1>
            <p className="sub">15 perguntas sobre como você reage, decide e se relaciona.<br />Sem respostas certas ou erradas.<br />Só o que é verdadeiro para você agora.</p>
            <div className="aviso">
              <div className="av-titulo">Como funciona</div>
              <div className="av-texto">Ao final, você informa seu email e recebe sua <strong>devolutiva personalizada</strong> diretamente na caixa de entrada.</div>
            </div>
            <button className="btn" onClick={() => setEtapa("dados")}>Começar diagnóstico</button>
          </div>
        )}

        {etapa === "dados" && (
          <div className="card">
            <div className="marca">Claudio Alecrim · Diagnóstico</div>
            <h2 className="titulo" style={{ fontSize: "22px", marginBottom: "8px" }}>Para onde enviamos sua devolutiva?</h2>
            <p className="sub" style={{ marginBottom: "20px" }}>Sua análise será preparada e enviada para o email abaixo.</p>
            <div className="aviso">
              <div className="av-titulo">⚠ Atenção</div>
              <div className="av-texto">Sua devolutiva <strong>não aparece na tela</strong> — ela é preparada com base nas suas respostas e enviada ao seu email. Verifique a caixa de entrada após concluir.</div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="lbl">Seu nome</label>
              <input className="inp" placeholder="Como prefere ser chamado" value={nome} onChange={(e) => setNome(e.target.value)} />
              <label className="lbl">Seu email</label>
              <input className="inp" type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn-out" onClick={() => { if (validarEAvancar()) setPopup(true); }}>O que vou receber?</button>
            {erro && <p className="err">{erro}</p>}
            <div className="div" />
            <button className="btn" onClick={() => { if (validarEAvancar()) setEtapa("perguntas"); }}>Continuar para as perguntas</button>
          </div>
        )}

        {etapa === "perguntas" && (
          <div className="card">
            <div className="barra"><div className="bfill" style={{ width: `${progresso}%` }} /></div>
            <div className="num">{String(perguntaAtual + 1).padStart(2, "0")} / {String(PERGUNTAS.length).padStart(2, "0")}</div>
            <p className="perg">{PERGUNTAS[perguntaAtual].texto}</p>
            <div style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s" }}>
              {PERGUNTAS[perguntaAtual].opcoes.map((op, i) => (
                <button key={i} className="op" onClick={() => responder(i)} disabled={animating || enviando}>{op}</button>
              ))}
            </div>
            {enviando && <p style={{ textAlign: "center", color: "#5a4a3a", fontSize: "12px", marginTop: "20px", letterSpacing: "0.1em" }}>Preparando sua devolutiva...</p>}
          </div>
        )}

        {etapa === "confirmacao" && (
          <div className="card">
            <div className="marca">Claudio Alecrim · Diagnóstico</div>
            <div className="conf-icon">◈</div>
            <h2 className="conf-titulo">{nome.split(" ")[0]}, sua devolutiva está <em>a caminho</em></h2>
            <p className="conf-texto">Suas respostas foram recebidas. Com base no que você compartilhou, uma análise pessoal e direta está sendo preparada.</p>
            <div className="email-box">{email}</div>
            <p className="conf-texto">Verifique sua caixa de entrada nos próximos minutos. Se não encontrar, olhe também na pasta de spam.</p>
            <div className="div" />
            <p className="conf-texto" style={{ fontSize: "13px", color: "#5a4a3a" }}>O que você vai receber é uma leitura honesta de um padrão que opera em você — sem julgamento, sem filtro. Leia com atenção.</p>
            <p className="rodape">Claudio Alecrim · resultado.mesadegoverno@gmail.com</p>
          </div>
        )}

      </div>
    </>
  );
}
