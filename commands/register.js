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
        const params = {
            KeyConditionExpression: "entity_id = :t",
            ExpressionAttributeValues: {
                ":t": { S: `${interaction.user.id}`}
            },
            TableName: "pkmn-delirious-table"
        };

        const data = await ddbClient.send(new ddb.QueryCommand(params));

        // Register the user if they have not already registered.
        if (data.Count == 0) {
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