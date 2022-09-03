const secrets = require('../config.json');

function getCohereApiKey() {
	return secrets.cohereApiKey;
}

function getDiscordToken() {
	return secrets.discordBotToken;
}

function getPineconeApiKey() {
	return secrets.pineconeApiKey;
}

function getPineconeUrl() {
	return secrets.pineconeBaseUrl;
}

module.exports = { getCohereApiKey, getDiscordToken, getPineconeApiKey, getPineconeUrl};
