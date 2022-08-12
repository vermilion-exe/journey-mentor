const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');

module.exports = {
    name: "channelDelete",
    once: false,
    async execute (channel) {
        const channelId = channel.guild.channels.cache.find(channel => channel.name === 'mentor-log').id
        const name = channel.name;
        const chan = channel;
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelDelete,
        });
        const deletionLog = fetchedLogs.entries.first();
        const {executor, target} = deletionLog;
        console.log(`Channel ${name} was deleted.`);
        chan.guild.channels.fetch(channelId).then(channel => {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Channel deletion')
                .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
                .setDescription(`Channel [${name}](${chan.url}) was deleted.`)
                .setTimestamp()
                .setFooter({ text: `User ID: ${executor.id}` });
            channel.send({embeds: [exampleEmbed]});
          });
    }
}