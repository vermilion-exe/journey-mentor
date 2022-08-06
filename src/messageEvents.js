import { EmbedBuilder } from "discord.js";

module.exports = {
    name: "messageUpdate",
    execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;

        const count = 1950;
        const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? " ..." : "");
        const Edited = newMessage.content.slice(0, count) + (newMessage.content.length > count ? " ..." : "");

        const logEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
	        .setTitle('Message Edit')
            .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.avatarURL() })
	        .setDescription(`A [message](${newMessage.url}) has been edited by ${newMessage.author} in ${newMessage.channel}.
            **Original**: \`\`\`${Original}\`\`\`
            **Edited**: \`\`\`${Edited}\`\`\``)
            .setTimestamp()
            .setFooter({ text: `User ID: ${newMessage.author.id}` });
        if(newMessage.attachments.size > 0){
            logEmbed.addFields(`Attachments:`, `${newMessage.attachments.map((a) => a.url)}`)
        }
        client.channels.fetch('1004272219465199727').send({embeds: [logEmbed]})
    }
}