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
        Queue.play(message, 'glocke', true);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;