const Spotify = require('node-spotify-api');
const config = require('../configs/config.json');

const spotify = new Spotify({
    id: config.spotify.id,
    secret: config.spotify.secret
});

async function getSpotifyTrackNames(url) {
    const isPlaylist = url.includes('playlist');
    const urlId = extractSpotifyId(url);
    const details = await getSpotifyDetails(urlId, isPlaylist);
    
    if(!isPlaylist) return [details.name + " " + details.artists[0].name];

    let tracks = details.tracks.items;
    tracks = tracks.slice(0, config.playlistLimit);
    let promises = [];
    for (let trackWrapper of tracks) {
        promises.push(getSpotifyDetails(trackWrapper.track.id));
    }
    tracks = await Promise.all(promises);
    
    tracks = tracks.map((track) => {
        return track.name + " " + track.artists[0].name;
    });
    return tracks;
}

function extractSpotifyId(url) {
    const questIdx = url.indexOf('?');
    if (questIdx >= 0) {
        url = url.substring(0, questIdx);
    }
    return url.substring(url.length - 22);
}

function getSpotifyDetails(id, isPlaylist = false) {
    const url = isPlaylist ? config.spotify.playlistUrl + id : config.spotify.trackUrl + id;
    return spotify.request(url)
}

module.exports = {
    getSpotifyTrackNames,
    extractSpotifyId
}