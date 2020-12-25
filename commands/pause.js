const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'pause',
    aliases: ['stop'],
    description: 'Pause the current video.',
    guildOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        Queue.pause();
        BasicActions.react(message);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;