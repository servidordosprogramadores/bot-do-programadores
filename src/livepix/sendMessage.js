const axios = require("axios");
const CHAT_WEBHOOK = process.env.WEBHOOK_CHAT_URL;
const SUPPORTER_THRESHOLD_CENTS = parseInt(
  process.env.LIVEPIX_SUPPORTER_THRESHOLD_CENTS,
  10
);

async function sendThankYou(amountCents, username, memberId = null, text = "") {
  if (!CHAT_WEBHOOK) {
    console.warn(
      "WEBHOOK_CHAT_URL não configurado; mensagem de agradecimento não enviada."
    );
    return;
  }

  const webhookUrl = CHAT_WEBHOOK.includes("?")
    ? `${CHAT_WEBHOOK}&with_components=true`
    : `${CHAT_WEBHOOK}?with_components=true`;

  const amountBRL = ((amountCents || 0) / 100).toFixed(2).replace(".", ",");
  const userDisplay = memberId ? `<@${memberId}>` : username || "Desconhecido";
  const userMessage = (text || "O apoiador não enviou uma mensagem.").replace(
    /(everyone|here)/gi,
    (match) => (match.toLowerCase() === "everyone" ? "********" : "****")
  );

  let finalContent = `**Valor**: R$ ${amountBRL}\n-# Obrigado pelo seu apoio!`;
  if (amountCents >= SUPPORTER_THRESHOLD_CENTS) {
    finalContent += `\n-# Caso não tenha recebido o cargo, chame um <@&1382436765410791565>.`;
  }

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
                content: `### ${userDisplay} se tornou um apoiador!`,
              },
              {
                type: 10,
                content: `**Mensagem**: ${userMessage}`,
              },
              {
                type: 10,
                content: finalContent,
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
      console.error(
        "Falha ao postar no webhook de chat:",
        res.status,
        res.data
      );
      throw new Error(`Webhook de chat retornou status ${res.status}`);
    }
  } catch (err) {
    console.error("Erro ao postar no webhook de chat:", err.message || err);
    throw err;
  }
}

module.exports = { sendThankYou };
