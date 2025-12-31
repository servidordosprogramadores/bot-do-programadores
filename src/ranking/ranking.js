const { sendTopCommand } = require('./sendTop');
const { parseRankingMessage } = require('./parseMessage');
const { sendRankMessage } = require('./sendRank');

module.exports = (client) => {
  console.log("[Ranking] Iniciando módulo de ranking...");

  const runRankingLoop = async () => {
    try {
      const messageData = await sendTopCommand(client);
      if (!messageData) return;
      const { textRank, voiceRank } = parseRankingMessage(messageData);
      await sendRankMessage(client, textRank, voiceRank);
    } catch (error) {
      console.error("[Ranking] Erro no loop:", error);
    }
  };

  // Executa imediatamente ao iniciar
  runRankingLoop();

  // Executa a cada 10 minutos
  setInterval(runRankingLoop, 600000);
};