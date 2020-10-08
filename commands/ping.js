const BasicActions = require('../core/basics');

const public = {
    name: 'ping',
    description: 'Returns pong',
    execute: execute
}

function execute(message, args) {
    BasicActions.send(message, 'pong');
}

module.exports = public;