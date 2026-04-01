const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const WEBHOOK_URL = process.env.WEBHOOK_WELCOME + "?with_components=true";

const payload = {
  components: [
    {
      "type": 17,
      "accent_color": parseInt(process.env.MAIN_COLOR),
      "spoiler": false,
      "components": [
        {
          "type": 12,
          "items": [
            {
              "media": {
                "url": "https://i.postimg.cc/nhMfRtnk/banner-servidor-dos-programadores.png"
              },
              "description": null,
              "spoiler": false
            }
          ]
        },
        {
          "type": 10,
          "content": "# Servidor dos Programadores"
        },
        {
          "type": 10,
          "content": "Seja muito bem-vindo ao Servidor dos Programadores!"
        },
        {
          "type": 10,
          "content": "Você está em uma comunidade feita por **DEVS** para **DEVS**. Que amam programação e tecnologia. **Aqui, o foco é compartilhar sabedoria, trocar experiências, interagir com outras pessoas da área e crescer juntos.**"
        },
        {
          "type": 10,
          "content": "Seja você iniciante ou experiente, este é um espaço aberto para aprender, ensinar, tirar dúvidas, colaborar em projetos, participar de eventos e fazer conexões reais com outros desenvolvedores."
        },
        {
          "type": 10,
          "content": "-# Antes de prosseguir, leia as regras do servidor em <#1224155659629494283>."
        }
      ]
    },
    {
      "type": 14,
      "divider": true,
      "spacing": 1
    },
    {
      "type": 1,
      "components": [
        {
          "type": 2,
          "style": 5,
          "label": "Interaja no chat",
          "emoji": null,
          "disabled": false,
          "url": "https://discord.com/channels/1112920281367973900/1113274694443999282"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Ache uma vaga",
          "emoji": null,
          "disabled": false,
          "url": "https://discord.com/channels/1112920281367973900/1465190415614345329"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Contrate alguém",
          "emoji": null,
          "disabled": false,
          "url": "https://discord.com/channels/1112920281367973900/1455014681881350216"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Escolha suas tecnologias",
          "emoji": null,
          "disabled": false,
          "url": "https://discord.com/channels/1112920281367973900/1363980601115410462"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Escolha sua cor",
          "emoji": null,
          "disabled": false,
          "url": "https://discord.com/channels/1112920281367973900/1381473062108790814"
        }
      ]
    }
  ],
  flags: 32768,
};

async function sendWebhook() {
  console.log("[Welcome] Enviando mensagem de boas-vindas...");
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("[Welcome] ✓ Mensagem enviada com sucesso.");
    } else {
      console.error("[Welcome] ✗ Falha ao enviar:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[Welcome] ✗ Erro ao enviar webhook:", err);
  }
}

sendWebhook();