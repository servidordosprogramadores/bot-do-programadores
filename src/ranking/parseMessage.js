const LINE_REGEX = /(?:🔸|🔹)\s*\|\s*#(\d+)\s*(<@\d+>)\s*-\s*XP:\s*\*\*(\d+)\*\*\s*(?:`\|`|\|)\s*Level:\s*\*\*(\d+)\*\*/;

const extractTextFromComponents = (components) => {
  let text = "";
  if (!components) return text;

  const comps = Array.isArray(components) ? components : [components];

  for (const component of comps) {
    const content = component.content || (component.data && component.data.content);
    if (content) {
      text += "\n" + content;
    }

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

function parseRankingMessage(messageData) {
  let fullText = messageData.content || "";

  if (messageData.embeds && messageData.embeds.length > 0) {
    messageData.embeds.forEach(embed => {
      if (embed.description) fullText += "\n" + embed.description;
      if (embed.fields) {
        embed.fields.forEach(field => {
          fullText += "\n" + field.value;
        });
      }
    });
  }

  if (messageData.components && messageData.components.length > 0) {
    fullText += extractTextFromComponents(messageData.components);
  }
  const textRank = parseSection(fullText, "TOP TEXT");
  const voiceRank = parseSection(fullText, "TOP VOICE");

  return { textRank, voiceRank };
}

module.exports = { parseRankingMessage };
