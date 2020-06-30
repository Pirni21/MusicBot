const config = require('../configs/config.json');
const mpg = require('mpg123');
let player = new mpg.MpgPlayer();
let finishCallback = null;

let isRunning = false;
let stopTimeout = null;

player.on('end', (err) => {
    if (err) console.error('Player on end: ' + err);
    isRunning = false;
    if(finishCallback) finishCallback();
});

player.on('resume', (err) => {
    if (err) console.error('Player on resume: ' + err);
    isRunning = true;
});

player.on('error', (err) => {
    console.error('Player on error: ' + err);
});

function init(finCallback = () => {}) {
    finishCallback = finCallback;
}

function play(song) {
    //stop();
    if (stopTimeout) clearTimeout(stopTimeout);
    stopTimeout = setTimeout(() => {
        console.log('timeout');
        stop();
    }, Math.floor(song.duration * 1000) - 2000);
    player.play(song.file);
}

function volume(percent) {
    player.volume(percent)
}

function progress() {
    return new Promise((resolve, reject) => {
        player.getProgress((prog) => {
            resolve(prog);
        });
    });
}

function stop() {
    if(running()) {
        clearTimeout(stopTimeout);
        stopTimeout = null;
        player.stop();
    }
}

function running() {
    return isRunning;
}

module.exports = {
    init,
    play,
    volume,
    stop,
    running,
    progress
}