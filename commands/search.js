var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');
    const config = require('../configs/config.json');
    const Youtube = require('../core/youtube');

    const public = {
        name: 'search',
        aliases: ['s'],
        description: 'Send a search string as argument. (-p = permanent)',
        guildOnly: true,
        usage: '[-p][search params]',
        execute: execute
    }

    async function execute(message, args) {
        let searchParameters = args.join(' ');
        try {
            let permanent = false;
            if (args[0] == '-p') {
                permanent = true;
                args.shift();
            }

            searchParameters = searchParameters.trim();
            if (searchParameters.length == 0) throw 'Cannot find a parameter';
            const id = await Youtube.searchForName(searchParameters);
            BasicActions.send(message, `Try to downlaod song with id "${id}"`);
            const song = await Queue.play(id, permanent);
            BasicActions.send(message, `Added song "${song.title}" (${song.videoId}) to the queue`);
        } catch (err) {
            console.error(`Error (s:${searchParameters}): ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }

    return public;
})();

module.exports = Module;