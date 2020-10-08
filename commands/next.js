const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'next',
    description: 'Moves the given song to second position.',
    guildOnly: true,
    usage: '[nr]',
    execute: execute
}

async function execute(message, args) {
    try {
        if (args.length != 1) throw 'Args length has to be 1.';
        const nr = parseInt(args[0]);
        if (!Number.isInteger(nr)) throw 'Nr is not an integer.';
        const song = Queue.next(nr);
        BasicActions.send(message, `Next song "${song.title}".`);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;