const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, Routes, Collection } = require('discord.js');
const {readFileSync, promises: fsPromises} = require('fs');
const path = require('node:path');

const contents = readFileSync('C:\\Users\\Farhad\\Documents\\djs-v14-tutorial\\src\\swearWords.txt', 'utf-8');
const words = contents.split(/\r?\n/);

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (message.content) {
            if (words.some(word => ` ${message.content.toLowerCase()} `.includes(` ${word} `))) {
              await message.channel.send(`Please do not swear, ${message.author.tag}`);
              await message.delete()
                .catch(console.error);
            }
          }
    }
}