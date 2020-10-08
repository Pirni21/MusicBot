const BasicActions = require('../core/basics');
const Queue = require('../music/queue');
const config = require('../configs/config.json');
const fs = require('fs');
const Metadata = require('../core/metadata');

const public = {
    name: 'perm',
    description: 'Adds all permanent songs to the queue.',
    guildOnly: true,
    usage: '[nr]',
    execute: execute
}

async function execute(message, args) {
    try {
        const files = await getAllPermFiles();
        if (args.length == 1) {
            const nr = parseInt(args[0]);
            if (!Number.isInteger(nr)) throw 'Nr is not an integer.';
            if (nr < 1 || nr > files.length) throw `Cannot find a song at position ${nr}.`;
            let file = files[nr - 1];
            let id = file.substring(0, file.length - 4);
            Queue.play(message, id);
        } else {
            BasicActions.send(message, `List of all songs: \n`);
            let promises = files.map(file => Metadata.get(`${config.permMusicDir}/${file}`));
            Promise.all(promises).then((songs) => {
                let response = songs.map((song, idx) => `${idx + 1}: ${song.title}`);
                BasicActions.send(message, response);
            });
        }
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

function getAllPermFiles() {
    return new Promise((resolve, reject) => {
        let permFiles = [];
        fs.readdir(config.permMusicDir, (err, files) => {
            if (err) return reject('Add all permanent read error: ' + err);
            for (const file of files) {
                if (file.endsWith('.mp3')) {
                    permFiles.push(file);
                }
            }
            resolve(permFiles);
        });
    });
}

module.exports = public;