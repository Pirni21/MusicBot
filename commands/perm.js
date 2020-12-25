const BasicActions = require('../core/basics');
const Queue = require('../music/queue');
const config = require('../configs/config.json');
const fs = require('fs');
const Metadata = require('../core/metadata');
const { checkNumber } = require('../core/basics');

const public = {
    name: 'perm',
    description: 'Adds all permanent songs to the queue.',
    guildOnly: true,
    usage: '[nr]*',
    execute: execute
}

async function execute(message, args) {
    try {
        let songObjs = await getAllSongObjs();

        if (songObjs.length == 0) {
            BasicActions.send(message, 'Cannot find perm songs');
            return;
        }

        songObjs = sortSongObjs(songObjs);

        if (args.length > 0) {
            const numbers = args.map(arg => BasicActions.checkNumber(arg, 1, songObjs.length, "Cannot find a song at position ${nr}."));
            const choosenSongs = numbers.map(nr => songObjs[nr - 1]);
            choosenSongs.forEach(song => Queue.play(message, song.id));  
        } else {
            BasicActions.send(message, `List of all songs: \n`, 60000);
            let songTitles = songObjs.map((song, idx) => `${idx + 1}: ${song.title}`);         
            BasicActions.send(message, songTitles, 60000);
        }
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

async function getAllSongObjs() {
    const files = await getAllPermFiles();
    let promises = files.map(file => Metadata.get(`${config.permMusicDir}/${file}`));
    return songObjs = await Promise.all(promises);
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

function sortSongObjs(songObjs) {
    return songObjs.sort((a, b) => {
        if (!a) a = {};
        if (!b) b = {}; 
        a.title = a.title || "undefined";
        b.title = b.title || "undefined";
        return a.title.localeCompare(b.title);
    });
}

module.exports = public;