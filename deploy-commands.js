const config = require('./secret/config.json');
const fs = require('node:fs');
const path = require('node:path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({version: '10'}).setToken(config.token);

rest.put(Routes.applicationGuildCommands(config.clientID, config.guildID), {body: commands})
    .then(() => console.log('Commands have been registered.'))
    .catch(console.error);