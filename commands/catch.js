const { SlashCommandBuilder } = require('@discordjs/builders');
// const AWS = require('aws-sdk');

// Get the necessary data to create a Pokemon.
const gen1 = require('../data/pokedex/gen1.json');
const genlist = [gen1];

const natures = require('../data/natures.json');
const rates = require('../data/rates.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catch')
		.setDescription('Catch a new Pokémon.'),
    async execute(interaction) {
        // Determine which generation the Pokemon is from.
        const dexnum = Math.floor((Math.random() * 151) + 1);
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
        let level = 0;
        switch(genlist[generation-1][dexnum].spawninfo.rarity) {
            case 'mythic':
                level = 70 + Math.floor((Math.random() * 30) + 1);
                break;
            case 'legendary':
                level = 70 + Math.floor((Math.random() * 30) + 1);
                break;
            case 'epic':
                level = 45 + Math.floor((Math.random() * 30) + 1);
                break;
            case 'super rare':
                level = 20 + Math.floor((Math.random() * 35) + 1);
                break;
            case 'rare':
                level = 10 + Math.floor((Math.random() * 20) + 1);
                break;
            case 'uncommon':
                level = 5 + Math.floor((Math.random() * 25) + 1);
                break;
            case 'common':
                level = Math.floor((Math.random() * 20) + 1);
                break;
            default:
                level = Math.floor((Math.random() * 20) + 1);
}

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

        // Check if the Pokemon is shiny.
        let sval = Math.random().toFixed(6);
        let shiny = false;
        if (sval < rates.shiny) {
            shiny = true;
        }

        // Generate an ID for the Pokemon.
        const uuid = crypto.randomUUID();

        // Create the Pokemon object.
        const pkmn = {
            "pkmnID": uuid,
            "dexnum": dexnum,
            "name": outname,
            "type1": type1,
            "type2": type2,
            "gender": outgender,
            "ability": outability,
            "level": level,
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
            "shiny": shiny
        };

        // Create a file for the new Pokemon.
        let jpkmn = JSON.stringify(pkmn);
        fs.writeFile(`../data/pokemon/${outid}.json`, jpkmn, err => {
            if (err) throw err;
        });
        
        await interaction.reply();
    }
};