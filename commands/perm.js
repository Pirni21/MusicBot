var Module = (function () {
    const BasicActions = require('../core/basics');
    const Queue = require('../music/queue');
    const config = require('../configs/config.json');
    const fs = require('fs');

    const public = {
        name: 'perm',
        description: 'Adds all permanent songs to the queue.',
        guildOnly: true,
        execute: execute
    }

    async function execute(message, args) {
        try {
            const files = await getAllPermFiles();
            BasicActions.send(message, `Try to add all songs: `);
            files.map((file) => {
                let id = file.substring(0, file.length - 4);
                Queue.play(message, id);
            });
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
    
    return public;
})();

module.exports = Module;