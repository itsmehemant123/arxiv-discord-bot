const { Command } = require('discord-akairo');
var logger = require('winston');

class AyyCommand extends Command {
    constructor() {
        super('ayy', {
            ownerOnly: true,
            trigger: /ay+/
        });
    }

    exec(message, match, groups) {
        return message.reply('lmao').catch(function (err) {
            logger.error('error: ', err)
        });
    }
}

module.exports = AyyCommand;
