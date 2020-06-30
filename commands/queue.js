var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');

    const public = {
        name: 'queue',
        aliases: ['songs', 'q'],
        description: 'Returns the current queue.',
        execute: execute
    }

    function execute(message, args) {
        try {
            let returnValue = 'Queue:\r\n';
            let queue = Queue.queue();
            if (queue.length > 0) {
                for (let idx = 0; idx < queue.length; idx++) {
                    let duration = BasicActions.convertTime(queue[idx].duration);
                    returnValue += `${idx + 1}. ${queue[idx].title} (${duration})\r\n`;
                }
            } else {
                returnValue += 'Empty!';
            }
            BasicActions.send(message, returnValue);
        } catch (err) {
            console.error(`Error: ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }
    
    return public;
})();

module.exports = Module;