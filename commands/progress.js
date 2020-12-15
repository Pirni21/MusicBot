const BasicActions = require('../core/basics');
const Downloader = require('../music/downloader');

const public = {
    name: 'progress',
    description: 'Returns the progress of the download',
    execute: execute
}

async function execute(message, args) {
    try {
        BasicActions.send(message, Downloader.progress());
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;