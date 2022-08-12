const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the current song.'),

	async execute(interaction) {
		const queue = interaction.client.player.getQueue(interaction.guildId)

		if (!queue) await interaction.reply("There are no songs in the queue")

		queue.setPaused(true)
        await interaction.reply("Song has been paused! Use `/resume` to resume the song")
	}
}