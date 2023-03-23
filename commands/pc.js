const { SlashCommandBuilder } = require('@discordjs/builders');

// Set up DynamoDB functionality.
const ddb = require('@aws-sdk/client-dynamodb');
const ddbClient = new ddb.DynamoDBClient({region: 'us-east-1'});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pc')
		.setDescription('Check the Pokemon in your PC.'),
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

        // Inform the user they must register first if they have not done so.
        if (regCheckData.Count == 0) {
            await interaction.reply("You must register before you can check your PC! Please use the `/register` command before continuing.");
            return(console.log("Directing " + interaction.user + " to register first."));
        }

        // Pull the trainer's profile.
        const trainerParams = {
            TableName: "pkmn-delirious-table",
            Key: {
                'entity_id': {S: interaction.user.id}
            }
        }

        const trainerData = await ddbClient.send(new ddb.GetItemCommand(trainerParams));
        const trainerProfile = JSON.parse(trainerData.Item.info.S);
        const pc = JSON.stringify(trainerProfile.pokemon.pc);

        await interaction.reply("The Pokemon in your PC are: " + pc);
    }
};