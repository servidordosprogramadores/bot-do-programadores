require("dotenv").config();
const { Client, GatewayIntentBits, Events, ActivityType } = require("discord.js");
const {
  handleTechButtonClick,
  sendTechLayoutMessage,
} = require("./src/techs/techs");
const {
  handleColorSelectClick,
  sendColorEmbed,
} = require("./src/colors/colors");
const { sendSupportEmbed } = require("./src/support/support");
const { handleSupportInteraction } = require("./src/support/resolve");
const { startRandomMessages } = require("./src/extras/sendRandomMessage");
const ranking = require("./src/ranking/ranking");
const express = require("express");
const bodyParser = require("body-parser");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot conectado como ${readyClient.user.tag}`);
  readyClient.user.setActivity("🧑‍💻 Codando...", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/programadores",
  });

  try {
    const guild = readyClient.guilds.cache.first();
    if (!guild) {
      console.error("Não foi possível encontrar nenhum servidor");
      return;
    }

    await sendTechLayoutMessage(readyClient);
    await sendColorEmbed(readyClient);
    await sendSupportEmbed(readyClient);
    await startRandomMessages(readyClient);
    ranking(readyClient);
  } catch (error) {
    console.error("Erro ao processar informações do servidor:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    await handleTechButtonClick(interaction);
    await handleSupportInteraction(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleColorSelectClick(interaction);
    await handleSupportInteraction(interaction);
  }
});

client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Logando..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);

  });

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) =>
  res.status(200).send("OK - Servidor dos Programadores")
);

const PORT = parseInt(process.env.PORT, 10) || 80;
app.listen(PORT, () => {
  console.log(`Servidor Express ouvindo na porta ${PORT}`);
});
