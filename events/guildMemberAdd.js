module.exports = {
    name: 'guildMemberAdd',
    async execute(guildMember) {
        console.log(`${guildMember.user.tag} has joined the server!`);
    }
}