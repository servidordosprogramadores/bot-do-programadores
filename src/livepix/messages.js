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
const SUPPORTER_THRESHOLD_CENTS =
  parseInt(process.env.LIVEPIX_SUPPORTER_THRESHOLD_CENTS, 10) || 1000; // default R$10,00 = 1000 cents

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "LIVEPIX_CLIENT_ID ou LIVEPIX_CLIENT_SECRET não configurados"
    );
  }

  const authMethod = (
    process.env.LIVEPIX_TOKEN_AUTH_METHOD || "client_secret_post"
  ).toLowerCase();

  // dados comuns
  const data = {
    grant_type: "client_credentials",
    scope: "messages:read",
  };

  try {
    let resp;
    if (authMethod === "client_secret_basic") {
      // método alternativo (se configurado explicitamente)
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
      // client_secret_post (padrão): enviar client_id e client_secret no corpo
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
    // lançar para o fluxo principal tratar e responder o webhook com erro
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

    // Filtra eventos que não interessam
    if (reqBody.event !== "new" || reqBody.resource?.type !== "message") {
      return res.json({ status: "evento ignorado" });
    }

    const messageId = reqBody.resource.id;
    if (!messageId) return res.status(400).json({ error: "messageId ausente" });

    // Obtém detalhes da transação
    const token = await getAccessToken();
    const messageData = await fetchMessageDetails(messageId, token);

    const username = messageData.username || "Desconhecido"; // nome apresentado (pode ser username#0000)
    const text = messageData.message || "";
    const amountCents = messageData.amount || 0;

    // Resolve guild e membro no primeiro servidor do bot
    const guild = client.guilds.cache.first();
    let member = null;
    let memberId = null;

    if (guild) {
      try {
        // busca por query (pode retornar username/displayName)
        const found = await guild.members.fetch({ query: username, limit: 1 });
        member = found.first() || null;
      } catch (err) {
        console.warn("Erro ao buscar membro por username:", err.message);
      }

      if (!member) {
        // Tenta buscar pelo formato username#discriminator se informado
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

    // Monta menção (se possível usar <@id>, caso contrário usar o nome)
    const mentionText = memberId ? `<@${memberId}>` : `@${username}`;

    // Se doação >= limite, adiciona cargo de apoiador
    let roleGiven = false;
    if (amountCents >= SUPPORTER_THRESHOLD_CENTS && member) {
      try {
        roleGiven = await addSupporterRole(member);
      } catch (err) {
        console.error("Erro ao tentar adicionar cargo de apoiador:", err);
      }
    }

    // Envia mensagem de agradecimento para o webhook do chat
    try {
      await sendThankYou(mentionText, amountCents, username, memberId);
    } catch (err) {
      console.error("Erro ao enviar mensagem de agradecimento:", err);
    }

    // Envia log para o webhook de logs (embed)
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
