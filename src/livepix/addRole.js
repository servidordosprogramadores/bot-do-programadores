const APOIADOR_ROLE_ID = process.env.APOIADOR_ROLE_ID || "1381652802908065812";

async function addSupporterRole(member) {
  if (!member || !member.guild)
    throw new Error("Membro inválido para adicionar cargo");

  const guildMember = member;
  // Verifica se já tem o cargo
  if (guildMember.roles.cache.has(APOIADOR_ROLE_ID)) return false;

  try {
    await guildMember.roles.add(
      APOIADOR_ROLE_ID,
      "Concedido por doação LivePix"
    );
    return true;
  } catch (err) {
    console.error("Falha ao adicionar cargo de apoiador:", err.message || err);
    throw err;
  }
}

module.exports = { addSupporterRole };
