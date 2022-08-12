const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');

module.exports = {
    name: "messageDelete",
    once: false,
    async execute(message) {
        const channelId = message.guild.channels.cache.find(channel => channel.name === 'mentor-log').id

        message.guild.channels.fetch(channelId).then(channel => {
        const deleteEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Message Deletion')
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription(`A message sent by ${message.author} deleted in ${message .channel}.
            **${message}**`)
            .setTimestamp()
            .setFooter({ text: `User ID: ${message.author.id}` })

        channel.send({embeds: [deleteEmbed]});
      })
    }
}