const { sendTopCommand } = require('./sendTop');
const { parseRankingMessage } = require('./parseMessage');
const { sendRankMessage } = require('./sendRank');

module.exports = (client) => {
  console.log("[Ranking] Iniciando módulo de ranking...");

  const runRankingLoop = async () => {
    console.log("[Ranking] ▶ Executando ciclo de atualização...");
    try {
      const messageData = await sendTopCommand(client);
      if (!messageData) {
        console.log("[Ranking] ⏭ Sem dados para processar. Pulando ciclo.");
        return;
      }
      console.log("[Ranking] Parseando dados do ranking...");
      const { textRank, voiceRank } = parseRankingMessage(messageData);
      console.log("[Ranking] ✓ Dados parseados. Enviando mensagem de ranking...");
      await sendRankMessage(client, textRank, voiceRank);
      console.log("[Ranking] ✓ Ciclo concluído.");
    } catch (error) {
      console.error("[Ranking] ✗ Erro no loop:", error);
    }
  };

  // Executa imediatamente ao iniciar
  runRankingLoop();

  console.log("[Ranking] ✓ Loop agendado para executar a cada 1 hora.");
  // Executa a cada 1 hora
  setInterval(runRankingLoop, 600000 * 6);
};