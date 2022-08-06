import {config} from 'dotenv';
import { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent } from 'discord.js';

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
});
//module.exports = client;
const TOKEN = process.env.BOT_TOKEN;

client.on('ready', async () => {
    console.log(`${client.user.tag} logged in.`);
    //if (!guildMemberUpdate) return console.log('No exist'); 
});

client.on('messageCreate', async (message) => {
    await console.log(`${message.author.tag} - ${message.content}`);
});

client.on('channelCreate', async channel => {
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
    //const channelLog = client.channels.fetch('1004272219465199727');
    client.channels.fetch(channelId).then(channel => {
        const exampleEmbed = new EmbedBuilder()
	        .setColor(0x0099FF)
	        .setTitle('Channel creation')
            .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
	        .setDescription(`Channel [${name}](${chan.url}) was created.`)
            .setTimestamp()
            .setFooter({ text: `User ID: ${executor.id}` });
        channel.send({embeds: [exampleEmbed]});
      });
});

client.on('channelDelete', async channel => {
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
    //const channelLog = client.channels.fetch('1004272219465199727');
    client.channels.fetch(channelId).then(channel => {
        const exampleEmbed = new EmbedBuilder()
	        .setColor(0x0099FF)
	        .setTitle('Channel deletion')
            .setAuthor({ name: executor.tag, iconURL: executor.avatarURL() })
	        .setDescription(`Channel [${name}](${chan.url}) was deleted.`)
            .setTimestamp()
            .setFooter({ text: `User ID: ${executor.id}` });
        //if(chan.attachments.size > 0){
            //logEmbed.addFields(`Attachments:`, `${chan.attachments.map((a) => a.url)}`)
        //}
        channel.send({embeds: [exampleEmbed]});
      });
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    const count = 1950;
    const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? " ..." : "");
    const Edited = newMessage.content.slice(0, count) + (newMessage.content.length > count ? " ..." : "");
    const channelId = oldMessage.guild.channels.cache.find(channel => channel.name === 'mentor-log').id

    await client.channels.fetch(channelId).then(channel => {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Message Edit')
            .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.avatarURL() })
            .setDescription(`A [message](${newMessage.url}) has been edited by ${newMessage.author} in ${newMessage.channel}.
            **Original**: \`\`\`${Original}\`\`\`
            **Edited**: \`\`\`${Edited}\`\`\``)
            .setTimestamp()
            .setFooter({ text: `User ID: ${newMessage.author.id}` })
        if(newMessage.attachments.size > 0){
            logEmbed.addFields(`Attachments:`, `${newMessage.attachments.map((a) => a.url)}`)
        }
        channel.send({embeds: [exampleEmbed]});
      })
});

client.on('messageDelete', async message => {
    const channelId = message.guild.channels.cache.find(channel => channel.name === 'mentor-log').id
    await client.channels.fetch(channelId).then(channel => {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Message Deletion')
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription(`A message sent by ${message.author} deleted in ${message .channel}.
            **${message}**`)
            .setTimestamp()
            .setFooter({ text: `User ID: ${message.author.id}` })

        channel.send({embeds: [exampleEmbed]});
      })
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const channelId = oldMember.guild.channels.cache.find(channel => channel.name === 'mentor-log').id
    if(oldMember.nickname != newMember.nickname){
        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberUpdate,
        })
        const changeLog = fetchedLogs.entries.first()
        const {executor, target} = changeLog
        await client.channels.fetch(channelId).then(channel => {
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
        await client.channels.fetch(channelId).then(channel => {
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
        await client.channels.fetch(channelId).then(channel => {
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
    else{
        console.log('doesnt work.');
    }
});

client.login(TOKEN);