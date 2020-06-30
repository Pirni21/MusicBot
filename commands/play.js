var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');
    const config = require('../configs/config.json');
    const Youtube = require('../core/youtube');

    const public = {
        name: 'play',
        aliases: ['p'],
        description: `Send an youtube or spotify url as argument. (-p = permanent) (Playlist limit: ${config.youtube.songsPerPlaylist})`,
        guildOnly: true,
        usage: '[-p][url]',
        execute: execute
    }

    async function execute(message, args) {
        try {
            let permanent = false;
            if(args.length < 1) throw 'Args length has to be 1.';
            if (args[0] == '-p') {
                permanent = true;
                args.shift();   
            }
            const ids = await Youtube.getYoutubeIds(args[0]);
            ids.map((id) => {
                Queue.play(message, id, permanent);
            });
        } catch (err) {
            console.error(`Error (p:${args[0]}): ${err}`);
            BasicActions.send(message, `Error: ${err}`);
        }
    }

    return public;
})();

module.exports = Module;