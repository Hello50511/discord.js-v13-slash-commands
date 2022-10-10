const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("hello").setDescription("say hi"),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   * @returns
   */
  async execute(interaction) {
    await interaction.reply({ content: "hi" });
  },
};
