const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
  EmbedBuilder
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// guarda quem enviou
const submissions = new Map();

client.once(Events.ClientReady, () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

  // /painel
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "painel") {
      const botao = new ButtonBuilder()
        .setCustomId("mandar_clipe")
        .setLabel("🎬 Mandar clipe")
        .setStyle(ButtonStyle.Primary);

      await interaction.reply({
        content: "Envie seu Highlight clicando abaixo:",
        components: [new ActionRowBuilder().addComponents(botao)]
      });
    }
  }

  // botão mandar clipe
  if (interaction.isButton() && interaction.customId === "mandar_clipe") {
    const modal = new ModalBuilder()
      .setCustomId("form_clipe")
      .setTitle("Enviar Highlight");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("nome")
          .setLabel("Seu nome")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("hl")
          .setLabel("Link do Highlight")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
    );

    await interaction.showModal(modal);
  }

  // formulário enviado
  if (interaction.isModalSubmit() && interaction.customId === "form_clipe") {
    const nome = interaction.fields.getTextInputValue("nome");
    const hl = interaction.fields.getTextInputValue("hl");

    submissions.set(interaction.user.id, interaction.user);

    await interaction.reply({
      content: "✅ HL enviado! Aguarde avaliação.",
      ephemeral: true
    });

    const canal = interaction.guild.channels.cache.find(c => c.name === "avaliar-clipes");
    if (!canal) return;

    const embed = new EmbedBuilder()
      .setTitle("🎬 Novo Highlight")
      .setDescription(`👤 **${nome}**\n🔗 ${hl}`)
      .setColor(0x2f3136);

    canal.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`aprovar_${interaction.user.id}`)
            .setLabel("✅ Aprovar")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`reprovar_${interaction.user.id}`)
            .setLabel("❌ Reprovar")
            .setStyle(ButtonStyle.Danger)
        )
      ]
    });
  }

  // aprovar / reprovar
  if (interaction.isButton()) {
    if (interaction.customId.startsWith("aprovar_") || interaction.customId.startsWith("reprovar_")) {
      const userId = interaction.customId.split("_")[1];
      const user = await client.users.fetch(userId);

      const resultado = interaction.customId.startsWith("aprovar")
        ? "✅ **APROVADO**"
        : "❌ **REPROVADO**";

      const canalResultado = interaction.guild.channels.cache.find(c => c.name === "resultado-hl");
      if (canalResultado) {
        canalResultado.send(`👤 ${user} seu HL foi ${resultado}`);
      }

      await interaction.update({ components: [] });
    }
  }
});

client.login(config.token);
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot online");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor ativo na porta " + PORT);
});
