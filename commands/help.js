const { prefix } = require('../configs/config.json');
const BasicActions = require('../core/basics');

const public = {
    name: 'help',
    aliases: ['commands'],
    description: 'List all of my commands or info about a specific command.',
    usage: '[command name]',
    execute: execute
}

function execute(message, args) {
    try {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:\r\n');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return BasicActions.send(message, data);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return BasicActions.reply(message, 'that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.adminOnly) data.push(`**AdminOnly:** ${command.adminOnly}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        else data.push(`**Usage:** ${prefix}${command.name}`);

        if (command.cooldown) {
            data.push(`**Cooldown:** ${command.cooldown} second(s)`);
        }

        BasicActions.send(message, data);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `Error: ${err}`);
    }
}

module.exports = public;