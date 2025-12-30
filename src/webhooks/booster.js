const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const WEBHOOK_URL = process.env.WEBHOOK_BOOSTER + "?with_components=true";

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
                "url": "https://i.postimg.cc/x8TXwHbb/PROGRAMADORES2.png"
              },
              "description": null,
              "spoiler": false
            }
          ]
        },
        {
          "type": 10,
          "content": "# Dê um boost no servidor\nAo impulsionar o **Servidor dos Programadores**, você não só fortalece a comunidade como também desbloqueia **benefícios exclusivos**!"
        },
        {
          "type": 10,
          "content": "- Cargo exclusivo de <@&1115446339661221980>.\n- Acesso ao canal ⁠⁠<#1397046990986023034>, <#1454921408814776494> e <#1454921435360526368>.\n- Permissão de enviar imagens no <#1113274694443999282>.\n- Acesso a cores holográficas no canal <#1381473062108790814>.\n- Insígnia no seu perfil do Discord que evolui com o tempo <a:z_boostMudando_cdw:943323396316495902>.\n- Ícone de Booster ao lado do seu nome aqui no servidor."
        },
        {
          "type": 10,
          "content": "-# Ao impulsionar o servidor você nos ajuda a liberar vantagens no **Discord**."
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
          "label": "Como impulsionar?",
          "emoji": null,
          "disabled": false,
          "url": "https://support.discord.com/hc/pt-br/articles/360028038352-Server-Boosting-FAQ#h_01HGX7DJ331AJ25MPQRD6R83KJ"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Vantagens que você nos ajuda a desbloquear",
          "emoji": null,
          "disabled": false,
          "url": "https://support.discord.com/hc/pt-br/articles/360028038352#h_01HGX7DJ33W4WY3FYVPRZ2CK02"
        }
      ]
    }
  ],
  flags: 32768,
};

async function sendWebhook() {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("Mensagem enviada com sucesso.");
    } else {
      console.error("Falha ao enviar mensagem:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Erro ao enviar webhook:", err);
  }
}

sendWebhook();