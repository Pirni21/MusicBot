const YoutubeSearch = require('yt-search');
const config = require('../configs/config.json');
const YtPlaylist = require('youtube-playlist');
const Spotify = require('./spotify');

async function searchForName(searchParameters) {
    let result = await YoutubeSearch(searchParameters);
    result = result.videos[0];
    if (!result) throw 'Cannot find a song with following parameters: ' + searchParameters;
    return result.videoId;
}

async function getYoutubeIds(url) {
    let id = tryToExtractIdFromYoutubeUrl(url);
    if (isValidPlaylistId(id)) return await getPlaylistIds(id);
    id = Spotify.extractSpotifyId(url);
    if (isValidSpotifyId(id)) return await getYoutubeIdsFromSpotify(url);
    id = tryToExtractIdFromYoutubeUrl(url);
    if (!isValidSongId(id)) throw `Cannot find a song or playlist id in url ${url}.`;
    return [id];
}

function tryToExtractIdFromYoutubeUrl(url) {
    let temp = url;
    if (temp.indexOf('?') >= 0) {
        temp = temp.split('?');

        if (temp.length != 2)
            throw `Cannot find a song or playlist id in url ${url}.`;

        temp = temp[temp.length - 1];
    }
        

    if (temp.indexOf('&') >= 0) {
        temp = temp.split('&');
    } else {
        temp = [temp];
    }

    if (temp.find(t => t.includes('='))) {
        temp = temp.map(t => t.split('='));
        temp = temp.find(t => t.includes('v'));

        if (temp && temp.length != 2)
            throw `Cannot find a song or playlist id in url ${url}.`;
    }

    if (temp && temp.length == 1 && temp[0] == url && url.includes('/')) {
        temp = url.split('/');
    }

    return temp ? temp[temp.length - 1] : url;
}

async function getPlaylistIds(playlistId) {
    const url = config.youtube.playlistUrl + playlistId;
    let ids = await YtPlaylist(url, 'id');
    ids = ids.data.playlist;
    return ids.slice(0, config.playlistLimit);
}

async function getYoutubeIdsFromSpotify(url) {
    let names = await Spotify.getSpotifyTrackNames(url);
    let ids = [];
    const promises = names.map((name) => {
        return searchForName(name)
            .then(id => ids.push(id))
            .catch(err => console.error(err));
    });
    await Promise.all(promises);
    return ids;
}

function isValidSongId(id) {
    let re = /^[a-zA-Z0-9-_]{11}$/;
    return re.test(id);
}

function isValidPlaylistId(id) {
    let re = /^[a-zA-Z0-9-_]{34}$/;
    return re.test(id);
}

function isValidSpotifyId(id) {
    let re = /^[a-zA-Z0-9-_]{22}$/;
    return re.test(id);
}

module.exports = {
    searchForName,
    getYoutubeIds
}