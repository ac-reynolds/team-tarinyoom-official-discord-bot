const secrets = require('../config.json');

function getCohereApiKey() {
	return secrets.cohereApiKey;
}

function getDiscordToken() {
	return secrets.discordBotToken;
}

function getPineconeToken() {
	return secrets.pineconeApiKey;
}

module.exports = { getCohereApiKey, getDiscordToken, getPineconeToken};
