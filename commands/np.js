const BasicActions = require('../core/basics');
const Queue = require('../music/queue');

const public = {
    name: 'np',
    aliases: ['curr'],
    description: 'Returns the currently played song.',
    execute: execute
}

async function execute(message, args) {
    try {
        let returnValue = 'Queue is empty.';
        let song = Queue.np();
        if (song) {
            let progress = await Queue.progress();
            let time = BasicActions.convertTime(song.duration * progress);
            returnValue = `${song.title} (Progress: ${time})`;
        }
        BasicActions.send(message, returnValue);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;