const axios = require("axios");
const LOG_WEBHOOK = process.env.WEBHOOK_LIVEPIX_LOGS_URL;

function buildEmbed({ messageId, username, memberId, amountCents, text }) {
  const amountBRL = (amountCents / 100).toFixed(2);
  const fields = [
    { name: "Usuário", value: username || "Desconhecido", inline: true },
    { name: "User ID", value: memberId || "Não encontrado", inline: true },
    { name: "Valor", value: `R$${amountBRL}`, inline: true },
    { name: "Mensagem", value: text || "—", inline: false },
    { name: "Message ID", value: messageId || "—", inline: false },
  ];

  return {
    title: "Nova Doação - LivePix",
    color: 0x00ff99,
    fields,
    timestamp: new Date().toISOString(),
  };
}

async function sendDonationLog(details) {
  if (!LOG_WEBHOOK) {
    console.warn("WEBHOOK_LIVEPIX_LOGS_URL não configurado; log não enviado.");
    return;
  }

  const embed = buildEmbed(details);

  try {
    await axios.post(LOG_WEBHOOK, { embeds: [embed] });
  } catch (err) {
    console.error("Erro ao enviar embed de log:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendDonationLog };
