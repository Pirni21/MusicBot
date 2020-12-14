const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

let volume = 100;

const public = {
    name: 'volume',
    aliases: ['v'],
    description: 'Regulates the volume or shows the volume if not parameter is present',
    guildOnly: true,
    usage: '[percent]',
    execute: execute
}

async function execute(message, args) {
    try {
        if (args.length == 0) {
            BasicActions.send(message, `Volume: ${volume}%.`);
            return;
        }

        if (args.length != 1) throw 'Args length has to be 1.';
        const vol = parseInt(args[0]);
        if (!Number.isInteger(vol)) throw 'Volume is not an integer.';
        if (vol < 0 || vol > 100) throw 'Volume has to be between 0 and 100.';
        volume = vol;
        Queue.volume(vol);
        BasicActions.send(message, `Volume changed.`);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;