const cohere = require('cohere-ai');
const secrets = require('./secretManager');

async function getEmbedding(input) {
	const response = await getEmbeddings([input]);
	return response;
}

async function getEmbeddings(inputs) {
	cohere.init(secrets.getCohereApiKey());
	const response = await cohere.embed({
		texts: inputs
	})
	return response;
}

module.exports = { getEmbedding, getEmbeddings };
