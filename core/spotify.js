const Spotify = require('spotify-web-api-node');
const config = require('../configs/config.json');

const spotify = new Spotify({
    clientId: config.spotify.id,
    clientSecret: config.spotify.secret
});

spotify.clientCredentialsGrant()
  .then((data) => {
    spotify.setAccessToken(data.body['access_token']);
  })
  .catch((err) => {
    console.error('Something went wrong when retrieving an access token from spotify: ', err);
  });

async function getSpotifyTrackNames(url) {
    const isPlaylist = url.includes('playlist');
    const urlId = extractSpotifyId(url);
    const details = await getSpotifyDetails(urlId, isPlaylist);
    
    if(!isPlaylist) return [details.name + " " + details.artists[0].name];

    let tracks = details.items;
    tracks = tracks.slice(0, config.playlistLimit);
    tracks = tracks.map((track) => {
        track = track.track;
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

async function getSpotifyDetails(id, isPlaylist = false) {
    let promise;
    if (isPlaylist) {
        promise = spotify.getPlaylistTracks(id);
    } else {
        promise = spotify.getTrack(id)
    };

    let res = await promise;
    if (res.statusCode >= 400) throw `Cannot find spotify ${isPlaylist ? 'playlist' : 'song'} with id ${id}`;
    return res.body;
}

module.exports = {
    getSpotifyTrackNames,
    extractSpotifyId
}