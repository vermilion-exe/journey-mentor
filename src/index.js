const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection, JoinVoiceChannel } = require('discord.js');
const { REST } = require('@discordjs/rest');
const dayjs = require('dayjs');
const fs = require('node:fs');
const path = require('node:path');
const { Player } = require("discord-player");

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ],
});
//module.exports = client;
const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

client.player = new Player(client);

const rest = new REST({version: '10'}).setToken(TOKEN);

client.commands = new Collection();
const commandsPath = path.join('C:\\Users\\Farhad\\Documents\\djs-v14-tutorial\\src\\', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

const eventsPath = path.join('C:\\Users\\Farhad\\Documents\\djs-v14-tutorial\\src\\', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('ready', async () => {
    console.log(`${client.user.tag} logged in.`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('guildMemberAdd', async member => {
    member.roles.add('695666975535398972');
})

client.login(TOKEN);
