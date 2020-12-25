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
        BasicActions.react(message, `${state ? BasicActions.Emoji.shuffle : BasicActions.Emoji.straight}`);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;