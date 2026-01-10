const {
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  TextDisplayBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const TARGET_CHANNEL_ID = process.env.RANKING_CHANNEL_ID;

async function sendRankMessage(client, textRank, voiceRank) {
  const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
  if (!targetChannel) {
    console.error("[Ranking] Canal alvo não encontrado.");
    return;
  }

  const components = [
    new ContainerBuilder()
      .setAccentColor(parseInt(process.env.MAIN_COLOR))
      .addMediaGalleryComponents(
        new MediaGalleryBuilder()
          .addItems(
            new MediaGalleryItemBuilder()
              .setURL("https://i.postimg.cc/hGWsSnVf/PRg2.png"),
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
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("Como subir de nível e para que servem?")
          .setURL("https://discord.com/channels/1112920281367973900/1455800215083683881"),
      ),
  ];

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
}

module.exports = { sendRankMessage };
