const BasicActions = require('../core/basics');

const public = {
    name: 'reload',
    description: 'Reloads a command',
    adminOnly: true,
    usage: '[command name]',
    execute: execute
}

function execute(message, args) {
    try {
        BasicActions.fail_if(!args.length, `You didn't pass any command to reload, ${message.author}!`)

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        BasicActions.fail_if(!command, `There is no command with name or alias \`${commandName}\`, ${message.author}!`)

        delete require.cache[require.resolve(`./${commandName}.js`)];

        const newCommand = require(`./${commandName}.js`);
        message.client.commands.set(newCommand.name, newCommand);

        BasicActions.send(message, `Command \`${commandName}\` was reloaded!`);
    } catch (err) {
        console.error(`Error: ${err}`);
        BasicActions.send(message, `There was an error while reloading a command:\n\`${err}\``);
    }
}

module.exports = public;