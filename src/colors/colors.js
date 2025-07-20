const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const { setRole } = require("../techs/setRole");
const { removeRole } = require("../techs/removeRole");
require("dotenv").config();

const PREMIUM_PERMISSION_ROLE_IDS = [
  process.env.ATIVO_ROLE_ID,
  process.env.RARO_ROLE_ID,
  process.env.CODA_FOFO_ROLE_ID,
  process.env.HACKER_ROLE_ID,
  process.env.LENDARIO_ROLE_ID,
  process.env.BOOSTER_ROLE_ID,
  process.env.APOIADOR_ROLE_ID,
  process.env.CRIADOR_ROLE_ID,
].filter(Boolean); // Filtra IDs nulos/undefined se não estiverem no .env

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

  // Cores Discord
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

// Função para criar o embed de cores
function createColorsEmbed() {
  const descriptionText =
    "**Selecione sua cor preferida no menu abaixo.**\n\n" +
    "Você pode ter apenas **uma cor**. \n" +
    "Ao escolher uma nova cor, a anterior será removida automaticamente.\n" +
    "Para ficar sem cor, selecione a opção *Remover Cor*.\n" +
    "-# Use o menu para alterar sua cor quando quiser.\n\n";

  const embed = new EmbedBuilder()
    .setTitle("Paleta de Cores")
    .setDescription(descriptionText)
    .setColor("#ffffff");
  const standardColors = COLORS.filter(
    (color) => !color.isPremium && !color.isDiscordColor
  );
  const discordColors = COLORS.filter(
    (color) => color.isDiscordColor && !color.isPremium
  );
  const premiumColors = COLORS.filter((color) => color.isPremium);

  let standardColorsField = "";
  standardColors.forEach((color) => {
    if (color.roleId) standardColorsField += `<@&${color.roleId}>\n`;
  });

  let discordColorsField = "";
  discordColors.forEach((color) => {
    if (color.roleId) discordColorsField += `<@&${color.roleId}>\n`;
  });

  let premiumColorsField = "";
  premiumColors.forEach((color) => {
    if (color.roleId) premiumColorsField += `<@&${color.roleId}>\n`;
  });

  embed.addFields(
    {
      name: "Cores __Padrões__:",
      value: standardColorsField || "Nenhuma cor padrão disponível.",
      inline: true,
    },
    {
      name: "Cores do __Discord__:",
      value: discordColorsField || "Nenhuma cor Discord disponível.",
      inline: true,
    },
    {
      name: "Cores __Premium__:",
      value: premiumColorsField || "Nenhuma cor premium disponível.",
      inline: true, // Mantido inline para consistência, pode ser false se a lista for longa
    }
  );

  return embed;
}

function createColorSelectMenu() {
  const removeColorOption = new StringSelectMenuOptionBuilder()
    .setLabel("Remover Cor")
    .setValue("remove_color_option");

  const colorOptions = COLORS.filter((c) => c.roleId).map(
    (
      color // Filtra cores sem roleId definido
    ) =>
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

      if (removedCount > 0) {
        const embed = new EmbedBuilder()
          .setColor(0x111214)
          .setDescription("Sua cor foi removida.");
        await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new EmbedBuilder()
          .setColor(0x111214)
          .setDescription("Você não possui uma cor para remover.");
        await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } else {
      const colorName = selectedValue.replace("color_", "");
      const selectedColor = COLORS.find(
        (c) => c.roleId && c.name.toLowerCase().replace(/\s/g, "") === colorName
      );

      if (!selectedColor) {
        await interaction.editReply({
          content: "Cor inválida selecionada ou não encontrada.",
          ephemeral: true,
        });
        return;
      }

      // Verificar permissão para cores premium
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

          const rolesChannelMention = process.env.ROLES_CHANNEL_ID
            ? `<#${process.env.ROLES_CHANNEL_ID}>`
            : "o canal de cargos";

          const embed = new EmbedBuilder()
            .setColor(0x111214)
            .setDescription(
              `Para selecionar uma cor premium, você precisa possuir um dos seguintes cargos: ${permissionRolesMentions}.\nSaiba como obtê-los em ${rolesChannelMention}.`
            );
          await interaction.editReply({ embeds: [embed], ephemeral: true });
          return;
        }
      }

      // Remover todas as cores existentes do usuário antes de adicionar a nova
      for (const color of COLORS) {
        if (
          color.roleId &&
          member.roles.cache.has(color.roleId) &&
          color.roleId !== selectedColor.roleId
        ) {
          await removeRole(member, color.roleId);
        }
      }

      // Adicionar a nova cor selecionada (se ainda não a tiver)
      if (!member.roles.cache.has(selectedColor.roleId)) {
        await setRole(member, selectedColor.roleId);
      }

      const role = interaction.guild.roles.cache.get(selectedColor.roleId);
      const embed = new EmbedBuilder()
        .setColor(0x111214) // Usar a cor do cargo selecionado ou uma cor padrão
        .setDescription(`Cargo ${role} adicionado ao seu perfil.`);
      await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    console.error(`Erro ao gerenciar cor:`, error);
    const errorEmbed = new EmbedBuilder()
      .setColor(0x111214)
      .setDescription(
        `Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.`
      );
    try {
      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
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

    const guild = colorsChannel.guild;
    // Garante que serverName seja uma string, com um fallback.
    const serverName = guild.name
      ? String(guild.name)
      : "Servidor dos Programadores";

    // Garante que serverIcon seja uma string (URL do ícone) ou null.
    const rawIcon = guild.iconURL({ dynamic: true });
    const serverIcon =
      rawIcon === undefined || rawIcon === null ? null : String(rawIcon);

    const embed = createColorsEmbed();

    embed.setFooter({
      text: serverName,
      iconURL: serverIcon,
    });

    const selectMenu = createColorSelectMenu();

    await colorsChannel.send({
      embeds: [embed],
      components: [selectMenu],
    });

    console.log("Embed de cores enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar embed de cores:", error);
  }
}

module.exports = {
  COLORS,
  handleColorSelectClick,
  sendColorEmbed,
};
