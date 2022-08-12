const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');

module.exports = {
    name: "guildMemberUpdate",
    once: false,
    async execute(oldMember, newMember) {
        const channelId = oldMember.guild.channels.cache.find(channel => channel.name === 'mentor-log').id
        if(oldMember.nickname != newMember.nickname){
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberUpdate,
            })
            const changeLog = fetchedLogs.entries.first()
            const {executor, target} = changeLog
            await oldMember.guild.channels.fetch(channelId).then(channel => {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Name Change')
                    .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
                    .setDescription(`${oldMember.name}'s nickname has been edited by ${executor.tag}.
                    **Original**: \`\`\`${oldMember.nickname != null ? oldMember.nickname : 'no nickname'}\`\`\`
                    **Edited**: \`\`\`${newMember.nickname != null ? newMember.nickname : 'no nickname'}\`\`\``)
                    .setTimestamp()
                    .setFooter({ text: `User ID: ${executor.id}` })
                channel.send({embeds: [exampleEmbed]})
            })
        }
        else if(oldMember.roles.cache.size > newMember.roles.cache.size){
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberRoleUpdate,
            })
            const changeLog = fetchedLogs.entries.first()
            const {executor, target} = changeLog
            let roleRemoved = ""
            oldMember.roles.cache.forEach(role => {
                if (!newMember.roles.cache.has(role.id)) {
                    roleRemoved = role;
                }
            })
            await oldMember.guild.channels.fetch(channelId).then(channel => {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Member Role Change')
                    .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
                    .setDescription(`${executor.tag} removed the role ${roleRemoved} from ${target.tag}.`)
                    .setTimestamp()
                    .setFooter({ text: `User ID: ${executor.id}` })
                channel.send({embeds: [exampleEmbed]})
            })
        }
        else if(oldMember.roles.cache.size < newMember.roles.cache.size){
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberRoleUpdate,
            })
            const changeLog = fetchedLogs.entries.first()
            const {executor, target} = changeLog
            let roleAdded = ""
            newMember.roles.cache.forEach(role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    roleAdded = role;
                }
            })
            await oldMember.guild.channels.fetch(channelId).then(channel => {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Member Role Change')
                    .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
                    .setDescription(`${executor.tag} added the role ${roleAdded} to ${target.tag}.`)
                    .setTimestamp()
                    .setFooter({ text: `User ID: ${executor.id}` })
                channel.send({embeds: [exampleEmbed]})
            })
        }
    }
}