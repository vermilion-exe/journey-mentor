const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');

module.exports = {
    name: "messageUpdate",
    once: false,
    async execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;
        const channelId = oldMessage.guild.channels.cache.find(channel => channel.name === 'mentor-log').id;
    
        const count = 1950;
        const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? " ..." : "");
        const Edited = newMessage.content.slice(0, count) + (newMessage.content.length > count ? " ..." : "");
    
        oldMessage.guild.channels.fetch(channelId).then(channel => {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Message Edit')
                .setAuthor({ name: oldMessage.author, iconURL: oldMessage.author.avatarURL() })
                .setDescription(`A [message](${newMessage.url}) has been edited by ${newMessage.author} in ${newMessage.channel}.`)
                .addFields(
                    {name: 'original:',value: Original},
                    {name: 'edit:', value: Edited}    )
                .setTimestamp()
                .setFooter({ text: `User ID: ${oldMessage.author.id}` });
            channel.send({embeds: [exampleEmbed]});
          });
    }
}