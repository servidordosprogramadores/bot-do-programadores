const axios = require("axios");

const LOG_WEBHOOK = process.env.WEBHOOK_LIVEPIX_LOGS_URL;

async function sendDonationLog({ username, memberId, amountCents, text }) {
  if (!LOG_WEBHOOK) {
    console.warn("WEBHOOK_LIVEPIX_LOGS_URL não configurado; log não enviado.");
    return;
  }

  const webhookUrl = LOG_WEBHOOK.includes("?")
    ? `${LOG_WEBHOOK}&with_components=true`
    : `${LOG_WEBHOOK}?with_components=true`;

  const userDisplay = memberId ? `<@${memberId}>` : username || "Desconhecido";
  const amountBRL = ((amountCents || 0) / 100).toFixed(2).replace(".", ",");
  const userMessage = (text || "—").replace(/(everyone|here)/gi, (match) =>
    match.toLowerCase() === "everyone" ? "********" : "****"
  );

  const payload = {
    components: [
      {
        type: 17,
        accent_color: 8132862,
        spoiler: false,
        components: [
          {
            type: 9,
            accessory: {
              type: 11,
              media: {
                url: "https://cdn3.emoji.gg/emojis/494279-apoiador.png",
              },
              description: null,
              spoiler: false,
            },
            components: [
              {
                type: 10,
                content: "## Novo apoiador",
              },
              {
                type: 10,
                content: `**Usuário**: ${userDisplay}\n**Mensagem**: ${userMessage}\n**Valor**: R$ ${amountBRL}\n`,
              },
            ],
          },
        ],
      },
    ],
    flags: 32768,
  };

  try {
    const res = await axios.post(webhookUrl, payload, {
      headers: { "Content-Type": "application/json" },
      validateStatus: null,
    });

    if (res.status < 200 || res.status >= 300) {
      console.error("Falha ao enviar log de doação:", res.status, res.data);
      throw new Error(`Webhook de log retornou status ${res.status}`);
    }

    console.log("Log de doação enviado com sucesso.");
  } catch (err) {
    console.error("Erro ao enviar payload de log:", err.message || err);
    throw err;
  }
}

module.exports = { sendDonationLog };
