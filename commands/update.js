const BasicActions = require('../core/basics');
const { spawn } = require('child_process');

const public = {
    name: 'update',
    description: 'Updates the bot to the newest version and restarts it. WARNING: The Queue and other things will be reset!',
    adminOnly: true,
    execute: execute
}

function execute(message, args) {
    try {
        BasicActions.send(message, 'Update: Starting the update');
        console.log('Starting update');

        const git = spawn('git', ['pull']);
    
        git.stderr.on('data', (data) => {
            BasicActions.send(message, 'Error: The update did not work');
            console.error(`${data}`);
        });
        
        git.on('close', (code) => {
            if (code === 0) {
                BasicActions.send(message, 'Update: Restarting now');
                console.log('Restarting because of update');
                process.exit(0)
            } else {
                BasicActions.send(message, 'Error: The update did not work');
                console.error(`Git exit code: ${code}`);
            }
        });

    } catch (err) {
        console.error("Something went wrong while updating the bot");
        return;
    }
}

module.exports = public;