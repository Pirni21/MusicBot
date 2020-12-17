const { substring } = require('ffmpeg-static');
const Metadata = require('music-metadata');

async function get(file) {
    const mm = await Metadata.parseFile(file);

    const lastIndexOfSlash = file.lastIndexOf('/');
    const songId = file.substring(lastIndexOfSlash + 1, file.length - 4);
    const song = {
        title: mm.common.title,
        artist: mm.common.artist,
        duration: mm.format.duration,
        file: file,
        id: songId
    };
    
    return song;
}

module.exports = {
    get
};
