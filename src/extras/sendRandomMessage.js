const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const WEBHOOK_URL = process.env.WEBHOOK_CHAT + "?with_components=true";

const messages = [
  "<:curriculo:1455329237144834221> Sempre desconfie de vagas que te mandam no privado. Nossos canais de vagas oficiais são <#1381769079710285855> e <#1455014681881350216>.",
  "<:paleta:1455353253725339871> Escolha sua cor no chat <#1381473062108790814>.",
  "<:stack:1455353284335374521> Escolha suas tecnologias no canal <#1363980601115410462>.",
  "<:globo:1455353335602352259> Torne-se um embaixador do servidor! Confira o chat <#1410072306021302344>.",
  "<:raking:1455353201216720906> Confira o ranking de membros do servidor no chat <#1454923683486367879>.",
  "<:telefone:1455354878430937221> Precisa de ajuda no servidor? Abra um ticket de suporte no chat <#1454915939475914802>.",
  "<:code:1455354846642438245> Precisa de ajuda com código ou programação? Mande uma mensagem no chat <#1382444218043338813>.",
  "<:id:1455353201216720906> Para verificar o seu rank utilize o comando `/id` no chat <#1224155518604542182>.",
  "<:foguete:1455353180979331172> Impulsione o servidor! Confira o chat <#1363964628639551498>.",
  "<:navigationarrow:1465200982274216152> Conheça os cargos do servidor! Confira o chat <#1381473062108790814>.",
];

let lastMessageIndex = -1;

async function sendWebhook(content) {
  const payload = {
    components: [
      {
        type: 17,
        accent_color: parseInt(process.env.MAIN_COLOR),
        spoiler: false,
        components: [
          {
            type: 10,
            content: content,
          },
        ],
      },
    ],
    flags: 32768,
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("[Random] Mensagem enviada com sucesso.");
    } else {
      console.error("[Random] Falha ao enviar mensagem:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[Random] Erro ao enviar webhook:", err);
  }
}

async function startRandomMessages(client) {
  // Extrair ID e Token do URL para buscar o canal
  const webhookUrl = process.env.WEBHOOK_CHAT;
  const parts = webhookUrl.split("/");
  const webhookId = parts[parts.length - 2];
  const webhookToken = parts[parts.length - 1];

  let channelId = null;

  try {
    const webhook = await client.fetchWebhook(webhookId, webhookToken);
    channelId = webhook.channelId;
  } catch (error) {
    console.error("[Random] Erro ao buscar webhook:", error);
    return;
  }

  const runTask = async () => {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) {
        console.error("[Random] Canal não encontrado.");
        return;
      }

      const messagesHistory = await channel.messages.fetch({ limit: 100 });
      const hasWebhook = messagesHistory.some((msg) => msg.webhookId);

      if (hasWebhook) {
        return;
      }

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * messages.length);
      } while (randomIndex === lastMessageIndex && messages.length > 1);

      lastMessageIndex = randomIndex;
      const messageToSend = messages[randomIndex];

      await sendWebhook(messageToSend);
    } catch (error) {
      console.error("[Random] Erro na tarefa de mensagens aleatórias:", error);
    }
  };

  // Executar a cada 4 horas
  setInterval(runTask, 4 * 60 * 60 * 1000);

  // Executar imediatamente ao iniciar
  runTask();
}

module.exports = { startRandomMessages };