const { Command } = require('discord-akairo');
var logger = require('winston');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            ownerOnly: true,
            aliases: ['ping']
        });
    }

    exec(message) {
        logger.info('PINGED')
        return message.reply('Pong!');
    }
}

module.exports = PingCommand;
