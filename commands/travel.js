const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('travel')
		.setDescription('Travel to a new location in the world. Different locations spawn different Pokémon.'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('location')
                    .setPlaceholder('Choose a location!')
                    .addOptions(
                        {
                            label: 'Ashlands',
                            description: 'NYI',
                            value: '1002035265944174613'
                        },
                        {
                            label: 'Aurora Glacier',
                            description: 'NYI',
                            value: '1002035335003381800'
                        },
                        {
                            label: 'City of Dreams',
                            description: 'NYI',
                            value: '1002035457342853250'
                        },
                        {
                            label: 'Dread Mire',
                            description: 'NYI',
                            value: '1002035495313871018'
                        },
                        {
                            label: 'Frozen Sea',
                            description: 'NYI',
                            value: '1002035530235641906'
                        },
                        {
                            label: 'Golden Coast',
                            description: 'NYI',
                            value: '1002035567397187625'
                        },
                        {
                            label: 'Howling Canyon',
                            description: 'NYI',
                            value: '1002035616655081554'
                        },
                        {
                            label: 'Lunar Grove',
                            description: 'NYI',
                            value: '1002035651337801798'
                        },
                        {
                            label: 'Mirror Lake',
                            description: 'NYI',
                            value: '1002035736511524976'
                        },
                        {
                            label: 'Overgrowth',
                            description: 'NYI',
                            value: '1002035768937681066'
                        },
                        {
                            label: 'Scorching Sands',
                            description: 'NYI',
                            value: '1002035799015034921'
                        },
                        {
                            label: 'Shimmering Reef',
                            description: 'NYI',
                            value: '1002035828660375665'
                        },
                        {
                            label: 'Shrouded Peaks',
                            description: 'NYI',
                            value: '1002035863141765171'
                        },
                        {
                            label: 'Thundering Coast',
                            description: 'NYI',
                            value: '1002035900525592576'
                        },
                        {
                            label: 'Tranquil Forest',
                            description: 'NYI',
                            value: '1002035934461689976'
                        },
                        {
                            label: 'Volcanic Islands',
                            description: 'NYI',
                            value: '1002035962857127967'
                        },
                        {
                            label: 'Windswept Plains',
                            description: 'NYI',
                            value: '1002036001440542751'
                        }
                    )
            );
        
        await interaction.reply({ components: [row] });
    }
};