const { AkairoClient } = require('discord-akairo');
var logger = require('winston');
var auth = require('./config/auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const client = new AkairoClient({
    ownerID: '154539912253800449',
    allowMention: true,
    prefix: '!',
    commandDirectory: './commands/',
    listenerDirectory: './listeners/',

    }, {
        disableEveryone: true
    });

client.login(auth.token);
