/**
 *
 * @param {GuildMember} member
 * @param {string} roleId
 * @returns {Promise<void>}
 */
async function setRole(member, roleId) {
  try {
    await member.roles.add(roleId);
  } catch (error) {
    throw error;
  }
}

module.exports = { setRole };
