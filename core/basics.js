var Module = (function () {
    const Emoji = Object.freeze({ 
        success: '👌', 
        thumbsup: '👍', 
        error: '❌', // unused
        sleep: '💤', 
        pong: '🏓', 
        unknown: '❓', 
        internalError: '🆘', // unused
        shuffle: '🔀', 
        straight: '➡', 
        download: '⬇️' 
    });

    const public = {
        send: send,
        reply: reply,
        toAuthor: toAuthor,
        delete: deleteMsgs,
        getMessage: getMessage,
        fail_if: fail_if,
        convertTime: convertTime,
        checkNumber: checkNumber,
        react: react,
        Emoji: Emoji
    }

    function send(message, data, deleteAfter) {
        return message.channel.send(data, { split: true })
            .then(async (msges) => {
                if (deleteAfter != undefined && deleteAfter != null) {
                    let promises;
                    promises = msges.map(msg => msg.delete({ timeout: deleteAfter }));
                    await Promise.all(promises);
                }
            })
            .catch(console.error);
    }

    function react(message, emoji = Emoji.success) {
        return message.react(emoji)
            .catch(console.error);
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
        return `${Math.floor(tempDur / 60)}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function checkNumber(arg, min, max, notInRangeError = 'Number ${nr} is not in range.') {
        const nr = parseInt(arg);
        if (!Number.isInteger(nr)) throw 'Nr is not an integer.';

        notInRangeError = replaceIfExits(notInRangeError, '${nr}', nr);
        notInRangeError = replaceIfExits(notInRangeError, '${min}', min);
        notInRangeError = replaceIfExits(notInRangeError, '${max}', max);

        if (min && nr < min || max && nr > max) throw notInRangeError;
        return nr;
    }

    function replaceIfExits(content, searchFor, replaceWith) {
        if (searchFor != undefined && searchFor != null && replaceWith != undefined && replaceWith != null && content.includes(searchFor)) {
            content = content.replace(searchFor, replaceWith)
        }
        return content;
    }

    return public;
})();

module.exports = Module;