const secrets = require('../config.json');

function getCohereSecrets() {
	return secrets.cohere;
}

function getDiscordSecrets() {
	return secrets.discord;
}

function getPineconeSecrets() {
	return secrets.pinecone;
}

module.exports = { getCohereSecrets, getDiscordSecrets, getPineconeSecrets};
