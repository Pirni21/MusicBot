const Metadata = require('music-metadata');

async function get(file) {
    const mm = await Metadata.parseFile(file);

    const song = {
        title: mm.common.title,
        artist: mm.common.artist,
        duration: mm.format.duration
    };

    return song;
}

module.exports = {
    get
}