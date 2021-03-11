const BasicActions = require('../core/basics');
const { KEYS, set, get } = require('../configs/runtimeConfigs.js');

const public = {
    name: 'mo',
    aliases: ['moderatorOnly', 'moderator'],
    description: `Activates moderator+ mode`,
    fromModerator: true,
    execute: execute
}

async function execute(message, args) {
    try {
        let newState = !get(KEYS.mo);
        set(KEYS.mo, newState)
        BasicActions.send(message, `${newState ? 'on' : 'off'}`);
    } catch (err) {
        console.error(`Error (p:${args[0]}): ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;