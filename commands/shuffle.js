var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');
    const config = require('../configs/config.json');

    const public = {
        name: 'shuffle',
        description: 'Starts or ends shuffeling.',
        guildOnly: true,
        execute: execute
    }

    async function execute(message, args) {
        try {
            let state = Queue.shuffle();
            BasicActions.send(message, `Shuffle ${state ? 'on' : 'off'}`);
        } catch (err) {
            console.error(`Error: ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }

    return public;
})();

module.exports = Module;