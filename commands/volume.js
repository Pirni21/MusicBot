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

        const vol = BasicActions.checkNumber(args[0], 0, 100, 'Volume has to be between ${min} and ${max}.')
        volume = vol;
        Queue.volume(vol);
        BasicActions.react(message);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;