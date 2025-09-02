const {
  TextDisplayBuilder,
  MessageFlags,
  ContainerBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ThumbnailBuilder,
  ActionRowBuilder,
  SectionBuilder,
} = require("discord.js");
const { setRole } = require("../techs/setRole");
const { removeRole } = require("../techs/removeRole");
require("dotenv").config();

const PREMIUM_PERMISSION_ROLE_IDS = [
  process.env.BOOSTER_ROLE_ID,
  process.env.APOIADOR_ROLE_ID,
  process.env.ATIVO_ROLE_ID,
  process.env.VIRAL_ROLE_ID,
  process.env.FAMOSO_ID,
  process.env.CRIADOR_ROLE_ID,
  process.env.AMIGO_ROLE_ID,
].filter(Boolean);

const COLORS = [
  // Cores Padrões
  {
    name: "Preto",
    roleId: process.env.PRETO_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Branco",
    roleId: process.env.BRANCO_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Azul",
    roleId: process.env.AZUL_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Ciano",
    roleId: process.env.CIANO_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Verde",
    roleId: process.env.VERDE_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Amarelo",
    roleId: process.env.AMARELO_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Vermelho",
    roleId: process.env.VERMELHO_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Roxo",
    roleId: process.env.ROXO_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },
  {
    name: "Rosa",
    roleId: process.env.ROSA_ROLE_ID,
    isPremium: false,
    isDiscordColor: false,
  },

  // Cores Especiais
  {
    name: "Discord",
    roleId: process.env.DISCORD_BLUE_ROLE_ID,
    isPremium: false,
    isDiscordColor: true,
  },
  {
    name: "Bravery",
    roleId: process.env.BRAVERY_ROLE_ID,
    isPremium: false,
    isDiscordColor: true,
  },
  {
    name: "Balance",
    roleId: process.env.BALANCE_ROLE_ID,
    isPremium: false,
    isDiscordColor: true,
  },
  {
    name: "Brilliance",
    roleId: process.env.BRILLIANCE_ROLE_ID,
    isPremium: false,
    isDiscordColor: true,
  },

  // Cores Premium
  {
    name: "Holográfico",
    roleId: process.env.HOLOGRAFICO_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
  {
    name: "Gradiente Azul",
    roleId: process.env.GRADIENTE_AZUL_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
  {
    name: "Gradiente Verde",
    roleId: process.env.GRADIENTE_VERDE_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
  {
    name: "Gradiente Amarelo",
    roleId: process.env.GRADIENTE_AMARELO_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
  {
    name: "Gradiente Vermelho",
    roleId: process.env.GRADIENTE_VEREMELHO_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
  {
    name: "Gradiente Roxo",
    roleId: process.env.GRADIENTE_ROXO_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
  {
    name: "Gradiente Rosa",
    roleId: process.env.GRADIENTE_ROSA_ROLE_ID,
    isPremium: true,
    isDiscordColor: false,
  },
];

function createColorSelectMenuV2() {
  const removeColorOption = new StringSelectMenuOptionBuilder()
    .setLabel("Remover Cor")
    .setValue("remove_color_option");

  const colorOptions = COLORS.filter((c) => c.roleId).map((color) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(color.name)
      .setValue(`color_${color.name.toLowerCase().replace(/\s/g, "")}`)
  );

  const options = [removeColorOption, ...colorOptions];

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("color_select")
    .setPlaceholder("Escolha uma cor ou remova a atual...")
    .addOptions(options);

  return new ActionRowBuilder().addComponents(selectMenu);
}

function createColorsContainerV2() {
  const container = new ContainerBuilder().setAccentColor(16717077);

  const thumbnail = new ThumbnailBuilder({
    media: {
      url: "https://cdn3.emoji.gg/temp/68b63438404043.06536795_fpohmkjgielqn.png",
    },
  });

  const text1 = new TextDisplayBuilder().setContent("# Paleta de Cores");
  const text2 = new TextDisplayBuilder().setContent(
    "-# Selecione abaixo a sua cor preferida."
  );
  const text3 = new TextDisplayBuilder().setContent(
    "Use o menu de seleção para **adicionar** ou **remover** uma cor. A cor aparece no seu perfil e destaca seu nome no servidor."
  );

  const section = new SectionBuilder()
    .addTextDisplayComponents(text1, text2, text3)
    .setThumbnailAccessory(thumbnail);

  container.addSectionComponents(section);

  const text4 = new TextDisplayBuilder()
    .setContent(`**Cores padrões**: <@&1381471316934266932>, <@&1381471416280682517>, <@&1381471984428253255>, <@&1381471512401547345>, <@&1381471925187907644>, <@&1381471816660422666>, <@&1381471983799111791>, <@&1381471579287847002>, <@&1381471716462694502>.\n\n**Cores especiais**: <@&1381442335468032050>, <@&1381442379994763285>, <@&1381442246922211338>, <@&1381442273237008495>.\n\n**Cores premium**: <@&1381754982876971008>, <@&1381755628883677184>, <@&1381755715584004227>, <@&1381755759187988591>, <@&1381755389485383770>, <@&1381755107753988146>, <@&1381755913987162163>.`);

  container.addTextDisplayComponents(text4);

  const selectMenuRow = createColorSelectMenuV2();
  container.addActionRowComponents(selectMenuRow);

  return container;
}

async function handleColorSelectClick(interaction) {
  if (
    !interaction.isStringSelectMenu() ||
    interaction.customId !== "color_select"
  )
    return;

  const selectedValue = interaction.values[0];
  const member = interaction.member;

  if (interaction.replied || interaction.deferred) {
    console.log("Interação já foi respondida ou está diferida");
    return;
  }

  try {
    await interaction.deferReply({ ephemeral: true });
  } catch (error) {
    console.error("Erro ao deferir a interação:", error);
    return;
  }

  try {
    if (selectedValue === "remove_color_option") {
      let removedCount = 0;
      for (const color of COLORS) {
        if (color.roleId && member.roles.cache.has(color.roleId)) {
          await removeRole(member, color.roleId);
          removedCount++;
        }
      }

      const container = new ContainerBuilder();
      let msg =
        removedCount > 0
          ? "Sua cor foi removida."
          : "Você não possui uma cor para remover.";
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(msg)
      );

      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        ephemeral: true,
      });
    } else {
      const colorName = selectedValue.replace("color_", "");
      const selectedColor = COLORS.find(
        (c) => c.roleId && c.name.toLowerCase().replace(/\s/g, "") === colorName
      );

      if (!selectedColor) {
        const container = new ContainerBuilder();
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "Cor inválida selecionada ou não encontrada."
          )
        );
        await interaction.editReply({
          flags: MessageFlags.IsComponentsV2,
          components: [container],
          ephemeral: true,
        });
        return;
      }

      if (selectedColor.isPremium) {
        const hasPermission = PREMIUM_PERMISSION_ROLE_IDS.some(
          (permissionRoleId) => member.roles.cache.has(permissionRoleId)
        );

        if (!hasPermission) {
          let permissionRolesMentions = "";
          if (PREMIUM_PERMISSION_ROLE_IDS.length > 0) {
            permissionRolesMentions = PREMIUM_PERMISSION_ROLE_IDS.map(
              (id) => `<@&${id}>`
            ).join(", ");
            if (PREMIUM_PERMISSION_ROLE_IDS.length > 1) {
              const lastCommaIndex = permissionRolesMentions.lastIndexOf(", ");
              permissionRolesMentions =
                permissionRolesMentions.substring(0, lastCommaIndex) +
                " ou " +
                permissionRolesMentions.substring(lastCommaIndex + 2);
            }
          }

          const container = new ContainerBuilder();
          container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Para selecionar uma **cor premium**, você precisa possuir um dos seguintes cargos: ${permissionRolesMentions}.`
            )
          );
          await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
            ephemeral: true,
          });
          return;
        }
      }

      for (const color of COLORS) {
        if (
          color.roleId &&
          member.roles.cache.has(color.roleId) &&
          color.roleId !== selectedColor.roleId
        ) {
          await removeRole(member, color.roleId);
        }
      }

      if (!member.roles.cache.has(selectedColor.roleId)) {
        await setRole(member, selectedColor.roleId);
      }

      const role = interaction.guild.roles.cache.get(selectedColor.roleId);
      const container = new ContainerBuilder();
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Cargo ${role} adicionado ao seu perfil.`
        )
      );
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(`Erro ao gerenciar cor:`, error);
    const container = new ContainerBuilder();
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.`
      )
    );
    try {
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        ephemeral: true,
      });
    } catch (replyError) {
      console.error("Erro ao responder com erro para o usuário:", replyError);
    }
  }
}

async function sendColorEmbed(client) {
  try {
    const colorsChannel = await client.channels.fetch(
      process.env.COLORS_CHANNEL_ID
    );

    const messages = await colorsChannel.messages.fetch({ limit: 10 });
    if (messages.size > 0) {
      await colorsChannel.bulkDelete(messages);
    }

    const container = createColorsContainerV2();

    await colorsChannel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });

    console.log("Painel de cores enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar painel de cores:", error);
  }
}

module.exports = {
  COLORS,
  handleColorSelectClick,
  sendColorEmbed,
};
