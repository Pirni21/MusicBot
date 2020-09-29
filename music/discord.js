const config = require('../configs/config.json');

var client = null;
var broadcast = null;
var dispatcher = null;

const connections = new Map();
const informChannels = new Map();

function init(discordClient) {
    client = discordClient;

    client.on('voiceStateUpdate', (oldMember, newMember) => {
        let newUserChannel = newMember.channel;
        let oldUserChannel = oldMember.channel

        if (!newUserChannel && oldUserChannel && oldUserChannel.members.size <= 1) {
            oldUserChannel.leave();
            connections.delete(oldUserChannel.id);
        }
    });

    broadcast = client.voice.createBroadcast();

    broadcast.on('subscribe', dispatcher => {
        console.log('New broadcast subscriber!');
    });

    broadcast.on('unsubscribe', dispatcher => {
        console.log('Channel unsubscribed from broadcast :(');
    });
}

async function join(message) {
    const channel = message.member.voice.channel;
    if (!channel) throw ('You need to join a voice channel first.');
    if (connections.has(channel.id)) throw ('I am already in your channel.')
    const connection = await channel.join();
    connection.play(broadcast);
    connections.set(connection.channel.id, connection);
}

async function leave(message) {
    const channel = message.member.voice.channel;
    if (!channel) throw ('You need to join a voice channel first.');
    if (!connections.has(channel.id)) throw ('I am not in your channel.')
    await channel.leave();
    connections.delete(channel.id)
}

function play(song) {
    dispatcher = broadcast.play(song.file);
    refreshPlayers();
    broadcastNewSong(song);
}

function stop() {
    broadcast.end();
}

function reset() {
    stop();
    disconnect();
    connections.clear();
    informChannels.clear();
}

function subscribe(channel) {
    informChannels.set(channel.id, channel);
}

function unsubscribe(channel) {
    informChannels.delete(channel.id);
}

async function broadcastNewSong(song) {
    const iterable = informChannels.values();
    const deleteKeys = [];

    for (let channel of iterable) {
        try {
            channel.send(`Starts playing "${song.title}".`);
        } catch (err) {
            console.log('Error while broadcasting songs: ' + err);
            deleteKeys.push(channel.id);
        }
    }

    deleteKeys.map((key) => {
        informChannels.delete(key);
    });
}

function disconnect() {
    const iterable = connections.values();
    for (let connection of iterable) {
        connection.channel.leave();
    }
    connections.clear();
}

function refreshPlayers() {
    const iterable = connections.values();
    for (let connection of iterable) {
        connection.play(broadcast);
    }
}

module.exports = {
    init,
    join,
    play,
    stop,
    leave,
    reset,
    subscribe,
    unsubscribe
}