const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'resume',
    aliases: ['continue'],
    description: 'Restarts the current song.',
    guildOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        Queue.resume();
        BasicActions.send(message, 'Resumed');
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;