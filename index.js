const config = require('./secret/config.json');
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('crypto');

// Set up DynamoDB functionality.
const ddb = require('@aws-sdk/client-dynamodb');
const ddbClient = new ddb.DynamoDBClient({region: 'us-east-1'});

// Get the necessary data to create a Pokemon.
const gen1 = require('./data/pokedex/gen1.json');
const genlist = [gen1];

const natures = require('./data/natures.json');
const rates = require('./data/rates.json');

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

            const dexnum = interaction.values;
            let generation = 0;
            if (dexnum < 151) {
                generation = 1;
            }
    
            // Generate and format all the information for the new Pokemon.
            const inname = genlist[generation-1][dexnum].name.split(" ");
            for (let i = 0; i < inname.length; i++) {
                inname[i] = inname[i][0].toUpperCase() + inname[i].substr(1);
            }
            let outname = inname.join(" ");
    
            const type1 = genlist[generation-1][dexnum].types.primary.charAt(0).toUpperCase() + genlist[generation-1][dexnum].types.primary.slice(1);
            let type2 = "None";
            if (genlist[generation-1][dexnum].types.secondary) {
                type2 = genlist[generation-1][dexnum].types.secondary.charAt(0).toUpperCase() + genlist[generation-1][dexnum].types.secondary.slice(1);
            }
    
            // Generate a gender for the Pokemon.
            const cmale = genlist[generation-1][dexnum].spawninfo.gender.male;
            const cfemale = genlist[generation-1][dexnum].spawninfo.gender.female;
            const genval = Math.random().toFixed(3);
    
            let outgender = "Genderless";
            if (!(cmale == 0 && cfemale == 0)) {
                if (genval < cmale) {
                    outgender = "Male";
                } else {
                    outgender = "Female";
                }
            }
    
            // Generate an ability for the Pokemon.
            let inability = "";
            let pabilval = Math.random().toFixed(3)
            if (genlist[generation-1][dexnum].abilities.first && genlist[generation-1][dexnum].abilities.second && genlist[generation-1][dexnum].abilities.hidden) {
                if (pabilval < 0.01) {
                    inability = genlist[generation-1][dexnum].abilities.hidden;
                } else if (pabilval >= 0.01 && pabilval < 0.505) {
                    inability = genlist[generation-1][dexnum].abilities.first;
                } else {
                    inability = genlist[generation-1][dexnum].abilities.second;
                }
            } else if (genlist[generation-1][dexnum].abilities.first && genlist[generation-1][dexnum].abilities.second)  {
                if (pabilval < 0.5) {
                    inability = genlist[generation-1][dexnum].abilities.first;
                } else {
                    inability = genlist[generation-1][dexnum].abilities.second;
                }
            } else if (genlist[generation-1][dexnum].abilities.first && genlist[generation-1][dexnum].abilities.hidden) {
                if (pabilval < 0.01) {
                    inability = genlist[generation-1][dexnum].abilities.hidden;
                } else {
                    inability = genlist[generation-1][dexnum].abilities.first;
                }
            } else {
                inability = genlist[generation-1][dexnum].abilities.first;
            }
    
            inability = inability.split(" ");
            for (let j = 0; j < inability.length; j++) {
                inability[j] = inability[j][0].toUpperCase() + inability[j].substr(1);
            }
            let outability = inability.join(" ");

            // Generate a level for the Pokemon.
            const level = 5;
    
            // Generate a nature for the Pokemon.
            const nval = Math.floor(Math.random() * 25);
            const nature = natures[nval].name.charAt(0).toUpperCase() + natures[nval].name.slice(1);
    
            // Generate IVs for the Pokemon.
            const ivhp = Math.floor((Math.random() * 32));
            const ivatk = Math.floor((Math.random() * 32));
            const ivdef = Math.floor((Math.random() * 32));
            const ivspatk = Math.floor((Math.random() * 32));
            const ivspdef = Math.floor((Math.random() * 32));
            const ivspd = Math.floor((Math.random() * 32));
    
            // Calculate total stats for the Pokemon.
            const totalhp = Math.round(((((2 * genlist[generation-1][dexnum].stats.hp + ivhp) * level) / 100) + level + 10));
            const totalatk = Math.round(((((2 * genlist[generation-1][dexnum].stats.atk + ivatk) * level) / 100) + 5) * natures[nval].atkmod);
            const totaldef = Math.round(((((2 * genlist[generation-1][dexnum].stats.def + ivdef) * level) / 100) + 5) * natures[nval].defmod);
            const totalspatk = Math.round(((((2 * genlist[generation-1][dexnum].stats.spatk + ivspatk) * level) / 100) + 5) * natures[nval].spatkmod);
            const totalspdef = Math.round(((((2 * genlist[generation-1][dexnum].stats.spdef + ivspdef) * level) / 100) + 5) * natures[nval].spdefmod);
            const totalspd = Math.round(((((2 * genlist[generation-1][dexnum].stats.spd + ivspd) * level) / 100) + 5) * natures[nval].spdmod);
    
            // Generate an ID for the Pokemon.
            const uuid = crypto.randomUUID();
    
            // Create the Pokemon object.
            const starterpkmn = {
                "pkmnID": uuid,
                "dexnum": dexnum,
                "name": outname,
                "type1": type1,
                "type2": type2,
                "gender": outgender,
                "ability": outability,
                "level": 5,
                "nature": nature,
                "basestats": {
                    "hp": genlist[generation-1][dexnum].stats.hp,
                    "atk": genlist[generation-1][dexnum].stats.atk,
                    "def": genlist[generation-1][dexnum].stats.def,
                    "spatk": genlist[generation-1][dexnum].stats.spatk,
                    "spdef": genlist[generation-1][dexnum].stats.spdef,
                    "spd": genlist[generation-1][dexnum].stats.spd
                },
                "ivs": {
                    "hp": ivhp,
                    "atk": ivatk,
                    "def": ivdef,
                    "spatk": ivspatk,
                    "spdef": ivspdef,
                    "spd": ivspd
                },
                "evs": {
                    "hp": 0,
                    "atk": 0,
                    "def": 0,
                    "spatk": 0,
                    "spdef": 0,
                    "spd": 0
                },
                "totalstats": {
                    "hp": totalhp,
                    "atk": totalatk,
                    "def": totaldef,
                    "spatk": totalspatk,
                    "spdef": totalspdef,
                    "spd": totalspd
                },
                "shiny": false
            };

            // Push the Pokemon object to DynamoDB.
            const regPkmnParams = {
                TableName: "pkmn-delirious-table",
                Item: {
                    entity_id: { S: uuid },
                    info: { S: JSON.stringify(starterpkmn)}
                }
            };

            await ddbClient.send(new ddb.PutItemCommand(regPkmnParams));
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