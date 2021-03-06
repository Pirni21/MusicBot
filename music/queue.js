const Downloader = require('./downloader');
const AuxPlayer = require('./player');
const DiscordPlayer = require('./discord');
const Metadata = require('../core/metadata');
const config = require('../configs/config.json');
const fs = require('fs');
const player = require('./player');
const BasicActions = require('../core/basics');
const {set, get, KEYS} = require('../configs/runtimeConfigs');

AuxPlayer.init(songFinished);
let songQueue = [];
let downloadList = [];

let interrupt = false;

async function play(message, id, permanent) {
    let foundSong = findSongById(id);
    if (!foundSong) foundSong = await findInFileSystem(id);
    if (!foundSong) {
        BasicActions.react(message, BasicActions.Emoji.download);
        console.log(`Added song with id "${id}" to download list`)
        addToDownloadList(message, id, permanent)
        return;
    }

    BasicActions.react(message, BasicActions.Emoji.thumbsup);
    console.log(`${foundSong.title} (${foundSong.videoId}) has been added from filesystem or queue`);
    songQueue.push(foundSong);
    playSong();
}

function addToDownloadList(message, id, permanent) {
    downloadList.push({
        id,
        permanent,
        message
    });
    set(KEYS.totalDownloading, get(KEYS.totalDownloading) + 1);

    tryToDownload();
}

function tryToDownload() {
    if (get(KEYS.currDownloading) < config.downloadLimit && downloadList.length > 0) {
        set(KEYS.currDownloading, get(KEYS.currDownloading) + 1);

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
        metadata.file = song.file;
        songQueue.push(metadata);
        console.log(metadata.title + ' downloaded');
        BasicActions.react(toDownload.message, BasicActions.Emoji.thumbsup);
        tryToDownload();
        playSong();
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.react(toDownload.message, BasicActions.Emoji.error);
        BasicActions.send(toDownload.message, `Error: ${err}`);
    }
    set(KEYS.currDownloading, get(KEYS.currDownloading) - 1);
    set(KEYS.totalDownloading, get(KEYS.totalDownloading) - 1);
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
    downloadList = [];
    set(KEYS.totalDownloading, 0);
    set(KEYS.currDownloading, 0);
    interrupt = false;
}

function pause() {
    set(KEYS.pause, true);
    skip(true);
}

function resume() {
    set(KEYS.pause, false);
    playSong();
}

function shuffle() {
    set(KEYS.shuffle, !get(KEYS.shuffle))
    return get(KEYS.shuffle);
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
    if (!AuxPlayer.running() && songQueue.length >= 1 && !interrupt && !get(KEYS.pause)) {
        console.log('Finished playing song: ' + songQueue[0].title);
        let toDelete = songQueue[0];
        songQueue = songQueue.slice(1);
        deleteIfPossible(toDelete);
        playSong();
    }
}

function playSong() {
    if (!AuxPlayer.running() && songQueue.length >= 1 && !interrupt && !get(KEYS.pause)) {
        if (get(KEYS.shuffle) && songQueue.length > 1) {
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
    let foundSong = findSongById(song.id);
    if (!foundSong && !song.permanent) {
        Downloader.delete(song.id)
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