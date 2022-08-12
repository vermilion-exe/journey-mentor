const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays the desired song.')
        .addStringOption((option) => 
        option
            .setName('query')
            .setDescription('the song that you want to play.')
            .setRequired(true)),

	async execute(interaction) {
        if(interaction.member.voice.channel != null){
            const connectionCheck = getVoiceConnection(interaction.member.guild.id);
            if(connectionCheck != null){
                //const player = new Player(interaction.client);
                interaction.client.player.once("trackStart", async (queue, track) => await queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))
                const query = interaction.options.getString('query');
                const queue = interaction.client.player.createQueue(interaction.guild, {
                    metadata: {
                        channel: interaction.channel
                    }
                });
                
                await queue.connect(interaction.member.voice.channel);
                await interaction.deferReply();
                const track = await interaction.client.player.search(query, {
                    requestedBy: interaction.user
                }).then(x => x.tracks[0]);
                if (!track) await interaction.followUp({ content: `❌ | Track **${query}** not found!` });
                else{
                    queue.play(track);

                    await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
                }
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