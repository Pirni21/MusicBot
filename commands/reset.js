const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'reset',
    description: 'Resets the bot.',
    adminOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        Queue.reset();
        BasicActions.react(message);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;