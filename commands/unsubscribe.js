const BasicActions = require('../core/basics');
const DiscordVoice = require('../music/discord');

const public = {
    name: 'unsubscribe',
    aliases: ['unsub'],
    description: 'Unubscribes a text channel from the auto current played list.',
    guildOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        DiscordVoice.unsubscribe(message.channel);
        BasicActions.react(message);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;