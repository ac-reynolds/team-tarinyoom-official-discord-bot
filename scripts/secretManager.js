const secrets = require('../config.json');

function getCohereApiKey() {
	return secrets.cohereApiKey;
}

function getDiscordToken() {
	return secrets.discordBotToken;
}

module.exports = { getCohereApiKey, getDiscordToken };
