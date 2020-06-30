var Module = (function () {
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
            BasicActions.send(message, `Subscribed channel ${message.channel.name}.`);
        } catch (err) {
            console.error(`Error: ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }
    
    return public;
})();

module.exports = Module;