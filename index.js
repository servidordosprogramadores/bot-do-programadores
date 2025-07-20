require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const {
  handleTechButtonClick,
  sendTechLayoutMessage,
} = require("./src/techs/techs");
const {
  handleColorSelectClick,
  sendColorEmbed,
} = require("./src/colors/colors");
// Criar app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());

// Endpoints HTTP básicos
app.get("/", (req, res) => {
  res.send("Bot dos Programadores está rodando!");
});

// Criar instância do bot Discord
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

// Evento quando o bot estiver pronto
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot conectado como ${readyClient.user.tag}`);

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

// Manipular interações (botões e select menus)
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    await handleTechButtonClick(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleColorSelectClick(interaction);
  }
});

// Iniciar servidor Express
app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Login no Discord
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Logando..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
  });
