const TRIGGER_CHANNEL_ID = process.env.TESTES_CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;
const N0VA_BOT_ID = process.env.N0VA_BOT_ID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

async function sendTopCommand(client) {

  const triggerChannel = await client.channels.fetch(TRIGGER_CHANNEL_ID);
  if (!triggerChannel) {
    console.error("[Ranking] Canal de trigger não encontrado.");
    return null;
  }

  const payload = {
    type: 2,
    application_id: "1245727635536085032",
    guild_id: GUILD_ID,
    channel_id: TRIGGER_CHANNEL_ID,
    session_id: "53316d7bd6191fd7963faf5ac3d65934",
    data: {
      version: "1431067718710464523",
      id: "1248343303901155359",
      name: "top",
      type: 1,
      options: [],
      application_command: {
        id: "1248343303901155359",
        type: 1,
        application_id: "1245727635536085032",
        version: "1431067718710464523",
        name: "top",
        description: "View a list of top members with points in the server",
        options: [
          {
            type: 3,
            name: "type",
            description: "Leaderboard type",
            required: false,
            choices: [
              { name: "Text", value: "text", name_localized: "Text" },
              { name: "Voice", value: "voice", name_localized: "Voice" },
              { name: "Voice Streaks", value: "voice_streaks", name_localized: "Voice Streaks" },
              { name: "Message Streaks", value: "message_streaks", name_localized: "Message Streaks" }
            ],
            description_localized: "Leaderboard type",
            name_localized: "type"
          },
          {
            type: 3,
            name: "time",
            description: "Specific Time",
            required: false,
            choices: [
              { name: "Day", value: "day", name_localized: "Day" },
              { name: "Week", value: "week", name_localized: "Week" },
              { name: "Month", value: "month", name_localized: "Month" }
            ],
            description_localized: "Specific Time",
            name_localized: "time"
          }
        ],
        dm_permission: true,
        integration_types: [0],
        global_popularity_rank: 6,
        description_localized: "View a list of top members with points in the server",
        name_localized: "top"
      },
      attachments: []
    },
    nonce: (BigInt(Date.now()) * BigInt(1000000)).toString(),
    analytics_location: "slash_ui"
  };

  await fetch('https://discord.com/api/v9/interactions', {
    method: 'POST',
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
    },
    body: JSON.stringify(payload)
  });

  const filter = m => m.author.id === N0VA_BOT_ID;
  const collected = await triggerChannel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
    .catch(() => null);

  if (!collected || collected.size === 0) {
    console.log("[Ranking] Tempo esgotado aguardando resposta.");
    return null;
  }

  let msg = collected.first();

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    msg = await triggerChannel.messages.fetch(msg.id);
  } catch (err) {
    console.error("[Ranking] Erro ao buscar mensagem atualizada:", err);
  }

  const messageData = {
    content: msg.content,
    embeds: msg.embeds,
    components: msg.components
  };

  await msg.delete().catch(e => console.error("Erro ao deletar msg:", e));

  return messageData;
}

module.exports = { sendTopCommand };
