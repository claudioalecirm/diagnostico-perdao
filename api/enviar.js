export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { nome, email, perfil, pontuacao, respostas } = req.body;

  if (!nome || !email || !perfil) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    // 1. Chama Claude API para gerar a devolutiva
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: `Você é Claudio Alecrim, mentor de homens. Gere uma devolutiva personalizada em HTML completo para email.

Nome do respondente: ${nome}
Perfil identificado: ${perfil}
Pontuação: ${pontuacao} de 45

Regras obrigatórias:
- Escreva em português brasileiro
- Tom direto, confrontador, com autoridade — como Claudio falando pessoalmente
- Sem clichês motivacionais
- Use apenas aspas simples nos atributos HTML (style='...')
- Fundo escuro: background-color:#0a0a0a, cor do texto:#e8e0d4, acento:#c8a97a
- Fonte: Arial para corpo, Georgia para títulos

Estrutura obrigatória:
1. Título personalizado com o nome
2. Abertura que descreve o padrão sem nomear diretamente
3. Nome narrativo do padrão (ex: "O Guardião das Feridas")
4. O que esse padrão está custando hoje — confrontador e específico
5. O que muda quando esse peso vai embora
6. Frase de encerramento que convida para o próximo passo

Retorne apenas o HTML completo do email, sem explicações, sem markdown, sem blocos de código.`,
          },
        ],
      }),
    });

    const claudeData = await claudeRes.json();
    const htmlDevolutiva = claudeData.content[0].text;

    // 2. Envia email para o aluno via Resend
    const emailAlunoRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "resultado@claudioalecrim.com.br",
        to: [email],
        subject: `Seu diagnostico de perdao, ${nome}`,
        html: htmlDevolutiva,
      }),
    });

    // 3. Envia notificação para o mentor via Resend
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "resultado@claudioalecrim.com.br",
        to: ["resultado.mesadegoverno@gmail.com"],
        subject: `Novo diagnostico recebido — ${nome}`,
        html: `<p><b>Nome:</b> ${nome}</p><p><b>Email:</b> ${email}</p><p><b>Perfil:</b> ${perfil}</p><p><b>Pontuacao:</b> ${pontuacao}</p>`,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
