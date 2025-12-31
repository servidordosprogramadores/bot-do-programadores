const { Client, GatewayIntentBits } = require('discord.js');
const {
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  TextDisplayBuilder,
  MessageFlags
} = require('discord.js');

module.exports = (client) => {
  console.log("Iniciando módulo de ranking...");

  // Canal onde a mensagem do ranking será enviada (conforme solicitado)
  const TARGET_CHANNEL_ID = '1455305452895342766';
  // Canal onde o comando /top será disparado (usando o mesmo do teste)
  const TRIGGER_CHANNEL_ID = process.env.TESTES_CHANNEL_ID;

  const N0VA_BOT_ID = process.env.N0VA_BOT_ID;
  const AUTH_TOKEN = process.env.AUTH_TOKEN;

  // Regex ajustado para pegar dados dentro ou fora de backticks no pipe
  const LINE_REGEX = /(?:🔸|🔹)\s*\|\s*#(\d+)\s*(<@\d+>)\s*-\s*XP:\s*\*\*(\d+)\*\*\s*(?:`\|`|\|)\s*Level:\s*\*\*(\d+)\*\*/;

  // Função recursiva para extrair texto de componentes (Container/TextDisplay)
  const extractTextFromComponents = (components) => {
    let text = "";
    if (!components) return text;

    const comps = Array.isArray(components) ? components : [components];

    for (const component of comps) {
      // Tenta pegar o conteúdo direto ou dentro de data
      const content = component.content || (component.data && component.data.content);
      if (content) {
        text += "\n" + content;
      }

      // Recursão para componentes filhos (estrutura do discord.js ou raw data)
      const children = component.components || (component.data && component.data.components);
      if (children && Array.isArray(children)) {
        text += extractTextFromComponents(children);
      }
    }
    return text;
  };

  const parseSection = (fullText, sectionName) => {
    const lines = fullText.split('\n');
    let capturing = false;
    let result = [];

    for (const line of lines) {
      if (line.includes(sectionName)) {
        capturing = true;
        continue;
      }
      if (capturing && line.startsWith('##')) {
        break;
      }
      if (capturing) {
        const match = line.match(LINE_REGEX);
        if (match) {
          const [_, rank, user, xp, level] = match;
          result.push(`- **${rank}.** ${user} **XP**: ${xp} - **Level**: ${level}`);
        }
      }
    }
    return result.join('\n') || "Nenhum dado encontrado.";
  };

  const runRankingLoop = async () => {
    console.log(`[Ranking] Iniciando ciclo em ${new Date().toISOString()}`);

    try {
      const triggerChannel = await client.channels.fetch(TRIGGER_CHANNEL_ID);
      const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);

      if (!triggerChannel || !targetChannel) {
        console.error("[Ranking] Canais não encontrados.");
        return;
      }

      // 1. Executar a API (Interação do comando /top) no canal de TRIGGER
      const payload = {
        type: 2,
        application_id: "1245727635536085032",
        guild_id: process.env.GUILD_ID,
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

      console.log("[Ranking] Enviando comando /top...");
      await fetch('https://discord.com/api/v9/interactions', {
        method: 'POST',
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(payload)
      });

      // 2. Aguardar a resposta do bot N0VA
      console.log("[Ranking] Aguardando resposta do bot...");
      const filter = m => m.author.id === N0VA_BOT_ID;
      const collected = await triggerChannel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .catch(() => {
          console.log("[Ranking] Tempo esgotado aguardando resposta.");
          return null;
        });

      if (!collected || collected.size === 0) return;

      let msg = collected.first();

      // Esperar 2 segundos antes de ler o conteúdo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Tenta buscar a mensagem novamente
      try {
        msg = await triggerChannel.messages.fetch(msg.id);
      } catch (err) {
        console.error("Erro ao buscar mensagem atualizada:", err);
      }

      // Extrair texto
      let fullText = msg.content || "";
      if (msg.embeds.length > 0) {
        msg.embeds.forEach(embed => {
          if (embed.description) fullText += "\n" + embed.description;
          if (embed.fields) {
            embed.fields.forEach(field => {
              fullText += "\n" + field.value;
            });
          }
        });
      }
      if (msg.components && msg.components.length > 0) {
        fullText += extractTextFromComponents(msg.components);
      }

      console.log("[Ranking] Texto extraído para análise:", fullText);

      // Deletar a mensagem original
      await msg.delete().catch(e => console.error("Erro ao deletar msg:", e));

      // 3. Processar os dados
      const textRank = parseSection(fullText, "TOP TEXT");
      const voiceRank = parseSection(fullText, "TOP VOICE");

      console.log(textRank, voiceRank);

      // 4. Montar os Componentes V2
      const components = [
        new ContainerBuilder()
          .setAccentColor(1722367)
          .addMediaGalleryComponents(
            new MediaGalleryBuilder()
              .addItems(
                new MediaGalleryItemBuilder()
                  .setURL("https://i.postimg.cc/yNgTDDnR/PROGRAMADORES1.png"),
              ),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("# Ranking dos membros mais ativos"),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("Este ranking destaca os membros mais ativos do servidor, considerando a participação em mensagens, calls e interações ao longo do tempo."),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("### <:chat:1455398639144013907> Mais ativos no chat"),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(textRank),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("### <:microfone:1455398624048578731> Mais ativo em call"),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(voiceRank),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("Obrigado a todos que participam, ajudam e fortalecem nossa comunidade diariamente.\nPara conferir seu nível use o comando `/id`."),
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`-# Ultima atualização: <t:${Math.floor(Date.now() / 1000)}:R> `),
          ),
      ];

      // 5. Enviar/Editar via Bot Client no canal alvo
      const messages = await targetChannel.messages.fetch({ limit: 50 });
      const lastBotMsg = messages.find(m => m.author.id === client.user.id);

      if (lastBotMsg) {
        await lastBotMsg.edit({
          content: "",
          components,
          flags: MessageFlags.IsComponentsV2,
          allowedMentions: { parse: [] },
        });
      } else {
        await targetChannel.send({
          content: "",
          components,
          flags: MessageFlags.IsComponentsV2,
          allowedMentions: { parse: [] },
        });
      }
    } catch (error) {
      console.error("[Ranking] Erro no loop:", error);
    }
  };

  // Executa imediatamente ao iniciar
  runRankingLoop();

  // Executa a cada 10 minutos
  setInterval(runRankingLoop, 60000);
};

// Adicione este bloco no final do arquivo para permitir execução direta (Standalone)
if (require.main === module) {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { Client, GatewayIntentBits } = require('discord.js');
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
  });

  client.once('ready', () => {
    console.log(`[Standalone] Bot logado como ${client.user.tag}`);
    module.exports(client);
  });

  client.login(process.env.BOT_TOKEN).catch(err => {
    console.error("[Standalone] Erro ao logar o bot:", err);
  });
}
