const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'volume',
    description: 'Regulates the volume.',
    guildOnly: true,
    usage: '[percent]',
    execute: execute
}

async function execute(message, args) {
    try {
        if (args.length != 1) throw 'Args length has to be 1.';
        const volume = parseInt(args[0]);
        if (!Number.isInteger(volume)) throw 'Volume is not an integer.';
        if (volume < 0 || volume > 100) throw 'Volume has to be between 0 and 100.';
        Queue.volume(volume);
        BasicActions.send(message, `Volume changed.`);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;