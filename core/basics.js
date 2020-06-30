var Module = (function () {
    const public = {
        send: send,
        reply: reply,
        toAuthor: toAuthor,
        delete: deleteMsgs,
        getMessage: getMessage,
        fail_if: fail_if,
        convertTime: convertTime
    }

    function send(message, data, path) {
        if (!path) {
            return message.channel.send(data, { split: true })
                .catch(console.error);
        }

        message.channel.send(data, {
            files: [path]
        })
            .catch(console.error);;
    }

    function reply(message, data) {
        return message.reply(data)
            .catch(console.error);
    }

    function toAuthor(message, data) {
        return message.author.send(data, { split: true })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                reply(message, 'it seems like I can\'t DM you! Do you have DMs disabled?');
            });
    }

    function deleteMsgs(message, amount) {
        return message.channel.bulkDelete(amount + 1, true)
            .catch(console.error);
    }

    function getMessage(message) {
        return message.cleanContent;
    }

    function fail_if(conResult, errMsg) {
        if (conResult)
            throw new Error(errMsg);
    }

    function convertTime(sec) {
        let tempDur = Math.round(sec);
        let seconds = tempDur % 60;
        return `${Math.floor(tempDur / 60)}:${seconds < 10 ? '0': ''}${seconds}`;
    }

    return public;
})();

module.exports = Module;