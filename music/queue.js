const Downloader = require('./downloader');
const AuxPlayer = require('./player');
const DiscordPlayer = require('./discord');
const Metadata = require('../core/metadata');
const config = require('../configs/config.json');
const fs = require('fs');
const player = require('./player');
const { download } = require('./downloader');
const BasicActions = require('../core/basics');
const { time } = require('console');

AuxPlayer.init(songFinished);
let songQueue = [];
let downloadList = [];
let currDownloading = 0;

let interrupt = false;
let paused = false;
let isShuffling = false;

async function play(message, id, permanent) {
    let foundSong = findSongById(id);
    if (!foundSong) foundSong = await findInFileSystem(id);
    if (!foundSong) {
        BasicActions.send(message, `Added song with id "${id}" to downlaod list`);
        addToDownloadList(message, id, permanent)
        return;
    }

    BasicActions.send(message, `Added song "${foundSong.title}" (${foundSong.videoId}) to the queue`);
    console.log(`${foundSong.title} has been added from filesystem or queue`);
    songQueue.push(foundSong);
    playSong();
}

function addToDownloadList(message, id, permanent) {
    downloadList.push({
        id,
        permanent,
        message
    });

    tryToDownload();
}

function tryToDownload() {
    if (currDownloading < config.downloadLimit && downloadList.length > 0) {
        currDownloading++;
        let toDownload = downloadList.shift();
        downloadWrapper(toDownload);
    }
}

async function downloadWrapper(toDownload) {
    try {
        console.log('Starts downloading video with id ' + toDownload.id);
        let song = await Downloader.download(toDownload.id, toDownload.permanent);
        let metadata = await Metadata.get(song.file);
        song.duration = metadata.duration;
        currDownloading--;
        songQueue.push(song);
        console.log(song.title + ' downloaded');
        BasicActions.send(toDownload.message, `Added song "${song.title}" (${song.videoId}) to the queue`);
        tryToDownload();
        playSong();
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(toDownload.message, `Error: ${err}`);
    }
}

function skip(ignoreCheck = false) {
    if (!ignoreCheck)
        if (!AuxPlayer.running() || songQueue.length == 0) throw 'Queue is empty or no song is currently being played.';
    AuxPlayer.stop();
    DiscordPlayer.stop();
}

function np() {
    return songQueue[0];
}

function queue() {
    return Object.assign([], songQueue);
}

function clear() {
    interrupt = true;
    skip(true);
    deleteAllSongs();
    songQueue = [];
    setTimeout(() => { interrupt = false; }, 500);
}

function reset() {
    interrupt = true;
    DiscordPlayer.reset();
    clear();
    interrupt = false;
}

function pause() {
    paused = true;
    skip(true);
}

function resume() {
    paused = false;
    playSong();
}

function shuffle() {
    isShuffling = !isShuffling;
    return isShuffling;
}

function volume(percent) {
    player.volume(percent);
}

function remove(nr) {
    if (nr < 1 || nr > songQueue.length) throw `Cannot find a song at position ${nr}.`;
    if (nr == 1) throw 'Deleting the currently playing song is not permitted.';
    let song = songQueue.splice(nr - 1, 1)[0];
    deleteIfPossible(song);
    return song;
}

function next(nr) {
    if (nr < 1 || nr > songQueue.length) throw `Cannot find a song at position ${nr}.`;
    if (nr == 1) throw 'Cannot move the currently playing song.';
    let song = songQueue.splice(nr - 1, 1)[0];
    songQueue.splice(1, 0, song);
    return song;
}

async function progress() {
    return await AuxPlayer.progress();
}

function songFinished() {
    if (!AuxPlayer.running() && songQueue.length >= 1 && !interrupt && !paused) {
        console.log('Finished playing song: ' + songQueue[0].title);
        let toDelete = songQueue[0];
        songQueue = songQueue.slice(1);
        deleteIfPossible(toDelete);
        playSong();
    }
}

function playSong() {
    if (!AuxPlayer.running() && songQueue.length >= 1 && !interrupt && !paused) {
        if (isShuffling && songQueue.length > 1) {
            let idx = Math.round(Math.random() * (songQueue.length - 1));
            let song = songQueue.splice(idx, 1)[0];
            songQueue.unshift(song);
        }

        if (songQueue[0]) {
            console.log('Starts playing song: ' + songQueue[0].title);
            AuxPlayer.play(songQueue[0]);
            DiscordPlayer.play(songQueue[0]);
        }
    }
}

function deleteIfPossible(song) {
    let foundSong = findSongById(song.videoId);
    if (!foundSong && !song.permanent) {
        Downloader.delete(song.videoId)
            .then(() => { /* Do nothing */ })
            .catch((err) => {
                console.error('Delete if possible error: ' + err);
            });
    }
}

async function deleteAllSongs() {
    Downloader.deleteAll();
}

function findSongById(id) {
    let tempQueue = Object.assign([], songQueue);
    let idx = 0;
    let found = false;
    while (!found && idx < tempQueue.length) {
        found = tempQueue[idx].videoId == id;
        idx++;
    }
    idx--;
    return found ? tempQueue[idx] : null;
}

async function findInFileSystem(id) {
    let name = '/' + id + '.mp3';
    let path = config.musicDir + name;
    let foundPath = fs.existsSync(path) ? path : null;
    path = config.permMusicDir + name;
    if (!foundPath) foundPath = fs.existsSync(path) ? path : null;
    if (!foundPath) return foundPath;

    let song = await Metadata.get(foundPath);
    song.videoId = id;
    song.file = foundPath;
    if (foundPath.startsWith(config.permMusicDir)) song.permanent = true;
    return song;
}

module.exports = {
    play,
    skip,
    np,
    queue,
    clear,
    reset,
    pause,
    resume,
    remove,
    shuffle,
    volume,
    progress,
    next
}