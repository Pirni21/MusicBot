const Metadata = require('music-metadata');

async function get(file) {
    const mm = await Metadata.parseFile(file);
    return {
        title: mm.common.title,
        artist: mm.common.artist,
        duration: mm.format.duration
    };
}

module.exports = {
    get
};
