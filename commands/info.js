const BasicActions = require('../core/basics');
const runtimeConfig = require('../configs/runtimeConfigs.js');
const { PERMISSION } = require('../configs/runtimeConfigs.js');

const public = {
    name: 'info',
    aliases: ['status'],
    description: `Get a runtime info object`,
    execute: execute
}

async function execute(message, args) {
    try {
        let returnValue = 'Info:\r\n';

        let permission = PERMISSION.User;
        if (message.isModerator) permission = PERMISSION.Moderator;
        else if (message.isAdmin) permission = PERMISSION.Admin;

        let infoObject = runtimeConfig.info(permission);

        let keys = Object.keys(infoObject);
        keys.forEach((key) => {
            returnValue += `${key}: ${infoObject[key]}\r\n`;
        });

        BasicActions.send(message, returnValue, 60000);
    } catch (err) {
        console.error(`Error (p:${args[0]}): ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;