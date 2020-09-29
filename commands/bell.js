var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');

    const public = {
        name: 'bell',
        description: 'Bells with the default sound',
        guildOnly: true,
        execute: execute
    }

    function execute(message, args) {
        try {
            Queue.play(message, '0buJ8YqKIZI', true);
        } catch (err) {
            console.error(`Error: ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }
    
    return public;
})();

module.exports = Module;