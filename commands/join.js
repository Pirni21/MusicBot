const BasicActions = require('../core/basics');
const DiscordVoice = require('../music/discord');

const public = {
    name: 'join',
    description: 'Joins your current voice channel.',
    guildOnly: true,
    execute: execute
}

async function execute(message, args) {
    try {
        await DiscordVoice.join(message);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;