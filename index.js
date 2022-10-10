const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const client = new Client({ intents: 32767 });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.once("ready", () => {
  console.log("BOT READY");
  const rest = new REST({ version: "9" }).setToken(token);

  rest
    .put(Routes.applicationCommands(`${client.user.id}`), { body: commands })
    .then(() => console.log("Command Pushed on all servers"))
    .catch(console.error);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
