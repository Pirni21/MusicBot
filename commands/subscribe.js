const BasicActions = require('../core/basics');
const DiscordVoice = require('../music/discord');

const public = {
    name: 'subscribe',
    aliases: ['sub'],
    description: 'Subscribes a text channel to the auto current played list.',
    guildOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        DiscordVoice.subscribe(message.channel);
        BasicActions.react(message);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;