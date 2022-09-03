const cohere = require('cohere-ai');
const secrets = require('./secretManager');

async function getEmbedding(input) {
	const embedding = await getEmbeddings([input]);
	return embedding;
}

async function getEmbeddings(inputs) {
	try {
		cohere.init(secrets.getCohereApiKey());
		const response = await cohere.embed({
			texts: inputs
		})
		return response.body.embeddings;	
	} catch (error) {
		console.error(`Error communicating with Cohere backend. Response code: ${response.statusCode}`);
	}
}

module.exports = { getEmbedding, getEmbeddings };
