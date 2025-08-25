const axios = require("axios");
const CHAT_WEBHOOK = process.env.WEBHOOK_CHAT_URL;

async function sendThankYou(
  mentionText,
  amountCents,
  username,
  memberId = null
) {
  if (!CHAT_WEBHOOK) {
    console.warn(
      "WEBHOOK_CHAT_URL não configurado; mensagem de agradecimento não enviada."
    );
    return;
  }

  const amountBRL = (amountCents / 100).toFixed(2);
  const content = `💙 Obrigado ${mentionText} por apoiar o servidor!\nValor: R$${amountBRL}\nMensagem: ${username}`;

  try {
    await axios.post(CHAT_WEBHOOK, { content });
  } catch (err) {
    console.error(
      "Erro ao postar no webhook de chat:",
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { sendThankYou };
