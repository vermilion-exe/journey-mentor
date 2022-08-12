const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Adds the bot to your voice channel.'),
	async execute(interaction) {
        if(interaction.member.voice.channel != null){
            const connectionCheck = getVoiceConnection(interaction.member.guild.id);
            if(connectionCheck != null){
                await interaction.reply('The bot is already in a voice channel!');
            }
            else{
                const connection = await joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.member.guild.id,
                    adapterCreator: interaction.member.guild.voiceAdapterCreator,
                });
                await interaction.reply('The bot successfully joined the voice channel!');
            }
        }
        else{
            await interaction.reply('You are currently not in a voice channel');
        }
	},
};