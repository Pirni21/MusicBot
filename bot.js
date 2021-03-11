const { prefix, token, admins, moderators } = require('./configs/config.json');
const fs = require('fs');
const Discord = require('discord.js');
const BasicActions = require('./core/basics');
const DiscordPlayer = require('./music/discord');
const runtimeConfig = require('./configs/runtimeConfigs');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.login(token);

DiscordPlayer.init(client);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async function (message) {
    const content = BasicActions.getMessage(message);
    try {
        if (!content.startsWith(prefix) || message.author.bot) return;

        const args = content.slice(prefix.length).split(' ');
        const commandName = args.shift().toLowerCase();

        const isAdmin = admins.includes(message.author.id);
        const isModerator = moderators.includes(message.author.id);
        message.isAdmin = isAdmin;
        message.isModerator = isModerator;

        if (runtimeConfig.get(runtimeConfig.KEYS.mo) && !isAdmin && !isModerator) {
            BasicActions.react(message, BasicActions.Emoji.sleep);
            return;
        }

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            BasicActions.react(message, BasicActions.Emoji.unknown);
            return;
        }

        if (command.adminOnly && !isAdmin) {
            BasicActions.react(message, BasicActions.Emoji.error);
            console.log(`This is an admin only command ${message.author}`);
            return;
        }

        if(command.fromModerator && !isModerator && !isAdmin) {
            BasicActions.react(message, BasicActions.Emoji.error);
            console.log(`This is a moderator+ command ${message.author}`);
            return;
        }

        if (command.cooldown) {
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return BasicActions.reply(message, `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.guildOnly && message.channel.type !== 'text') {
            BasicActions.reply(message, 'I can\'t execute that command inside DMs!');
            return
        }

        command.execute(message, args);
    } catch (er) {
        console.error('Error: ' + er);
    }
});