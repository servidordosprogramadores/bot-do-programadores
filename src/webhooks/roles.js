const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const WEBHOOK_URL = process.env.WEBHOOK_ROLES + "?with_components=true";

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
          "content": "# Cargos do Servidor"
        },
        {
          "type": 10,
          "content": "Os cargos do servidor existem para **organizar a comunidade**, reconhecer a participação dos membros e destacar quem contribui ativamente com o crescimento do servidor. "
        }
      ]
    },
    {
      "type": 17,
      "accent_color": 1722367,
      "spoiler": false,
      "components": [
        {
          "type": 10,
          "content": "## Cargos de moderação"
        },
        {
          "type": 10,
          "content": "- <@&1225200441890181333> Cargo destinado aos **donos do servidor**.\n-# **Não é possível** obter esse cargo.\n- <@&1363951824356249720> Cargo para **staffs com permissões administrativas**, responsáveis por auxiliar o servidor em todos os aspectos.\n-# **Não é possível**obter esse cargo.\n- <@&1364069154113454140> Cargo para **staffs com permissões menores**, focados em ajudar os membros e manter a organização do servidor.\n-# Obtido ao ser **ativo** na comunidade e **mostrar interesse** em participar da moderação."
        }
      ]
    },
    {
      "type": 17,
      "accent_color": 1722367,
      "spoiler": false,
      "components": [
        {
          "type": 10,
          "content": "## Cargos gerais"
        },
        {
          "type": 10,
          "content": "- <@&1363936413271331118> Cargo para **membros participativos** do servidor.\n-# Obtido ao atingir **nível 5 em voz** e **nível 3 em texto**.\n- <@&1381776837599952976> Cargo para membros com **alta participação** no servidor.\n-# Obtido ao atingir **nível 10 em voz** e **nível 5 em texto**.\n- <@&1409756076794187846> Cargo para quem **representa e divulga** o servidor.\n-# Obtido ao utilizar a** tag do servidor**. Confira o chat **<#1410072306021302344>**.\n- <@&1115446339661221980> Cargo para quem **impulsiona** o servidor.\n-# Obtido ao **impulsionar o servidor**. Confira o chat **<#1363964628639551498>**.\n- <@&1363939241486319788> Cargo destinado a **produtores de conteúdo**.\n-# Obtido ao ter um **canal ativo** no **YouTube**, **Instagram** ou **TikTok**. Chame um staff para receber seu cargo.\n- <@&1412567704556277780> Cargo para comunidades ou pessoas **parceiras** do servidor.\n-# Obtido ao **fechar alguma parceria com o servidor**.\n- <@&1412508454970589204> Cargo para membros que **ganharam sorteios** no servidor.\n-# Obtido ao **ganhar um sorteio**. Confira o chat **<#1408128835794374666>**.\n- <@&1395176432489070643> Cargo para **amigos** dos donos do servidor.\n-# **Não é possível** obter esse cargo."
        }
      ]
    },
    {
      "type": 17,
      "accent_color": 1722367,
      "spoiler": false,
      "components": [
        {
          "type": 10,
          "content": "## Cargos automáticos"
        },
        {
          "type": 10,
          "content": "- <@&1224303972572074015> Cargo **padrão do servidor**.\n-# Obtido **automaticamente** ao entrar no servidor.\n- <@&1457476221247033466> Cargo de **tecnologias** para destacar sua stack.\n-# Obtido através do canal **<#1363980601115410462>**.\n- <@&1457475998043082985> Cargo de **cores** para customizar seu perfil.\n-# Obtido através do canal **<#1381473062108790814>**.\n- <@&1457478005864792184> Cargo de **senioridade**.\n-# Obtido automaticamente através do **onboarding** ao entrar no servidor.\n- <@&1457477233332715561> Cargo de **região**.\n-# Obtido automaticamente através do **onboarding** ao entrar no servidor.\n- <@&1457476043131588678> Cargo de **notificações**.\n-# Obtido automaticamente através do **onboarding** ao entrar no servidor."
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