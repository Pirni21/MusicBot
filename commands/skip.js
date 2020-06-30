var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');

    const public = {
        name: 'skip',
        description: 'Skips a song.',
        guildOnly: true,
        execute: execute
    }

    function execute(message, args) {
        try {
            Queue.skip();
            BasicActions.send(message, 'Song skipped.');
        } catch (err) {
            console.error(`Error: ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }
    
    return public;
})();

module.exports = Module;