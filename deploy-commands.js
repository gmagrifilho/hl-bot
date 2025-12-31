const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const config = require("./config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Abre o painel para enviar HL")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Registrando comando /painel no servidor...");

    await rest.put(
      Routes.applicationGuildCommands(
        "1453685359501246554",
        "1452137646049595506"
      ),
      { body: commands }
    );

    console.log("✅ Comando /painel registrado NA HORA!");
  } catch (error) {
    console.error(error);
  }
})();
