const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute (member) {
        member.roles.add('695666975535398972');
        member.guild.channels.fetch('671385930443259925').then(channel => {
            channel.send(`Hey ${member.user.tag}, welcome to ⚜𝕋𝕙𝕖 𝕁𝕠𝕦𝕣𝕟𝕖𝕪⚜!`);
        })
    }
}