const config = require('./secret/config.json');
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Create the Discord bot and its prefix.
const client = new Discord.Client({intents:["Guilds","GuildMembers","GuildMessages","GuildMessageReactions","GuildPresences"]});

// Retrieve the commands for the Discord bot and store them in a Discord collection.
client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

// Retrieve the events for the Discord bot.
const eventsPath = path.join(__dirname, 'events');
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

// Parse commands in the Discord server.
const locationRoles = ['1002035265944174613', '1002035335003381800', '1002035457342853250', '1002035495313871018', '1002035530235641906', '1002035567397187625', '1002035616655081554', '1002035651337801798', '1002035736511524976', '1002035768937681066', '1002035799015034921', '1002035828660375665', '1002035863141765171', '1002035900525592576', '1002035934461689976', '1002035962857127967', '1002036001440542751'];

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {

        const command = client.commands.get(interaction.commandName);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
        }
    } else if (interaction.isSelectMenu()) {
        // Handle starter Pokémon selection.
        if (interaction.customId == 'starter') {
            let starter = '';
            if (interaction.values == '1') {
                starter = 'Bulbasaur';
            } else if (interaction.values == '4') {
                starter = 'Charmander';
            } else if (interaction.values == '7') {
                starter = 'Squirtle';
            }

            await interaction.update({ content: 'You have selected ' + starter + ' as your starter Pokémon! Your registration will be completed shortly.', components:[]});
        }

        // Handle the travel command.
        if (interaction.customId === 'location') {
            await interaction.update({ content: 'Traveling...', components:[] });

            for (let i = 0; i < locationRoles.length; i++) {
                if (interaction.member.roles.cache.has(locationRoles[i])) {
                    await interaction.member.roles.remove(locationRoles[i]);
                }
            }

            await interaction.member.roles.add(interaction.values);
            await interaction.deleteReply();
        }
    }
});

// Parse reactions in the Discord server.
const roleChannel = '1002407668255830157';

client.on('messageReactionAdd', async (reaction, user) => {
   console.log('Reaction received.');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
});

// Connect to the Discord application.
client.login(config.token);