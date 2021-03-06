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
    let searchParameters = 'Predefined';
    try {
        let permanent = false;
        if (args[0] == '-p') {
            permanent = true;
            args.shift();
        }

        searchParameters = args.join(' ');
        searchParameters = searchParameters.trim();
        if (searchParameters.length == 0) throw 'Cannot find a parameter';
        const id = await Youtube.searchForName(searchParameters);
        Queue.play(message, id, permanent);
    } catch (err) {
        console.error(`Error (s:${searchParameters}): ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;