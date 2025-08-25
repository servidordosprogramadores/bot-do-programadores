const axios = require("axios");
const qs = require("qs");
const { addSupporterRole } = require("./addRole");
const { sendThankYou } = require("./sendMessage");
const { sendDonationLog } = require("./log");

const LIVEPIX_TOKEN_URL =
  process.env.LIVEPIX_TOKEN_URL || "https://oauth.livepix.gg/oauth2/token";
const LIVEPIX_API_BASE =
  process.env.LIVEPIX_API_BASE || "https://api.livepix.gg/v2";
const CLIENT_ID = process.env.LIVEPIX_CLIENT_ID;
const CLIENT_SECRET = process.env.LIVEPIX_CLIENT_SECRET;
const SUPPORTER_THRESHOLD_CENTS = parseInt(
  process.env.LIVEPIX_SUPPORTER_THRESHOLD_CENTS,
  10
);

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "LIVEPIX_CLIENT_ID ou LIVEPIX_CLIENT_SECRET não configurados"
    );
  }

  const authMethod = (
    process.env.LIVEPIX_TOKEN_AUTH_METHOD || "client_secret_post"
  ).toLowerCase();

  const data = {
    grant_type: "client_credentials",
    scope: "messages:read",
  };

  try {
    let resp;
    if (authMethod === "client_secret_basic") {
      const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
        "base64"
      );
      resp = await axios.post(LIVEPIX_TOKEN_URL, qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      });
    } else {
      data.client_id = CLIENT_ID;
      data.client_secret = CLIENT_SECRET;
      resp = await axios.post(LIVEPIX_TOKEN_URL, qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    }

    if (!resp.data || !resp.data.access_token)
      throw new Error("Token inválido LivePix");

    return resp.data.access_token;
  } catch (err) {
    console.error(
      "Erro ao obter access token LivePix:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err;
  }
}

async function fetchMessageDetails(messageId, accessToken) {
  const resp = await axios.get(`${LIVEPIX_API_BASE}/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return resp.data.data;
}

/*
  handleLivepixWebhook(reqBody, res, client)
  - reqBody: corpo recebido do LivePix
  - res: objeto de resposta (para finalizar o request)
  - client: instância do Discord client (necessária para buscar guild/member)
*/
async function handleLivepixWebhook(reqBody, res, client) {
  try {
    if (!reqBody)
      return res.status(400).json({ error: "Nenhum dado recebido" });

    if (reqBody.event !== "new" || reqBody.resource?.type !== "message") {
      return res.json({ status: "evento ignorado" });
    }

    const messageId = reqBody.resource.id;
    if (!messageId) return res.status(400).json({ error: "messageId ausente" });

    const token = await getAccessToken();
    const messageData = await fetchMessageDetails(messageId, token);

    const username = messageData.username || "Desconhecido";
    const text = messageData.message || "";
    const amountCents = messageData.amount || 0;

    const guild = client.guilds.cache.first();
    let member = null;
    let memberId = null;

    if (guild) {
      try {
        const found = await guild.members.fetch({ query: username, limit: 1 });
        member = found.first() || null;
      } catch (err) {
        console.warn("Erro ao buscar membro por username:", err.message);
      }

      if (!member) {
        if (username.includes("#")) {
          const [name, discrim] = username.split("#");
          try {
            const all = await guild.members.fetch();
            member =
              all.find(
                (m) =>
                  m.user.username === name && m.user.discriminator === discrim
              ) || null;
          } catch (err) {
            console.warn("Busca completa de membros falhou:", err.message);
          }
        }
      }

      if (member) memberId = member.id;
    }

    const mentionText = memberId ? `<@${memberId}>` : `@${username}`;

    let roleGiven = false;
    if (amountCents >= SUPPORTER_THRESHOLD_CENTS && member) {
      try {
        roleGiven = await addSupporterRole(member);
      } catch (err) {
        console.error("Erro ao tentar adicionar cargo de apoiador:", err);
      }
    }

    try {
      await sendThankYou(amountCents, username, memberId, text);
    } catch (err) {
      console.error("Erro ao enviar mensagem de agradecimento:", err);
    }

    try {
      await sendDonationLog({
        messageId,
        username,
        memberId,
        amountCents,
        text,
        raw: messageData,
      });
    } catch (err) {
      console.error("Erro ao enviar log de doação:", err);
    }

    return res.json({ status: "ok" });
  } catch (err) {
    console.error(
      "Erro no processamento do webhook LivePix:",
      err.response?.data || err.message || err
    );
    try {
      return res.status(500).json({ error: "Erro interno" });
    } catch (e) {
      return;
    }
  }
}

module.exports = { handleLivepixWebhook };
