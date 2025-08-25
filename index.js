require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const {
  handleTechButtonClick,
  sendTechLayoutMessage,
} = require("./src/techs/techs");
const {
  handleColorSelectClick,
  sendColorEmbed,
} = require("./src/colors/colors");
const express = require("express");
const bodyParser = require("body-parser");
const { handleLivepixWebhook } = require("./src/livepix/messages");

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
  readyClient.user.setActivity("Membros 💙", { type: 3 });

  try {
    const guild = readyClient.guilds.cache.first();
    if (!guild) {
      console.error("Não foi possível encontrar nenhum servidor");
      return;
    }

    await sendTechLayoutMessage(readyClient);
    await sendColorEmbed(readyClient);
  } catch (error) {
    console.error("Erro ao processar informações do servidor:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    await handleTechButtonClick(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleColorSelectClick(interaction);
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

app.post("/livepix-webhook", async (req, res) => {
  try {
    await handleLivepixWebhook(req.body, res, client);
  } catch (err) {
    console.error("Erro no endpoint /livepix-webhook:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = parseInt(process.env.PORT, 10) || 80;
app.listen(PORT, () => {
  console.log(`Servidor Express ouvindo na porta ${PORT}`);
});
