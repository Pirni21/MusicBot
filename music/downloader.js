const config = require('../configs/config.json');
const DownloaderBuilder = require("youtube-mp3-downloader");
const fs = require('fs');
const path = require('path');

function download(id, permanent) {
    return new Promise((resolve, reject) => {
        try {
            let songDir = permanent ? config.permMusicDir : config.musicDir;
            const Downloader = new DownloaderBuilder({
                "ffmpegPath": config.downloader.ffmpeg,
                "outputPath": songDir,
                "youtubeVideoQuality": config.downloader.quality,
                "queueParallelism": config.downloader.queueParallelism,
                "progressTimeout": config.downloader.progressTimeout
            });

            Downloader.download(id, `${id}.mp3`);
            Downloader.once("finished", function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                data.permanent = permanent;
                resolve(data);
            });
            
            Downloader.once("error", function (err) {
                reject(err);
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