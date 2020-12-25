const BasicActions = require('../core/basics');

const public = {
    name: 'ping',
    description: 'Returns pong',
    execute: execute
}

function execute(message, args) {
    BasicActions.react(message, BasicActions.Emoji.pong);
}

module.exports = public;