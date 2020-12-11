const config = require('../configs/config.json');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function download(id, permanent) {
    return new Promise((resolve, reject) => {
        try {
            let songpath = '';

            if (permanent)
                songpath = config.permMusicDir;
            else
                songpath = config.musicDir;
            
            const ytdl = spawn('youtube-dl', ['-f', 'bestaudio', '--extract-audio', '--add-metadata', '--audio-format', 'mp3', '--output', `${songpath}/%(id)s.%(ext)s`, `${id}`]);
            let err = false;

            ytdl.stderr.on('data', (data) => {
                err = true;
                console.error(`${data}`);
            });

            ytdl.on('close', (code) => {
                if (err)
                    reject("Unable to download!");
                else
                    resolve({file: `${songpath}/${id}.mp3`});
            });
        } catch (err) {
            reject(err);
        }
    });
}

function deleteSong(id) {
    return new Promise((resolve, reject) => {
        let doDelete = path.join(config.musicDir, id + '.mp3');
        fs.unlink(doDelete, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function deleteAll() {
    fs.readdir(config.musicDir, (err, files) => {
        if (err) return console.error('Delete all 1 error: ' + err);
        for (const file of files) {
            fs.unlink(path.join(config.musicDir, file), err => {
                if (err) console.error('Delete all error: ' + err);
            });
        }
    });
}

module.exports = {
    download,
    delete: deleteSong,
    deleteAll
}