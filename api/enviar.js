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
    // 1. Gera devolutiva com Claude
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
            content: `Voce e Claudio Alecrim, mentor de homens. Gere o CORPO de uma devolutiva personalizada em HTML para email.\n\nNome: ${nome}\nPerfil: ${perfil}\nPontuacao: ${pontuacao} de 45\n\nRegras:\n- Portugues brasileiro\n- Tom direto, confrontador, autoridade\n- Sem cliches motivacionais\n- Use apenas aspas simples nos atributos HTML\n- Cores: texto #e8e0d4, acento #c8a97a, fundos escuros\n- Georgia para titulos, Arial para corpo\n- NAO inclua DOCTYPE html head body\n\nEstrutura em HTML:\n1. Abertura descrevendo o padrao sem nomear (div border-left 4px solid #c8a97a)\n2. Nome narrativo do padrao em h2 cor #c8a97a\n3. Como esse padrao opera na vida\n4. O que esta custando (div background #2a1810)\n5. O outro lado (div background #0f2a0f)\n6. Frase de encerramento em italico\n\nRetorne apenas o HTML sem explicacoes.`,
          },
        ],
      }),
    });

    const claudeData = await claudeRes.json();
    const corpoDevolutiva = claudeData.content[0].text;

    const htmlCompleto = `<!DOCTYPE html><html lang='pt-BR'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Seu Diagnostico</title></head><body style='margin:0;padding:20px 0;background:#0a0a0a;font-family:Georgia,serif;'><div style='max-width:600px;margin:0 auto;background:#111;border:1px solid #1e1e1e;'><table width='100%' cellpadding='0' cellspacing='0' style='background:#0d0d0d;border-bottom:3px solid #c8a97a;'><tr><td style='padding:24px 40px;'><p style='margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5a4a3a;'>Diagnostico Pessoal</p><p style='margin:0;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#e8e0d4;'>Claudio Alecrim</p></td></tr></table><div style='padding:40px;'><p style='margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;'>Resultado do seu diagnostico</p><h1 style='margin:0 0 28px;font-family:Georgia,serif;font-size:26px;font-weight:400;line-height:1.3;color:#e8e0d4;'>${nome}, aqui esta o que encontramos</h1>${corpoDevolutiva}<div style='margin:32px 0;height:1px;background:#1e1e1e;'></div><p style='margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;'>O que acontece agora</p><p style='margin:0 0 16px;font-size:15px;line-height:1.8;color:#9a8a7a;'>Nesta edicao da Mesa de Governo vamos iniciar o alivio desse peso juntos com uma dinamica de perdao que vai te dar a primeira respiracao real.</p><p style='margin:0 0 16px;font-size:15px;line-height:1.8;color:#9a8a7a;'>Mas nao teremos tempo suficiente para resolver todos os perdoes que precisam ser liberados, inclusive os que ainda ficam escondidos atras de narrativas e historias mal contadas.</p><p style='margin:0;font-size:15px;line-height:1.8;color:#9a8a7a;'>Por isso e importante nao parar. O que comeca na Mesa precisa de continuidade e o proximo passo esta abaixo.</p><div style='margin:32px 0 0;padding:28px;background:#0d0d0d;border:1px solid #2a2010;border-left:3px solid #c8a97a;'><p style='margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#4a4035;'>Proximo passo</p><p style='margin:0 0 8px;font-size:14px;line-height:1.7;color:#9a8a7a;'>A Mentoria Governo Pessoal foi criada para continuar o que comeca na Mesa com estrutura, acompanhamento e intencao.</p><p style='margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#6b6055;'>Fale diretamente: <span style='color:#c8a97a;font-weight:bold;'>(43) 99669-4899</span></p><a href='https://claudioalecrim.com.br' style='display:inline-block;background:#c8a97a;padding:12px 28px;text-decoration:none;'><span style='font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#111;'>Conhecer a mentoria</span></a></div></div><div style='padding:24px 40px;border-top:1px solid #1e1e1e;'><p style='margin:0;font-family:Arial,sans-serif;font-size:11px;color:#3a3530;text-align:center;line-height:1.6;'>Claudio Alecrim · Mentoria Governo Pessoal<br>resultado.mesadegoverno@gmail.com · claudioalecrim.com.br</p></div></div></body></html>`;

    // 2. Envia email e salva no Notion em paralelo
    await Promise.all([
      // Envia devolutiva para o lead
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "resultado@claudioalecrim.com.br",
          to: [email],
          subject: `Seu diagnostico de perdao, ${nome}`,
          html: htmlCompleto,
        }),
      }),

      // Salva lead direto no Notion
      fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: "6c2ccb678e614316ae4ef5dd50341c18" },
          properties: {
            Nome: { title: [{ text: { content: nome } }] },
            Email: { email: email },
            Perfil: { select: { name: perfil } },
            Pontuação: { number: pontuacao },
            Status: { select: { name: "Novo" } },
          },
        }),
      }),
    ]);

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
