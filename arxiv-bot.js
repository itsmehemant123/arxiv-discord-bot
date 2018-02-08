const { AkairoClient } = require('discord-akairo');
var logger = require('winston');
var auth = require('./config/auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const client = new AkairoClient({
    ownerID: '<your_discord_hidden_id>',
    allowMention: true,
    prefix: '!',
    commandDirectory: './commands/',
    listenerDirectory: './listeners/',

    }, {
        disableEveryone: true
    });

client.login(auth.token);
