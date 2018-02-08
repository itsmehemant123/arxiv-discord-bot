const { Command } = require('discord-akairo');
var Client = require('node-rest-client').Client;
var logger = require('winston');
var Promise = require('bluebird');
var rp = require('request-promise');
var parseString = Promise.promisify(require('xml2js').parseString);

const ARXIV_ID = /\d{4}\.\d{4,5}/;
const ARXIV_LINK = /(?:https?:\/\/)?arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})(?:v\d+)?(?:.pdf)?/g;
const ARXIV_API_URL = 'http://export.arxiv.org/api/query?search_query=id:';

class ArXivUnfurlCommand extends Command {
    constructor() {
        super('talk', {
            channelRestriction: 'guild',
            trigger: /.*arxiv.org.*/,
        });
    }

    exec(message) {
        var link = message.content;
        this.fetchArxiv(link.match(ARXIV_ID)[0]).then(arxiv => {
            const payload = this.formatArxivAsAttachment(arxiv);

            return message.channel.send({
                embed: payload
            }).catch(function (err) {
                logger.error('ERROR: ', err);
            });
        });
    }

    fetchArxiv(arxivId, callback) {
        return rp(ARXIV_API_URL + arxivId).then(this.parseApiResponseBody);
    }

    parseApiResponseBody(body) {
        return parseString(body).then(result => {
            if (!result.feed.entry) {
                throw new Error('ArXiv entry not found');
            }
            var entry = result.feed.entry[0];
            return {
                id: entry.id ?
                    entry.id[0].split('/').pop() :
                    '{No ID}',
                url: entry.id ?
                    entry.id[0] :
                    '{No url}',
                title: entry.title ?
                    entry.title[0].trim().replace(/\n/g, ' ') :
                    '{No title}',
                summary: entry.summary ?
                    entry.summary[0].trim().replace(/\n/g, ' ') :
                    '{No summary}',
                authors: entry.author ?
                    entry.author.map(function (a) { return a.name[0]; }) :
                    '{No authors}',
                categories: entry.category ? entry.category.map(c => c.$.term) : [],
                updated_time: Date.parse(entry.updated),
            };
        });
    }

    formatArxivAsAttachment(arxivData) {
        return {
            // author: {
            //     name: this.client.user.username,
            //     icon_url: this.client.user.avatarURL
            // },
            title: '[' + arxivData.id + '] ' + arxivData.title,
            url: arxivData.url,
            description: arxivData.summary,
            fields: [{
                name: "Authors",
                value: arxivData.authors.join(', ')
            }],
            footer: {
                text: arxivData.categories.join(', '),
            },
            timestamp: new Date(arxivData.updated_time).toISOString(),
            color: 0xcc3333,
        };
    }
}

module.exports = ArXivUnfurlCommand;
