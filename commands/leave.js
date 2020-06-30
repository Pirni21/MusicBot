var Module = (function () {
    const BasicActions = require('../core/basics');
    const DiscordVoice = require('../music/discord');

    const public = {
        name: 'leave',
        description: 'Leaves from your current voice channel.',
        guildOnly: true,
        execute: execute
    }

    async function execute(message, args) {
        try {
            await DiscordVoice.leave(message);
        } catch (err) {
            console.error(`Error: ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }
    
    return public;
})();

module.exports = Module;