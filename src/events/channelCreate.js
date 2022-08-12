const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');

module.exports = {
    name: "channelCreate",
    once: false,
    async execute (channel) {
        const name = channel.name;
        const chan = channel;
        const channelId = chan.guild.channels.cache.find(channel => channel.name === 'mentor-log').id
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
        });
        const creationLog = fetchedLogs.entries.first();
        const {executor, target} = creationLog;
        console.log(`Channel ${name} was created.`);
        chan.guild.channels.fetch(channelId).then(channel => {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Channel creation')
                .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
                .setDescription(`Channel [${name}](${chan.url}) was created.`)
                .setTimestamp()
                .setFooter({ text: `User ID: ${executor.id}` });
            channel.send({embeds: [exampleEmbed]});
        });
    }
}