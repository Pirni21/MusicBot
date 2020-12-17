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
    let id = url.substring(url.length - 34);
    if (isValidPlaylistId(id)) return await getPlaylistIds(id);
    id = Spotify.extractSpotifyId(url);
    if (isValidSpotifyId(id)) return await getYoutubeIdsFromSpotify(url);
    id = url.substring(url.length - 11);
    if (!isValidSongId(id)) throw `Cannot find a song or playlist id in url ${url}.`;
    return [id];
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