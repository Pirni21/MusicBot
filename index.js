const { spawn } = require('child_process');

function botStarter() {
    try {
        const bot = spawn('npm', ['run', 'start-bot']);
    
        bot.stdout.on('data', (data) => {
            console.log(`${data}`);
        });
    
        bot.stderr.on('data', (data) => {
            console.error(`${data}`);
        });
        
        bot.on('close', () => {
            console.log("Bot exited, restaring ...")
            botStarter();
        });

    } catch (err) {
        console.error("Something went really wrong!");
        return;
    }
}

botStarter();