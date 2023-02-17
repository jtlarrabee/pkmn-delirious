const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const crypto = require('crypto');

// Set up DynamoDB functionality.
const ddb = require('@aws-sdk/client-dynamodb');
const ddbClient = new ddb.DynamoDBClient({region: 'us-east-1'});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register with the League as a new Pokémon trainer!'),
    async execute(interaction) {
        // Query the table to see if  the user has already registered.
        const regCheckParams = {
            KeyConditionExpression: "entity_id = :t",
            ExpressionAttributeValues: {
                ":t": { S: interaction.user.id}
            },
            TableName: "pkmn-delirious-table"
        };

        const regCheckData = await ddbClient.send(new ddb.QueryCommand(regCheckParams));
        console.log(regCheckData.Items);

        // Register the user if they have not already registered.
        if (regCheckData.Count == 0) {
            // Create the new trainer object.
            const newtrainer = {
                "userID": interaction.user.id,
                "pokemon": {
                    "main": 'None',
                    "team": [],
                    "pc": []
                },
                "inventory": interaction.user.id + '-inv'
            };

            console.log(newtrainer);

            // Push the trainer object to DynamoDB.
            const regTrainerParams = {
                TableName: "pkmn-delirious-table",
                Item: {
                    entity_id: { S: interaction.user.id },
                    info: { S: JSON.stringify(newtrainer)}
                }
            };

            await ddbClient.send(new ddb.PutItemCommand(regTrainerParams));

            // Create the new trainer's inventory.
            const newinventory = {
                "badges": {
            
                },
                "machines": {
                    "tm": [],
                    "tr": []
                },
                "items": {
                    "berries": {
                        "restore": {
                            "oran": 0,
                            "sitrus": 0,
                            "figy": 0,
                            "wiki": 0,
                            "mago": 0,
                            "aguav": 0,
                            "iapapa": 0,
                            "enigma": 0,
                            "leppa": 0
                        },
                        "cure": {
                            "cheri": 0,
                            "chesto": 0,
                            "pecha": 0,
                            "rawst": 0,
                            "aspear": 0,
                            "persim": 0,
                            "lum": 0
                        },
                        "protection": {
                            "occa": 0,
                            "passho": 0,
                            "wacan": 0,
                            "rindo": 0,
                            "yache": 0,
                            "chople": 0,
                            "kebia": 0,
                            "shuca": 0,
                            "coba": 0,
                            "payapa": 0,
                            "tanga": 0,
                            "charti": 0,
                            "kasib": 0,
                            "haban": 0,
                            "colbur": 0,
                            "babiri": 0,
                            "chilan": 0,
                            "roseli": 0
                        },
                        "battle": {
                            "liechi": 0,
                            "ganlon": 0,
                            "salac": 0,
                            "petaya": 0,
                            "apicot": 0,
                            "lansat": 0,
                            "starf": 0,
                            "custap": 0,
                            "jaboca": 0,
                            "rowap": 0,
                            "kee": 0,
                            "maranga": 0
                        },
                        "ev": {
                            "pomeg": 0,
                            "kelpsy": 0,
                            "qualot": 0,
                            "hondew": 0,
                            "grepa": 0,
                            "tamato": 0
                        }
                    },
                    "medicine": {
                        "restore": {
                            "potion": 0,
                            "super potion": 0,
                            "hyper potion": 0,
                            "max potion": 0,
                            "full restore": 0,
                            "ether": 0,
                            "elixir": 0,
                            "max ether": 0,
                            "max elixir": 0,
                            "revive": 0,
                            "max revive": 0
                        },
                        "cure": {
                            "antidote": 0,
                            "awakening": 0,
                            "burn heal": 0,
                            "ice heal": 0,
                            "paralyze heal": 0,
                            "full heal": 0
                        },
                        "boost": {
                            "rare candy": 0,
                            "hp up": 0,
                            "protein": 0,
                            "iron": 0,
                            "carbos": 0,
                            "calcium": 0,
                            "zinc": 0,
                            "pp up": 0,
                            "pp max": 0
                        }
                    },
                    "evolution": {
                        "stones": {
                            "dawn": 0,
                            "dusk": 0,
                            "fire": 0,
                            "ice": 0,
                            "leaf": 0,
                            "moon": 0,
                            "shiny": 0,
                            "sun" : 0,
                            "thunder": 0,
                            "water": 0
                        },
                        "other": {
                            "deep sea scale": 0,
                            "deep sea tooth": 0,
                            "dubious disc": 0,
                            "electirizer": 0,
                            "king's rock": 0,
                            "magmarizer": 0,
                            "metal coat": 0,
                            "oval stone": 0,
                            "prism scale": 0,
                            "protector": 0,
                            "razor claw": 0,
                            "razer fang": 0,
                            "reaper cloth": 0,
                            "sachet": 0,
                            "upgrade": 0,
                            "whipped dream": 0
                        },
                        "mega": {
                            "abomasite": 0,
                            "absolite": 0,
                            "aerodactylite": 0,
                            "aggronite": 0,
                            "alakazite": 0,
                            "altarianite": 0,
                            "ampharosite": 0,
                            "audinite": 0,
                            "banettite": 0,
                            "beedrillite": 0,
                            "blastoisinite": 0,
                            "blazikenite": 0,
                            "cameruptite": 0,
                            "charizardite x": 0,
                            "charizardite y": 0,
                            "diancite": 0,
                            "galladite": 0,
                            "garchompite": 0,
                            "gardevoirite": 0,
                            "gengarite": 0,
                            "glalitite": 0,
                            "gyaradosite": 0,
                            "heracronite": 0,
                            "houndoominite": 0,
                            "kangaskhanite": 0,
                            "latiasite": 0,
                            "latiosite": 0,
                            "lopunnite": 0,
                            "lucarionite": 0,
                            "manectite": 0,
                            "mawilite": 0,
                            "medichamite": 0,
                            "metagrossite": 0,
                            "mewtwonite x": 0,
                            "mewtwonite y": 0,
                            "pidgeotite": 0,
                            "pinsirite": 0,
                            "sablenite": 0,
                            "salamencite": 0,
                            "sceptilite": 0,
                            "scizorite": 0,
                            "sharpedonite": 0,
                            "slowbronite": 0,
                            "steelixite": 0,
                            "swampertite": 0,
                            "tyranitarite": 0,
                            "venusaurite": 0
                        }
                    },
                    "battle": {
                        "adamant orb": 0,
                        "assault vest": 0,
                        "big root": 0,
                        "binding band": 0,
                        "black belt": 0,
                        "black glasses": 0,
                        "black sludge": 0,
                        "blunder policy": 0,
                        "bright powder": 0,
                        "charcoal": 0,
                        "choice band": 0,
                        "choice scarf": 0,
                        "choice specs": 0,
                        "damp rock": 0,
                        "dragon fang": 0,
                        "expert belt": 0,
                        "flame orb": 0,
                        "focus band": 0,
                        "focus sash": 0,
                        "grip claw": 0,
                        "griseous orb": 0,
                        "hard stone": 0,
                        "heat rock": 0,
                        "heavy-duty boots": 0,
                        "iron ball": 0,
                        "lagging tail": 0,
                        "leek": 0,
                        "leftovers": 0,
                        "life orb": 0,
                        "light ball": 0,
                        "light clay": 0,
                        "lucky punch": 0,
                        "luminous moss": 0,
                        "lustrous orb": 0,
                        "magnet": 0,
                        "metal powder": 0,
                        "metronome": 0,
                        "miracle seed": 0,
                        "muscle band": 0,
                        "mystic water": 0,
                        "never-melt ice": 0,
                        "poison barb": 0,
                        "protective pads": 0,
                        "quick claw": 0,
                        "quick powder": 0,
                        "ring target": 0,
                        "rocky helmet": 0,
                        "room service": 0,
                        "safety goggles": 0,
                        "scope lens": 0,
                        "sharp beak": 0,
                        "shell bell": 0,
                        "silk scarf": 0,
                        "silver powder": 0,
                        "smooth rock": 0,
                        "soft sand": 0,
                        "soothe bell": 0,
                        "soul dew": 0,
                        "spell tag": 0,
                        "sticky barb": 0,
                        "thick club": 0,
                        "toxic orb": 0,
                        "twisted spoon": 0,
                        "weakness policy": 0,
                        "wide lens": 0,
                        "wise glasses": 0,
                        "zoom lens": 0
                    },
                    "plate": {
                        "draco plate": 0,
                        "dread plate": 0,
                        "earth plate": 0,
                        "fist plate": 0,
                        "flame plate": 0,
                        "icicle plate": 0,
                        "insect plate": 0,
                        "iron plate": 0,
                        "meadow plate": 0,
                        "mind plate": 0,
                        "pixie plate": 0,
                        "sky plate": 0,
                        "splash plate": 0,
                        "spooky plate": 0,
                        "stone plate": 0,
                        "toxic plate": 0,
                        "zap plate": 0
                    },
                    "training": {
                        "macho brace": false,
                        "power weight": false,
                        "power bracer": false,
                        "power belt": false,
                        "power lens": false,
                        "power band": false,
                        "power anklet": false
                    },
                    "breeding": {
                        "iv": {
                            "destiny knot": false,
                            "everstone": false,
                        },
                        "incense": {
                            "full incense": 0,
                            "lax incense": 0,
                            "luck incense": 0,
                            "odd incense": 0,
                            "pure incense": 0,
                            "rock incense": 0,
                            "rose incense": 0,
                            "sea incense": 0,
                            "wave incense": 0
                        }
                    },
                    "special": {
                        "iv up": 0,
                        "iv down": 0,
                        "iv max": 0,
                        "shiny candy": 0
                    }
                }
            }

            // Push the inventory object to DynamoDB.
            const regInventoryParams = {
                TableName: "pkmn-delirious-table",
                Item: {
                    entity_id: { S: newtrainer.inventory },
                    info: { S: JSON.stringify(newinventory)}
                }
            };

            await ddbClient.send(new ddb.PutItemCommand(regInventoryParams));

            // Allow the user to pick a starter Pokémon.
            const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('starter')
                    .setPlaceholder('Choose a starter Pokémon!')
                    .addOptions(
                        {
                            label: 'Bulbasaur',
                            description: 'I choose you, Bulbasaur!',
                            value: '1'
                        },
                        {
                            label: 'Charmander',
                            description: 'I choose you, Charmander!',
                            value: '4'
                        },
                        {
                            label: 'Squirtle',
                            description: 'I choose you, Squirtle!',
                            value: '7'
                        }
                    )
            );

            await interaction.reply({ components: [row] });
        };
    }
};