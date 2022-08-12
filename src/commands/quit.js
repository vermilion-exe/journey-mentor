const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quit')
		.setDescription('Kicks the bot from your voice channel'),

	async execute(interaction) {
        if(interaction.member.voice.channel != null){
            const connectionCheck = getVoiceConnection(interaction.member.guild.id);
            if(connectionCheck != null){
                const queue = interaction.client.player.getQueue(interaction.guildId)

		        if (queue) queue.destroy();
                else await connectionCheck.destroy();
                await interaction.reply("Bye!")
            }
            else{
               await interaction.reply('Make sure the bot is in a voice channel first.');
            }
        }
        else{
            await interaction.reply('You are currently not in a voice channel');
        }
	}
}