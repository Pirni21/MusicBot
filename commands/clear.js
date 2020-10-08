const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'clear',
    description: 'Clears the current queue',
    guildOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        Queue.clear();
        BasicActions.send(message, 'Queue cleared.');
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;