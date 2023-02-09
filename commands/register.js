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
        const params = {
            KeyConditionExpression: "entity_id = :t",
            ExpressionAttributeValues: {
                ":t": { S: `${interaction.user.id}`}
            },
            TableName: "pkmn-delirious-table"
        };

        const data = await ddbClient.send(new QueryCommand(params));
        console.log(data);
                
        // await interaction.reply();
    }
};