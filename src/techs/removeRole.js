/**
 * @param {GuildMember} member
 * @param {string} roleId
 * @returns {Promise<void>}
 */
async function removeRole(member, roleId) {
  try {
    await member.roles.remove(roleId);
  } catch (error) {
    throw error;
  }
}

module.exports = { removeRole };
