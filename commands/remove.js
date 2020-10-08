const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'remove',
    description: 'Removes a song from the queue.',
    guildOnly: true,
    usage: '[nr]',
    execute: execute
}

async function execute(message, args) {
    try {
        if (args.length != 1) throw 'Args length has to be 1.';
        const idx = parseInt(args[0]);
        if (!Number.isInteger(idx)) throw 'Nr is not an integer.';
        const song = Queue.remove(idx);
        BasicActions.send(message, `Removed song "${song.title}".`);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;